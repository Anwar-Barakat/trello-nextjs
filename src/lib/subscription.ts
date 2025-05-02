import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async (organizationId: string) => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  const subscription = await prisma.orgSubscription.findUnique({
    where: { organizationId: orgId },
    select: {
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      stripePriceId: true,
      stripeCurrentPeriodEnd: true,
    },
  });

  if (!subscription) {
    return false;
  }

  const isValid =
    subscription.stripePriceId &&
    subscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

  return !!isValid;
};
