import { JSX, Component, splitProps, children as solidChildren, createMemo, mergeProps } from "solid-js";
import { Dynamic } from "solid-js/web";

interface SlotProps2 {
    children?: JSX.Element;
    [key: string]: any;
}

// Slot2: Toma el primer hijo y le pasa las props del padre usando Dynamic
const Slot2: Component<SlotProps2> = (props) => {
    const child = props.children;

    if (child instanceof HTMLElement) {
        const Tag = child.tagName.toLowerCase() as keyof JSX.IntrinsicElements;
        return <Tag {...props}>{child.innerHTML}</Tag>
    }

    return child;
}

interface SlotProps {
    children?: JSX.Element;
    ref?: any;
    [key: string]: any;
}

// Componente Slot simplificado para SolidJS
const Slot: Component<SlotProps> = (props) => {
    const [local, others] = splitProps(props, ['children', 'ref']);
    
    const resolved = solidChildren(() => local.children);
    
    const slotContent = createMemo(() => {
        const child = resolved();
        
        if (!child) return null;
        
        // Si es un array, tomamos el primer elemento
        const element = Array.isArray(child) ? child[0] : child;
        
        // Si es primitivo (string, number), lo envolvemos
        if (typeof element === 'string' || typeof element === 'number') {
            return <span {...others} ref={local.ref}>{element}</span>;
        }

        const elementProps = (element as any).props || {};
        const elementType = (element as any).type || (element as any).component || 'div';

        console.log(elementProps, elementType, element);

        // Merge las props del padre con las del hijo
        const mergedProps = mergeProps(elementProps, others);
        console.log(mergedProps);
        
        // Para elementos JSX complejos, usamos Dynamic como fallback
        return (
            <Dynamic
                component={elementType}
                {...mergedProps}
                ref={local.ref}
            >
                {element}
            </Dynamic>
        );
    });
    
    return slotContent();
};

// Versión alternativa más simple
const SlotSimple: Component<SlotProps> = (props) => {
    const [local, others] = splitProps(props, ['children', 'ref']);
    
    return (
        <div {...others} ref={local.ref}>
            {local.children}
        </div>
    );
};

export {
    Slot,
    Slot2,
    SlotSimple as SlotAdvanced
};