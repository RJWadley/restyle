import * as React from 'react'

import { createCss } from './create-css.js'

/** Create a `restyle` JSX props object that handles the `css` prop to generate atomic class names. */
export function createRestyleProps(
  type: string,
  props: Record<string, any>
): [Record<string, any>, (() => React.ReactNode) | null] {
  if (!props || !props.css) {
    return [props, null]
  }

  const [classNames, Styles] = createCss(props.css)

  delete props.css

  props.className = props.className
    ? `${props.className} ${classNames}`
    : classNames

  return [props, Styles]
}
