import { type JSX, splitProps, createMemo } from "solid-js"
import { Separator as SeparatorPrimitive } from "@kobalte/core/separator"
import { cn } from "~/lib/utils"

type SeparatorProps = {
  class?: string
  orientation?: "horizontal" | "vertical"
} & JSX.HTMLAttributes<HTMLHRElement>

function Separator(props: SeparatorProps) {
  const [local, others] = splitProps(props, ["class", "orientation"])

  const separatorClasses = createMemo(() => cn(
    "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
    local.class
  ))

  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={local.orientation ?? "horizontal"}
      class={separatorClasses()}
      {...others}
    />
  )
}

export { Separator }