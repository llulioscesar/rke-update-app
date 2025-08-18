import { type JSX, splitProps, createContext, useContext, createMemo } from "solid-js"
import { Tooltip as TooltipPrimitive } from "@kobalte/core/tooltip"

import { cn } from "~/lib/utils"

// Context para el TooltipProvider
type TooltipProviderContextValue = {
  delayDuration: number
  skipDelayDuration: number
}

const TooltipProviderContext = createContext<TooltipProviderContextValue>({
  delayDuration: 0,
  skipDelayDuration: 300,
})

type TooltipProviderProps = {
  delayDuration?: number
  skipDelayDuration?: number
  children: JSX.Element
}

function TooltipProvider(props: TooltipProviderProps) {
  const [local, others] = splitProps(props, ["delayDuration", "skipDelayDuration", "children"])

  const contextValue: TooltipProviderContextValue = {
    delayDuration: local.delayDuration ?? 0,
    skipDelayDuration: local.skipDelayDuration ?? 300,
  }

  return (
    <TooltipProviderContext.Provider value={contextValue}>
      <div data-slot="tooltip-provider" {...others}>
        {local.children}
      </div>
    </TooltipProviderContext.Provider>
  )
}

type TooltipProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  openDelay?: number
  closeDelay?: number
  children: JSX.Element
} & Omit<Parameters<typeof TooltipPrimitive>[0], "children">

function Tooltip(props: TooltipProps) {
  const [local, others] = splitProps(props, ["openDelay", "closeDelay"])
  const context = useContext(TooltipProviderContext)

  return (
    <TooltipPrimitive
      data-slot="tooltip"
      openDelay={local.openDelay ?? context.delayDuration}
      closeDelay={local.closeDelay ?? context.delayDuration}
      skipDelayDuration={context.skipDelayDuration}
      {...others}
    />
  )
}

type TooltipTriggerProps = Parameters<typeof TooltipPrimitive.Trigger>[0]

function TooltipTrigger(props: TooltipTriggerProps) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

type TooltipContentProps = {
  class?: string
  gutter?: number
  children?: JSX.Element
} & Parameters<typeof TooltipPrimitive.Content>[0]

function TooltipContent(props: TooltipContentProps) {
  const [local, others] = splitProps(props, ["class", "gutter", "children"])

  const contentClasses = createMemo(() => cn(
    "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95 data-[placement^=bottom]:slide-in-from-top-2 data-[placement^=left]:slide-in-from-right-2 data-[placement^=right]:slide-in-from-left-2 data-[placement^=top]:slide-in-from-bottom-2 z-50 w-fit origin-[var(--kb-tooltip-content-transform-origin)] rounded-md px-3 py-1.5 text-xs text-balance",
    local.class
  ))

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        gutter={local.gutter ?? 4}
        class={contentClasses()}
        {...others}
      >
        {local.children}
        <TooltipPrimitive.Arrow class="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }