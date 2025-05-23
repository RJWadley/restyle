import * as React from 'react'

import { css } from './css.js'
import type {
  AcceptsClassName,
  CSSObject,
  DistributiveOmit,
  FunctionComponent,
  StyleResolver,
  StyledComponent,
} from './types.js'
import type { JSX } from './jsx-runtime.js'

/**
 * Creates a JSX component that forwards a `className` prop with the generated
 * atomic class names to the provided `Component`. Additionally, a `css` prop can
 * be provided to override the initial `styles`.
 *
 * Note, the provided component must accept a `className` prop.
 */
export function styled<
  Props extends { className?: string },
  StyleProps extends object,
>(
  Component: FunctionComponent<Props>,
  styles?: CSSObject | StyleResolver<StyleProps, Props>
): StyledComponent<DistributiveOmit<Props, keyof StyleProps> & StyleProps>

export function styled<
  TagName extends keyof JSX.IntrinsicElements,
  StyleProps extends object,
>(
  Component:
    | AcceptsClassName<TagName>
    | React.ComponentClass<{ className?: string }>,
  styles?: CSSObject | StyleResolver<StyleProps, React.ComponentProps<TagName>>
): StyledComponent<
  DistributiveOmit<React.ComponentProps<TagName>, keyof StyleProps> & StyleProps
>

export function styled(
  Component:
    | AcceptsClassName<any>
    | React.ComponentClass<{ className?: string }>
    | FunctionComponent<any>,
  styles?: CSSObject | ((styleProps: any, props: any) => CSSObject)
): StyledComponent<any> {
  return ({
    className: classNameProp,
    css: cssProp,
    ...props
  }: {
    className?: string
    css?: CSSObject
  }) => {
    let parsedStyles: CSSObject

    if (typeof styles === 'function') {
      const styleProps = new Set<string>()

      parsedStyles = styles(
        new Proxy(props, {
          get(target, prop: string) {
            styleProps.add(prop)
            return target[prop as keyof typeof target]
          },
        }),
        props
      )

      // Filter out accessed style props so they are not forwarded to the component
      for (const prop of styleProps) {
        delete props[prop as keyof typeof props]
      }
    } else {
      parsedStyles = styles || {}
    }

    const [classNames, Styles] = css({
      ...parsedStyles,
      ...cssProp,
    })
    const className = classNameProp
      ? classNameProp + ' ' + classNames
      : classNames

    return (
      <>
        <Component className={className} {...props} />
        <Styles />
      </>
    )
  }
}
