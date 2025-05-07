"use server";

import { auth } from "@clerk/nextjs/server";
import type { StripeSchema } from "./schema";
import stripe from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

export async function stripeRedirect(data: StripeSchema) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return { error: "Unauthorized" };
    }

    const settingUrl = absoluteUrl(`/organization/${orgId}`);

    try {
      // Create checkout session without requiring email
      const checkoutSession = await stripe.checkout.sessions.create({
        success_url: settingUrl,
        cancel_url: settingUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        // Don't use user.emailAddresses since it might be undefined
        // Allow customer to enter email during checkout instead
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

      const url = checkoutSession.url || "";
      return { data: url };
    } catch (stripeError) {
      console.error("Stripe API error:", stripeError);
      return { error: "Failed to create Stripe session" };
    }
  } catch (error) {
    console.error("General error in stripeRedirect:", error);
    return { error: "An unexpected error occurred" };
  }
}
