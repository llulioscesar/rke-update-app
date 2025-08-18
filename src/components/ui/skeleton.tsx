import { JSX, splitProps, createMemo } from "solid-js"
import { cn } from "~/lib/utils"

interface SkeletonProps {
    class?: string
    children?: JSX.Element
    [key: string]: any
}

function Skeleton(props: SkeletonProps) {
    const [local, others] = splitProps(props, ["class"])

    const skeletonClasses = createMemo(() => cn(
        "bg-accent animate-pulse rounded-md", 
        local.class
    ))

    return (
        <div
            data-slot="skeleton"
            class={skeletonClasses()}
            {...others}
        />
    )
}

export { Skeleton }