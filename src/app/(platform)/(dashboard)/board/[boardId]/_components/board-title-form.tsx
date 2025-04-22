'use client'

import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import type { Board } from "@prisma/client"
import { ElementRef, useRef, useState } from "react"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { FormTextInput } from "@/components/global"
import { updateBoard } from "@/actions/board/update-board"

type BoardTitleFormProps = {
    board: Board
}

type FormData = {
    title: string
}

const BoardTitleForm = ({ board }: BoardTitleFormProps) => {
    const formRef = useRef<ElementRef<"form">>(null)
    const inputRef = useRef<ElementRef<"input">>(null)

    const [isEditing, setIsEditing] = useState(false)
    const queryClient = useQueryClient()
    
    const form = useForm<FormData>({
        defaultValues: {
            title: board.title
        }
    })

    const { isLoading } = form.formState

    const onSubmit = async (data: FormData) => {
        try {
            await updateBoard(board.id, data)
            toast.success("Board updated!")
            queryClient.invalidateQueries({ queryKey: ["board", board.id] })
            setIsEditing(false)
        } catch (error) {
            toast.error("Failed to update board")
        }
    }

    const enableEditing = () => {
        setIsEditing(true)
        setTimeout(() => {
            form.setFocus("title")
            inputRef.current?.select()
        }, 0)
    }

    if (isEditing) {
        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} ref={formRef}>
                    <FormTextInput
                        disabled={isLoading}
                        placeholder="Enter board title"
                        {...form.register("title")}
                        control={form.control}
                        ref={inputRef}  
                    />
                </form>
            </Form>
        )
    }
    
    return (
        <div>
            <Button
                variant="transparent"
                className="flex items-center gap-x-2 text-xs md:text-sm p-1.5 w-full justify-start font-normal text-muted-foreground hover:text-primary"
                onClick={enableEditing}
            >
                <Pencil className="h-4 w-4" />
                <span>{board.title}</span>
            </Button>
        </div>
    )
}

export default BoardTitleForm