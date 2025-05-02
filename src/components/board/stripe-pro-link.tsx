"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { stripeRedirect } from "@/actions/stripe/stripe-redirect";
export const StripeProLink = () => {
    const router = useRouter();

    const handleUpgrade = async () => {
        const url = await stripeRedirect({});
        if (url.data) {
            router.push(url.data);
        }
    };

    return (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
            <p>You have reached the maximum number of boards
            </p>
            <Button onClick={handleUpgrade}>Upgrade your plan</Button>
        </div>
    );
};