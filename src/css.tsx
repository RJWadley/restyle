import * as React from 'react'

import { createStyles } from './create-styles.js'
import type { CSSObject } from './types.js'
import { hash } from './utils.js'

/**
 * Generates CSS from an object of styles.
 * @returns A class name and a style element.
 */
export function css(
  styles: CSSObject,
  nonce?: string
): [string, () => React.JSX.Element] {
  const className = 'c' + hash(JSON.stringify(styles))
  const rules = `.${className}{${createStyles(styles)}}`

  function Style() {
    return (
      <style href={className} precedence="rs" nonce={nonce}>
        {rules}
      </style>
    )
  }

  return [className, Style]
}
