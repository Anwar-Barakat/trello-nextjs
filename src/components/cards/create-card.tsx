"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { handleServerError } from "@/utils/error.utils";
import { cardFormSchema, type CardFormSchema } from "@/schemas/card.schema";
import { CardService } from "@/services/card.service";
import { prisma } from "@/lib/prisma";

export const createCard = async (data: CardFormSchema) => {
    const { orgId, userId } = await auth();

    if (!userId || !orgId) {
        return {
            success: false,
            message: "Unauthorized",
            code: "UNAUTHORIZED",
            status: 401,
        };
    }

    // Validate the list exists and belongs to the user's organization
    const list = await prisma.list.findFirst({
        where: {
            id: data.listId,
            board: {
                organizationId: orgId,
            },
        },
        include: {
            board: {
                select: {
                    id: true,
                },
            },
        },
    });

    if (!list) {
        return {
            success: false,
            message: "List not found or you don't have access",
            code: "NOT_FOUND",
            status: 404,
        };
    }

    // Validate the form data
    const validationResult = cardFormSchema.safeParse(data);

    if (!validationResult.success) {
        const errorMessage =
            validationResult.error.errors[0]?.message || "Invalid form data";
        return {
            success: false,
            message: errorMessage,
            code: "VALIDATION_ERROR",
            status: 400,
        };
    }

    try {
        const card = await CardService.create(data);

        // Revalidate cache
        revalidatePath(`/board/${list.board.id}`);

        return {
            success: true,
            message: "Card created successfully",
            data: card,
        };
    } catch (error) {
        return handleServerError(error);
    }
};