import * as React from 'react'

import { cssInputToString } from './css-input-to-string.js'
import type { CSSObject } from './types.js'
import { hash } from './utils.js'

/**
 * Generates CSS from an object of styles.
 * @returns A class name and a style element.
 */
export function createCss(
  styles: CSSObject | string,
  nonce?: string
): [string, () => React.JSX.Element] {
  const style = cssInputToString(styles)
  const className = 'c' + hash(style)
  const rules = `.${className}{${style}}`

  function Style() {
    return (
      <style href={className} precedence="rs" nonce={nonce}>
        {rules}
      </style>
    )
  }

  return [className, Style]
}
