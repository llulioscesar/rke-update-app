import { JSX, Component, splitProps } from "solid-js"
import { Slot } from "~/lib/utils/slot"
import { ChevronRight, Ellipsis } from "lucide-solid"

import { cn } from "~/lib/utils"

interface BreadcrumbProps extends JSX.HTMLAttributes<HTMLElement> {}

function Breadcrumb(props: BreadcrumbProps) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}

interface BreadcrumbListProps extends JSX.HTMLAttributes<HTMLOListElement> {}

function BreadcrumbList(props: BreadcrumbListProps) {
  const [local, others] = splitProps(props, ["class"])
  
  return (
    <ol
      data-slot="breadcrumb-list"
      class={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        local.class
      )}
      {...others}
    />
  )
}

interface BreadcrumbItemProps extends JSX.HTMLAttributes<HTMLLIElement> {}

function BreadcrumbItem(props: BreadcrumbItemProps) {
  const [local, others] = splitProps(props, ["class"])
  
  return (
    <li
      data-slot="breadcrumb-item"
      class={cn("inline-flex items-center gap-1.5", local.class)}
      {...others}
    />
  )
}

interface BreadcrumbLinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean
}

function BreadcrumbLink(props: BreadcrumbLinkProps) {
  const [local, others] = splitProps(props, ["asChild", "class"])
  
  if (local.asChild) {
    return (
      <Slot
        data-slot="breadcrumb-link"
        class={cn("hover:text-foreground transition-colors", local.class)}
        {...others}
      />
    )
  }

  return (
    <a
      data-slot="breadcrumb-link"
      class={cn("hover:text-foreground transition-colors", local.class)}
      {...others}
    />
  )
}

interface BreadcrumbPageProps extends JSX.HTMLAttributes<HTMLSpanElement> {}

function BreadcrumbPage(props: BreadcrumbPageProps) {
  const [local, others] = splitProps(props, ["class"])
  
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      class={cn("text-foreground font-normal", local.class)}
      {...others}
    />
  )
}

interface BreadcrumbSeparatorProps extends JSX.HTMLAttributes<HTMLLIElement> {
  children?: JSX.Element
}

function BreadcrumbSeparator(props: BreadcrumbSeparatorProps) {
  const [local, others] = splitProps(props, ["children", "class"])
  
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      class={cn("[&>svg]:size-3.5", local.class)}
      {...others}
    >
      {local.children ?? <ChevronRight />}
    </li>
  )
}

interface BreadcrumbEllipsisProps extends JSX.HTMLAttributes<HTMLSpanElement> {}

function BreadcrumbEllipsis(props: BreadcrumbEllipsisProps) {
  const [local, others] = splitProps(props, ["class"])
  
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      class={cn("flex size-9 items-center justify-center", local.class)}
      {...others}
    >
      <Ellipsis class="size-4" />
      <span class="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}