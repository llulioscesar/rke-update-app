import { type JSX, mergeProps, splitProps } from "solid-js"
import { Dialog } from "@kobalte/core/dialog"
import { XIcon } from "lucide-solid"

import { cn } from "~/lib/utils"

type SheetProps = JSX.HTMLAttributes<HTMLDivElement> & {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    modal?: boolean;
    preventScroll?: boolean;
    forceMount?: boolean;
}

function Sheet(props: SheetProps) {
    return <Dialog data-slot="sheet" {...props} />
}

type SheetTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>

function SheetTrigger(props: SheetTriggerProps) {
    return <Dialog.Trigger data-slot="sheet-trigger" {...props} />
}

type SheetCloseProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>

function SheetClose(props: SheetCloseProps) {
    return <Dialog.CloseButton data-slot="sheet-close" {...props} />
}

type SheetPortalProps = JSX.HTMLAttributes<HTMLDivElement> & {
    children: JSX.Element
}

function SheetPortal(props: SheetPortalProps) {
    return <Dialog.Portal data-slot="sheet-portal" {...props} />
}

type SheetOverlayProps = JSX.HTMLAttributes<HTMLDivElement> & {
    class?: string
}

function SheetOverlay(props: SheetOverlayProps) {
    const [local, others] = splitProps(props, ["class"])

    return (
        <Dialog.Overlay
            data-slot="sheet-overlay"
            class={cn(
                "data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 fixed inset-0 z-50 bg-black/50",
                local.class
            )}
            {...others}
        />
    )
}

type SheetContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
    class?: string
    children?: JSX.Element
    side?: "top" | "right" | "bottom" | "left"
}

function SheetContent(props: SheetContentProps) {
    const merged = mergeProps({ side: "right" as const }, props)
    const [local, others] = splitProps(merged, ["class", "children", "side"])

    return (
        <SheetPortal>
            <>
                <SheetOverlay />
                <Dialog.Content
                    data-slot="sheet-content"
                    class={cn(
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
                    )}
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

type SheetHeaderProps = JSX.HTMLAttributes<HTMLDivElement> & {
    class?: string
}

function SheetHeader(props: SheetHeaderProps) {
    const [local, others] = splitProps(props, ["class"])

    return (
        <div
            data-slot="sheet-header"
            class={cn("flex flex-col gap-1.5 p-4", local.class)}
            {...others}
        />
    )
}

type SheetFooterProps = JSX.HTMLAttributes<HTMLDivElement> & {
    class?: string
}

function SheetFooter(props: SheetFooterProps) {
    const [local, others] = splitProps(props, ["class"])

    return (
        <div
            data-slot="sheet-footer"
            class={cn("mt-auto flex flex-col gap-2 p-4", local.class)}
            {...others}
        />
    )
}

type SheetTitleProps = JSX.HTMLAttributes<HTMLHeadingElement> & {
    class?: string
}

function SheetTitle(props: SheetTitleProps) {
    const [local, others] = splitProps(props, ["class"])

    return (
        <Dialog.Title
            data-slot="sheet-title"
            class={cn("text-foreground font-semibold", local.class)}
            {...others}
        />
    )
}

type SheetDescriptionProps = JSX.HTMLAttributes<HTMLParagraphElement> & {
    class?: string
}

function SheetDescription(props: SheetDescriptionProps) {
    const [local, others] = splitProps(props, ["class"])

    return (
        <Dialog.Description
            data-slot="sheet-description"
            class={cn("text-muted-foreground text-sm", local.class)}
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