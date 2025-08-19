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

  // ensure css-prop classes do not look like styled classes
  // so that styled's classification based on className remains accurate
  // use a distinct prefix for css-prop generated classes
  // (keeping the default 'c' would be fine but we want to future-proof)
  // NOTE: This relies on createCss salting the hash with mode and using provided prefix
  // We call it again with the desired prefix to get the same styles with rc* class
  // while avoiding duplication we only want one style element; so compute once with options
  const [rcClassNames, RcStyles] = createCss(props.css, undefined, {
    classPrefix: 'rc',
  })

  delete props.css

  props.className = props.className
    ? `${props.className} ${rcClassNames}`
    : rcClassNames

  return [props, RcStyles]
}
