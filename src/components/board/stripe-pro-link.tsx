"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { stripeRedirect } from "@/actions/stripe/stripe-redirect";
import { useState } from "react";

export const StripeProLink = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleUpgrade = async () => {
        try {
            setIsLoading(true);
            setErrorMessage("");

            // Call the server action directly with empty object
            const result = await stripeRedirect({});

            if (result.data) {
                router.push(result.data);
            } else if (result.error) {
                setErrorMessage(result.error);
                console.error("Stripe error:", result.error);
            }
        } catch (error) {
            setErrorMessage("Failed to connect to payment service");
            console.error("Stripe redirect error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
            <p>You have reached the maximum number of boards</p>

            {errorMessage && (
                <div className="mt-2 p-2 bg-destructive/20 rounded text-xs">
                    Error: {errorMessage}
                </div>
            )}

            <Button
                onClick={handleUpgrade}
                className="mt-2"
                variant="destructive"
                disabled={isLoading}
            >
                {isLoading ? "Processing..." : "Upgrade your plan"}
            </Button>
        </div>
    );
};