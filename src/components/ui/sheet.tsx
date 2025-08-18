import { type JSX, mergeProps, splitProps, createMemo } from "solid-js"
import { Dialog } from "@kobalte/core/dialog"
import { XIcon } from "lucide-solid"

import { cn } from "~/lib/utils"

interface SheetProps {
    [key: string]: any
}

function Sheet(props: SheetProps) {
    return <Dialog data-slot="sheet" {...props} />
}

interface SheetTriggerProps {
    [key: string]: any
}

function SheetTrigger(props: SheetTriggerProps) {
    return <Dialog.Trigger data-slot="sheet-trigger" {...props} />
}

interface SheetCloseProps {
    [key: string]: any
}

function SheetClose(props: SheetCloseProps) {
    return <Dialog.CloseButton data-slot="sheet-close" {...props} />
}

interface SheetPortalProps {
    children: JSX.Element
    [key: string]: any
}

function SheetPortal(props: SheetPortalProps) {
    return <Dialog.Portal data-slot="sheet-portal" {...props} />
}

interface SheetOverlayProps {
    class?: string
    [key: string]: any
}

function SheetOverlay(props: SheetOverlayProps) {
    const [local, others] = splitProps(props, ["class"])

    const overlayClasses = createMemo(() => cn(
        "data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        local.class
    ))

    return (
        <Dialog.Overlay
            data-slot="sheet-overlay"
            class={overlayClasses()}
            {...others}
        />
    )
}

interface SheetContentProps {
    class?: string
    children?: JSX.Element
    side?: "top" | "right" | "bottom" | "left"
    [key: string]: any
}

function SheetContent(props: SheetContentProps) {
    const merged = mergeProps({ side: "right" as const }, props)
    const [local, others] = splitProps(merged, ["class", "children", "side"])

    const contentClasses = createMemo(() => cn(
        "bg-background data-[expanded]:animate-in data-[closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[closed]:duration-300 data-[expanded]:duration-500",
        local.side === "right" &&
        "data-[closed]:slide-out-to-right data-[expanded]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
        local.side === "left" &&
        "data-[closed]:slide-out-to-left data-[expanded]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
        local.side === "top" &&
        "data-[closed]:slide-out-to-top data-[expanded]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
        local.side === "bottom" &&
        "data-[closed]:slide-out-to-bottom data-[expanded]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
        local.class
    ))

    return (
        <SheetPortal>
            <>
                <SheetOverlay />
                <Dialog.Content
                    data-slot="sheet-content"
                    class={contentClasses()}
                    {...others}
                >
                    {local.children}
                    <Dialog.CloseButton class="ring-offset-background focus:ring-ring data-[expanded]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
                        <XIcon class="size-4" />
                        <span class="sr-only">Close</span>
                    </Dialog.CloseButton>
                </Dialog.Content>
            </>
        </SheetPortal>
    )
}

interface SheetHeaderProps {
    class?: string
    children?: JSX.Element
    [key: string]: any
}

function SheetHeader(props: SheetHeaderProps) {
    const [local, others] = splitProps(props, ["class"])

    const headerClasses = createMemo(() => cn("flex flex-col gap-1.5 p-4", local.class))

    return (
        <div
            data-slot="sheet-header"
            class={headerClasses()}
            {...others}
        />
    )
}

interface SheetFooterProps {
    class?: string
    children?: JSX.Element
    [key: string]: any
}

function SheetFooter(props: SheetFooterProps) {
    const [local, others] = splitProps(props, ["class"])

    const footerClasses = createMemo(() => cn("mt-auto flex flex-col gap-2 p-4", local.class))

    return (
        <div
            data-slot="sheet-footer"
            class={footerClasses()}
            {...others}
        />
    )
}

interface SheetTitleProps {
    class?: string
    children?: JSX.Element
    [key: string]: any
}

function SheetTitle(props: SheetTitleProps) {
    const [local, others] = splitProps(props, ["class"])

    const titleClasses = createMemo(() => cn("text-foreground font-semibold", local.class))

    return (
        <Dialog.Title
            data-slot="sheet-title"
            class={titleClasses()}
            {...others}
        />
    )
}

interface SheetDescriptionProps {
    class?: string
    children?: JSX.Element
    [key: string]: any
}

function SheetDescription(props: SheetDescriptionProps) {
    const [local, others] = splitProps(props, ["class"])

    const descriptionClasses = createMemo(() => cn("text-muted-foreground text-sm", local.class))

    return (
        <Dialog.Description
            data-slot="sheet-description"
            class={descriptionClasses()}
            {...others}
        />
    )
}

export {
    Sheet,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
}