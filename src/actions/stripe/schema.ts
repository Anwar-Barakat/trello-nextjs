import { z } from "zod";

export const stripeSchema = z.object({});

export type StripeSchema = z.infer<typeof stripeSchema>;
