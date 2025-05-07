import { prisma } from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type Stripe from "stripe";

// Safely access properties that might not exist in the type definitions
interface SubscriptionWithPeriodEnd {
  current_period_end: number;
  items: {
    data: Array<{
      price: {
        id: string;
      };
    }>;
  };
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      (process.env.STRIPE_WEBHOOK_SECRET as string) ||
        "whsec_5e0f53d73dab18e76882d31abf9b4f3cb1185f90de2a6f91e553aa45779f7de1"
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscriptionResponse = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    const subscription =
      subscriptionResponse as unknown as SubscriptionWithPeriodEnd;

    if (!session.metadata?.organizationId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    await prisma.orgSubscription.create({
      data: {
        organizationId: session.metadata.organizationId,
        stripeSubscriptionId: session.subscription as string,
        stripeCustomerId: session.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscriptionResponse = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    const subscription =
      subscriptionResponse as unknown as SubscriptionWithPeriodEnd;

    await prisma.orgSubscription.update({
      where: {
        stripeCustomerId: session.customer as string,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
