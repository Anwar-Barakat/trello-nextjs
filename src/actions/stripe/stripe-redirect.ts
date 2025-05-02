import { auth } from "@clerk/nextjs/server";
import type { StripeSchema } from "./schema";
import stripe from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const stripeRedirect = async (data: StripeSchema) => {
  const { userId, orgId, user } = await auth();
  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  const settingUrl = absoluteUrl(`/organization/${orgId}`);
  let url = "";

  try {
    const orgSubscription = await prisma.orgSubscription.findUnique({
      where: { organizationId: orgId },
    });

    if (orgSubscription?.stripeCustomerId) {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: orgSubscription.stripeCustomerId,
        return_url: settingUrl,
      });
      url = portalSession.url || settingUrl;
    } else {
      const checkoutSession = await stripe.checkout.sessions.create({
        success_url: settingUrl,
        cancel_url: settingUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: user.emailAddresses[0].emailAddress,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Tallyfy Plan Pro",
                description: "Unlimited boards for your organization",
              },
              unit_amount: 2000,
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ],
        metadata: { organizationId: orgId },
      });
      url = checkoutSession.url || "";
    }
  } catch (error) {
    console.error("Stripe redirect error:", error);
  }

  revalidatePath(`/organization/${orgId}`);
  return { data: url };
};
