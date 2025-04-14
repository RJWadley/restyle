import * as React from 'react'

import { css } from './css.js'
import type {
  AcceptsClassName,
  CompatibleProps,
  CSSObject,
  DistributiveOmit,
  MaybeAsyncFunctionComponent,
  RestrictToRecord,
  StyledOutput,
} from './types.js'
import type { JSX } from './jsx-runtime.js'

// Alias for the styles function in the first overload
type StyleFunctionForComponent<Props, StyleProps> = (
  styleProps: CompatibleProps<NoInfer<Props>, RestrictToRecord<StyleProps>>,
  props: NoInfer<Props>
) => CSSObject

// Alias for the styles function in the second overload
type StyleFunctionForTag<
  TagName extends keyof JSX.IntrinsicElements,
  StyleProps,
> = (
  styleProps: CompatibleProps<
    React.ComponentProps<TagName>,
    RestrictToRecord<StyleProps>
  >,
  props: React.ComponentProps<TagName>
) => CSSObject

// Alias for the output props structure in the first overload
type StyledComponentProps<Props, StyleProps> = DistributiveOmit<
  Props,
  keyof StyleProps
> & {
  css?: CSSObject
  className?: string
} & StyleProps

// Alias for the output props structure in the second overload
type StyledTagProps<
  TagName extends keyof JSX.IntrinsicElements,
  StyleProps,
> = DistributiveOmit<React.ComponentProps<TagName>, keyof StyleProps> & {
  css?: CSSObject
  className?: string
} & StyleProps

/**
 * Creates a JSX component that forwards a `className` prop with the generated
 * atomic class names to the provided `Component`. Additionally, a `css` prop can
 * be provided to override the initial `styles`.
 *
 * Note, the provided component must accept a `className` prop.
 */
export function styled<Props extends { className?: string }, StyleProps>(
  Component: MaybeAsyncFunctionComponent<Props>,
  styles?: CSSObject | StyleFunctionForComponent<Props, StyleProps>
): StyledOutput<StyledComponentProps<Props, StyleProps>>

export function styled<TagName extends keyof JSX.IntrinsicElements, StyleProps>(
  Component:
    | AcceptsClassName<TagName>
    | React.ComponentClass<{ className?: string }>,
  styles?: CSSObject | StyleFunctionForTag<TagName, StyleProps>
): StyledOutput<StyledTagProps<TagName, StyleProps>>

export function styled(
  Component: string | MaybeAsyncFunctionComponent<unknown>,
  styles?: CSSObject | ((styleProps: unknown, props: unknown) => CSSObject)
) {
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
        {/* @ts-expect-error */}
        <Component className={className} {...props} />
        <Styles />
      </>
    )
  }
}
