import {
    type Component, type JSX, createContext, useContext, createSignal, createMemo, onMount, onCleanup, splitProps,
    mergeProps, Show
} from "solid-js"
import {Dynamic} from "solid-js/web"
import {cva} from "class-variance-authority"
import type {VariantProps} from "class-variance-authority"
import {PanelLeftIcon} from "lucide-solid"

import {useIsMobile} from "~/hooks/use-mobile"
import {cn} from "~/lib/utils"
import {Button} from "~/components/ui/button"
import {Input} from "~/components/ui/input"
import {Separator} from "~/components/ui/separator"
import {Skeleton} from "~/components/ui/skeleton"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "~/components/ui/sheet"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "~/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContextProps = {
    state: () => "expanded" | "collapsed"
    open: () => boolean
    setOpen: (open: boolean | ((current: boolean) => boolean)) => void
    openMobile: () => boolean
    setOpenMobile: (open: boolean | ((current: boolean) => boolean)) => void
    isMobile: () => boolean
    toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextProps>()

function useSidebar() {
    const context = useContext(SidebarContext)
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider.")
    }
    return context
}

type SidebarProviderProps = {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children: JSX.Element
} & JSX.HTMLAttributes<HTMLDivElement>

function SidebarProvider(props: SidebarProviderProps) {
    const [local, others] = splitProps(props, ["defaultOpen", "open", "onOpenChange", "class", "style", "children"])

    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = createSignal(false);

    // Estado interno del sidebar
    const [_open, _setOpen] = createSignal(local.defaultOpen ?? true)

    const open = createMemo(() => local.open ?? _open())

    const setOpen = (value: boolean | ((current: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open()) : value
        if (local.onOpenChange) {
            local.onOpenChange(openState)
        } else {
            _setOpen(openState)
        }

        // Guardar el estado en cookie
        if (typeof document !== "undefined") {
            document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
        }
    }

    // Función para alternar el sidebar
    const toggleSidebar = () => {
        const isCurrentlyMobile = isMobile()

        if (isCurrentlyMobile) {
            setOpenMobile(prev => !prev)
        } else {
            setOpen(prev => !prev)
        }
    }

    // Manejador de teclado
    onMount(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
                (event.metaKey || event.ctrlKey)
            ) {
                event.preventDefault()
                toggleSidebar()
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        onCleanup(() => {
            window.removeEventListener("keydown", handleKeyDown)
        })
    })

    // Estado derivado
    const state = createMemo(() => open() ? "expanded" : "collapsed")

    const contextValue: SidebarContextProps = {
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
    }

    return (
        <SidebarContext.Provider value={contextValue}>
            <TooltipProvider delayDuration={0}>
                <div
                    data-slot="sidebar-wrapper"
                    style={Object.assign(
                        {
                            "--sidebar-width": SIDEBAR_WIDTH,
                            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                        },
                        local.style || {}
                    )}
                    class={cn(
                        "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
                        local.class
                    )}
                    {...others}
                >
                    {local.children}
                </div>
            </TooltipProvider>
        </SidebarContext.Provider>
    )
}

type SidebarProps = {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
    class?: string
    children: JSX.Element
} & JSX.HTMLAttributes<HTMLDivElement>

function Sidebar(props: SidebarProps) {
    const [local, others] = splitProps(props, ["side", "variant", "collapsible", "class", "children"])
    const side = local.side ?? "left"
    const variant = local.variant ?? "sidebar"
    const collapsible = local.collapsible ?? "offcanvas"

    const {isMobile, state, openMobile, setOpenMobile} = useSidebar()

    if (collapsible === "none") {
        return (
            <div
                data-slot="sidebar"
                class={cn(
                    "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
                    local.class
                )}
                {...others}
            >
                {local.children}
            </div>
        )
    }

    // Renderizado móvil y desktop
    return (
        <>
            {/* Sidebar móvil */}
            {isMobile() ? (
                <Sheet
                    open={openMobile()}
                    onOpenChange={setOpenMobile}
                    modal={true}
                    preventScroll={true}
                    restoreFocus={true}
                    forceMount={false}
                >
                    <SheetContent
                        data-sidebar="sidebar"
                        data-slot="sidebar"
                        data-mobile="true"
                        side={side}
                        tabIndex={-1}
                        class={cn(
                            "bg-sidebar text-sidebar-foreground w-72 sm:w-80 p-0 [&>button]:hidden [&>[data-kobalte-dialog-close-button]]:hidden",
                            local.class
                        )}
                    >
                        <SheetHeader class="sr-only">
                            <SheetTitle>Sidebar</SheetTitle>
                            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
                        </SheetHeader>
                        <div class="flex h-full w-full flex-col">{local.children}</div>
                    </SheetContent>
                </Sheet>
            ) : (
                /* Sidebar desktop */
                <div
                    class="group peer text-sidebar-foreground hidden md:block"
                    data-state={state()}
                    data-collapsible={state() === "collapsed" ? collapsible : ""}
                    data-variant={variant}
                    data-side={side}
                    data-slot="sidebar"
                >
                    {/* Gap del sidebar en desktop */}
                    <div
                        data-slot="sidebar-gap"
                        class={cn(
                            "relative w-64 bg-transparent transition-[width] duration-200 ease-linear",
                            "group-data-[collapsible=offcanvas]:w-0",
                            "group-data-[side=right]:rotate-180",
                            variant === "floating" || variant === "inset"
                                ? "group-data-[collapsible=icon]:w-16"
                                : "group-data-[collapsible=icon]:w-12"
                        )}
                    />
                    <div
                        data-slot="sidebar-container"
                        class={cn(
                            "fixed inset-y-0 z-10 hidden h-svh w-64 transition-[left,right,width] duration-200 ease-linear md:flex",
                            side === "left"
                                ? "left-0 group-data-[collapsible=offcanvas]:-left-64"
                                : "right-0 group-data-[collapsible=offcanvas]:-right-64",
                            variant === "floating" || variant === "inset"
                                ? "p-2 group-data-[collapsible=icon]:w-16"
                                : "group-data-[collapsible=icon]:w-12 group-data-[side=left]:border-r group-data-[side=right]:border-l",
                            local.class
                        )}
                        {...others}
                    >
                        <div
                            data-sidebar="sidebar"
                            data-slot="sidebar-inner"
                            class="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
                        >
                            {local.children}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

type SidebarTriggerProps = {
    class?: string
    onClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>
} & Omit<Parameters<typeof Button>[0], "onClick">

function SidebarTrigger(props: SidebarTriggerProps) {
    const [local, others] = splitProps(props, ["class", "onClick"])
    const {toggleSidebar, isMobile, openMobile, open} = useSidebar()

    return (
        <Button
            data-sidebar="trigger"
            data-slot="sidebar-trigger"
            variant="ghost"
            size="icon"
            class={cn("size-7", local.class)}
            onClick={(event) => {
                local.onClick?.(event)
                // Blur the button to remove focus before opening mobile sidebar
                if (isMobile() && !openMobile()) {
                    (event.currentTarget as HTMLElement).blur()
                }
                toggleSidebar()
            }}
            {...others}
        >
            <PanelLeftIcon/>
            <span class="sr-only">Toggle Sidebar</span>
        </Button>
    )
}

type SidebarRailProps = {
    class?: string
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>

function SidebarRail(props: SidebarRailProps) {
    const [local, others] = splitProps(props, ["class"])
    const {toggleSidebar} = useSidebar()

    return (
        <button
            data-sidebar="rail"
            data-slot="sidebar-rail"
            aria-label="Toggle Sidebar"
            tabIndex={-1}
            onClick={toggleSidebar}
            title="Toggle Sidebar"
            class={cn(
                "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
                "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
                "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
                "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
                "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
                "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
                local.class
            )}
            {...others}
        />
    )
}

type SidebarInsetProps = {
    class?: string
} & JSX.HTMLAttributes<HTMLElement>

function SidebarInset(props: SidebarInsetProps) {
    const [local, others] = splitProps(props, ["class"])

    return (
        <main
            data-slot="sidebar-inset"
            class={cn(
                "bg-background relative flex w-full flex-1 flex-col",
                "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
                local.class
            )}
            {...others}
        />
    )
}

type SidebarInputProps = {
    class?: string
} & Parameters<typeof Input>[0]

function SidebarInput(props: SidebarInputProps) {
    const [local, others] = splitProps(props, ["class"])

    return (
        <Input
            data-slot="sidebar-input"
            data-sidebar="input"
            class={cn("bg-background h-8 w-full shadow-none", local.class)}
            {...others}
        />
    )
}

type SidebarHeaderProps = {
    class?: string
} & JSX.HTMLAttributes<HTMLDivElement>

function SidebarHeader(props: SidebarHeaderProps) {
    const [local, others] = splitProps(props, ["class"])

    return (
        <div
            data-slot="sidebar-header"
            data-sidebar="header"
            class={cn("flex flex-col gap-2 p-2", local.class)}
            {...others}
        />
    )
}

type SidebarFooterProps = {
    class?: string
} & JSX.HTMLAttributes<HTMLDivElement>

function SidebarFooter(props: SidebarFooterProps) {
    const [local, others] = splitProps(props, ["class"])

    return (
        <div
            data-slot="sidebar-footer"
            data-sidebar="footer"
            class={cn("flex flex-col gap-2 p-2", local.class)}
            {...others}
        />
    )
}

type SidebarSeparatorProps = {
    class?: string
} & Parameters<typeof Separator>[0]

function SidebarSeparator(props: SidebarSeparatorProps) {
    const [local, others] = splitProps(props, ["class"])

    return (
        <Separator
            data-slot="sidebar-separator"
            data-sidebar="separator"
            class={cn("bg-sidebar-border mx-2 w-auto", local.class)}
            {...others}
        />
    )
}

type SidebarContentProps = {
    class?: string
} & JSX.HTMLAttributes<HTMLDivElement>

function SidebarContent(props: SidebarContentProps) {
    const [local, others] = splitProps(props, ["class"])

    return (
        <div
            data-slot="sidebar-content"
            data-sidebar="content"
            class={cn(
                "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
                local.class
            )}
            {...others}
        />
    )
}

type SidebarGroupProps = {
    class?: string
} & JSX.HTMLAttributes<HTMLDivElement>

function SidebarGroup(props: SidebarGroupProps) {
    const [local, others] = splitProps(props, ["class"])

    return (
        <div
            data-slot="sidebar-group"
            data-sidebar="group"
            class={cn("relative flex w-full min-w-0 flex-col p-2", local.class)}
            {...others}
        />
    )
}

type SidebarGroupLabelProps = {
    class?: string
    asChild?: boolean
} & JSX.HTMLAttributes<HTMLDivElement>

function SidebarGroupLabel(props: SidebarGroupLabelProps) {
    const [local, others] = splitProps(props, ["class", "asChild"])

    const labelProps = {
        "data-slot": "sidebar-group-label",
        "data-sidebar": "group-label",
        class: cn(
            "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
            "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
            local.class
        ),
        ...others
    }

    return (
        <Dynamic
            component={local.asChild ? "div" : "div"}
            {...labelProps}
        />
    )
}

type SidebarGroupActionProps = {
    class?: string
    asChild?: boolean
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>

function SidebarGroupAction(props: SidebarGroupActionProps) {
    const [local, others] = splitProps(props, ["class", "asChild"])

    const actionProps = {
        "data-slot": "sidebar-group-action",
        "data-sidebar": "group-action",
        class: cn(
            "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
            "after:absolute after:-inset-2 md:after:hidden",
            "group-data-[collapsible=icon]:hidden",
            local.class
        ),
        ...others
    }

    return (
        <Dynamic
            component={local.asChild ? "div" : "button"}
            {...actionProps}
        />
    )
}

type SidebarGroupContentProps = {
    class?: string
} & JSX.HTMLAttributes<HTMLDivElement>

function SidebarGroupContent(props: SidebarGroupContentProps) {
    const [local, others] = splitProps(props, ["class"])

    return (
        <div
            data-slot="sidebar-group-content"
            data-sidebar="group-content"
            class={cn("w-full text-sm", local.class)}
            {...others}
        />
    )
}

type SidebarMenuProps = {
    class?: string
} & JSX.HTMLAttributes<HTMLUListElement>

function SidebarMenu(props: SidebarMenuProps) {
    const [local, others] = splitProps(props, ["class"])

    return (
        <ul
            data-slot="sidebar-menu"
            data-sidebar="menu"
            class={cn("flex w-full min-w-0 flex-col gap-1", local.class)}
            {...others}
        />
    )
}

type SidebarMenuItemProps = {
    class?: string
} & JSX.LiHTMLAttributes<HTMLLIElement>

function SidebarMenuItem(props: SidebarMenuItemProps) {
    const [local, others] = splitProps(props, ["class"])

    return (
        <li
            data-slot="sidebar-menu-item"
            data-sidebar="menu-item"
            class={cn("group/menu-item relative", local.class)}
            {...others}
        />
    )
}

const sidebarMenuButtonVariants = cva(
    "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
    {
        variants: {
            variant: {
                default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                outline:
                    "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
            },
            size: {
                default: "h-8 text-sm",
                sm: "h-7 text-xs",
                lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

type SidebarMenuButtonProps<T extends HTMLElement = HTMLElement> =
    | (Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "class"> & {
    asChild?: false;
    children?: JSX.Element;
    isActive?: boolean;
    tooltip?: string | JSX.IntrinsicElements["div"];
    class?: string;
    variant?: VariantProps<typeof sidebarMenuButtonVariants>["variant"];
    size?: VariantProps<typeof sidebarMenuButtonVariants>["size"];
})
    | (Omit<JSX.HTMLAttributes<T>, "class" | "children"> & {
    asChild: true;
    children: (p: JSX.HTMLAttributes<T>) => JSX.Element;
    isActive?: boolean;
    tooltip?: string | JSX.IntrinsicElements["div"];
    class?: string;
    variant?: VariantProps<typeof sidebarMenuButtonVariants>["variant"];
    size?: VariantProps<typeof sidebarMenuButtonVariants>["size"];
});

function SidebarMenuButton(props: SidebarMenuButtonProps<HTMLButtonElement>): JSX.Element;
function SidebarMenuButton<T extends HTMLElement>(props: SidebarMenuButtonProps<T>): JSX.Element;
function SidebarMenuButton<T extends HTMLElement>(rawProps: SidebarMenuButtonProps<T>): JSX.Element {
    const [local, rest] = splitProps(rawProps as any, [
        "asChild",
        "isActive",
        "variant",
        "size",
        "tooltip",
        "class",
        "children",
    ]);

    const { isMobile, state } = useSidebar();

    const classes = createMemo(() => cn(
        sidebarMenuButtonVariants({
            variant: local.variant ?? "default",
            size: local.size ?? "default"
        }),
        // Aplicar clases activas cuando isActive es true
        local.isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
        local.class
    ));

    const dataAttrs = createMemo(() => ({
            "data-slot": "sidebar-menu-button",
            "data-sidebar": "menu-button",
            "data-size": local.size ?? "default",
            "data-active": local.isActive,
        }
    ));

    // -------- botón nativo --------
    const renderButton = () => (
        <button {...(rest as JSX.ButtonHTMLAttributes<HTMLButtonElement>)} class={classes()} {...dataAttrs()}>
            {local.children}
        </button>
    );

    // -------- asChild (function child) --------
    // Props genéricos de HTMLElement (sin ref para evitar el mismatch con <a/>)
    const renderAsChild = () => {
        const { ref: _omitRef, ...noRef } = (rest as JSX.HTMLAttributes<HTMLElement>) as any;
        const childProps: JSX.HTMLAttributes<HTMLElement> = mergeProps(noRef, { class: classes() }, dataAttrs());
        return (local.children as (p: JSX.HTMLAttributes<HTMLElement>) => JSX.Element)(childProps);
    };

    const button = (
        <Show when={!!local.asChild} fallback={renderButton()}>
            {renderAsChild()}
        </Show>
    );

    // -------- tooltip --------
    if (!local.tooltip) return button;

    const tooltipProps =
        typeof local.tooltip === "string" ? { children: local.tooltip } : local.tooltip;

    return (
        <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent
                side="right"
                align="center"
                hidden={state() !== "collapsed" || isMobile()}
                {...tooltipProps}
            />
        </Tooltip>
    );
}

type SidebarMenuActionProps = {
    class?: string
    asChild?: boolean
    showOnHover?: boolean
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>

function SidebarMenuAction(props: SidebarMenuActionProps) {
    const [local, others] = splitProps(props, ["class", "asChild", "showOnHover"])

    const actionProps = {
        "data-slot": "sidebar-menu-action",
        "data-sidebar": "menu-action",
        class: cn(
            "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
            "after:absolute after:-inset-2 md:after:hidden",
            "peer-data-[size=sm]/menu-button:top-1",
            "peer-data-[size=default]/menu-button:top-1.5",
            "peer-data-[size=lg]/menu-button:top-2.5",
            "group-data-[collapsible=icon]:hidden",
            local.showOnHover &&
            "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
            local.class
        ),
        ...others
    }

    return (
        <Dynamic
            component={local.asChild ? "div" : "button"}
            {...actionProps}
        />
    )
}

type SidebarMenuBadgeProps = {
    class?: string
} & JSX.HTMLAttributes<HTMLDivElement>

function SidebarMenuBadge(props: SidebarMenuBadgeProps) {
    const [local, others] = splitProps(props, ["class"])

    return (
        <div
            data-slot="sidebar-menu-badge"
            data-sidebar="menu-badge"
            class={cn(
                "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
                "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
                "peer-data-[size=sm]/menu-button:top-1",
                "peer-data-[size=default]/menu-button:top-1.5",
                "peer-data-[size=lg]/menu-button:top-2.5",
                "group-data-[collapsible=icon]:hidden",
                local.class
            )}
            {...others}
        />
    )
}

type SidebarMenuSkeletonProps = {
    class?: string
    showIcon?: boolean
} & JSX.HTMLAttributes<HTMLDivElement>

function SidebarMenuSkeleton(props: SidebarMenuSkeletonProps) {
    const [local, others] = splitProps(props, ["class", "showIcon"])

    // Ancho aleatorio entre 50 y 90%
    const width = createMemo(() => `${Math.floor(Math.random() * 40) + 50}%`)

    return (
        <div
            data-slot="sidebar-menu-skeleton"
            data-sidebar="menu-skeleton"
            class={cn("flex h-8 items-center gap-2 rounded-md px-2", local.class)}
            {...others}
        >
            {local.showIcon && (
                <Skeleton
                    class="size-4 rounded-md"
                    data-sidebar="menu-skeleton-icon"
                />
            )}
            <Skeleton
                class="h-4 max-w-(--skeleton-width) flex-1"
                data-sidebar="menu-skeleton-text"
                style={{
                    "--skeleton-width": width(),
                }}
            />
        </div>
    )
}

type SidebarMenuSubProps = {
    class?: string
} & JSX.HTMLAttributes<HTMLUListElement>

function SidebarMenuSub(props: SidebarMenuSubProps) {
    const [local, others] = splitProps(props, ["class"])

    return (
        <ul
            data-slot="sidebar-menu-sub"
            data-sidebar="menu-sub"
            class={cn(
                "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
                "group-data-[collapsible=icon]:hidden",
                local.class
            )}
            {...others}
        />
    )
}

type SidebarMenuSubItemProps = {
    class?: string
} & JSX.LiHTMLAttributes<HTMLLIElement>

function SidebarMenuSubItem(props: SidebarMenuSubItemProps) {
    const [local, others] = splitProps(props, ["class"])

    return (
        <li
            data-slot="sidebar-menu-sub-item"
            data-sidebar="menu-sub-item"
            class={cn("group/menu-sub-item relative", local.class)}
            {...others}
        />
    )
}

type SidebarMenuSubButtonProps = {
    asChild?: boolean
    size?: "sm" | "md"
    isActive?: boolean
    class?: string
} & JSX.AnchorHTMLAttributes<HTMLAnchorElement>

function SidebarMenuSubButton(props: SidebarMenuSubButtonProps) {
    const [local, others] = splitProps(props, ["asChild", "size", "isActive", "class"])

    const subButtonProps = {
        "data-slot": "sidebar-menu-sub-button",
        "data-sidebar": "menu-sub-button",
        "data-size": local.size,
        "data-active": local.isActive,
        class: cn(
            "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
            "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
            local.size === "sm" && "text-xs",
            local.size === "md" && "text-sm",
            "group-data-[collapsible=icon]:hidden",
            local.class
        ),
        ...others
    }

    return (
        <Dynamic
            component={local.asChild ? "div" : "a"}
            {...subButtonProps}
        />
    )
}

export {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
    useSidebar,
}