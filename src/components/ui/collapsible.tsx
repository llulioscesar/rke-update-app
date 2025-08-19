import { Collapsible as CollapsiblePrimitive } from "@kobalte/core/collapsible"
import type { Component, ComponentProps, JSX } from "solid-js"
import { splitProps, Show } from "solid-js"

const Collapsible: Component<ComponentProps<typeof CollapsiblePrimitive>> = (props) => {
  return <CollapsiblePrimitive data-slot="collapsible" {...props} />
}

type CollapsibleTriggerProps = ComponentProps<typeof CollapsiblePrimitive.Trigger> & {
  asChild?: boolean
  children?: JSX.Element | ((props: any) => JSX.Element)
}

const CollapsibleTrigger: Component<CollapsibleTriggerProps> = (rawProps) => {
  const [local, rest] = splitProps(rawProps, ["asChild", "children"])

  // -------- button nativo --------
  const renderButton = () => (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      {...rest}
    >
      {local.children}
    </CollapsiblePrimitive.Trigger>
  )

  // -------- asChild (function child) --------
  const renderAsChild = () => {
    return (
      <CollapsiblePrimitive.Trigger
        data-slot="collapsible-trigger"
        as={local.children as any}
        {...rest}
      />
    )
  }

  return (
    <Show when={!!local.asChild} fallback={renderButton()}>
      {renderAsChild()}
    </Show>
  )
}

const CollapsibleContent: Component<ComponentProps<typeof CollapsiblePrimitive.Content>> = (props) => {
  return (
    <CollapsiblePrimitive.Content
      data-slot="collapsible-content"
      {...props}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }