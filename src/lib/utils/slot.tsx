import { type JSX, children as resolveChildren, mergeProps } from "solid-js"
import { Dynamic } from "solid-js/web"

/**
 * Implementación manual de Slot para SolidJS
 * Transfiere props al primer hijo cuando es posible
 */
export function Slot(props: JSX.HTMLAttributes<any> & { children: JSX.Element }) {
  const { children: childrenProp, ...slotProps } = props
  const resolved = resolveChildren(() => childrenProp)

  return () => {
    const child = resolved()
    
    // Si no hay children, retorna null
    if (!child) return null
    
    // Si hay un array de children, toma el primero
    const targetChild = Array.isArray(child) ? child[0] : child
    
    // Para elementos JSX válidos, intentamos recrear el elemento con las props merged
    if (targetChild && typeof targetChild === 'object' && 'type' in (targetChild as any)) {
      const element = targetChild as any
      const childProps = element.props || {}
      
      // Merge las clases correctamente
      const mergedClass = [slotProps.class, childProps.class].filter(Boolean).join(' ')
      const finalProps = {
        ...slotProps,
        ...childProps,
        class: mergedClass || undefined
      }
      
      // Crear nuevo elemento con props merged
      return {
        ...element,
        props: finalProps
      }
    }
    
    // Fallback: usar Dynamic si no podemos hacer slot
    return <Dynamic component="div" {...slotProps}>{targetChild}</Dynamic>
  }
}