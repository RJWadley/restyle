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
  nonce?: string,
  options?: {
    selectorMode?: 'normal' | 'where'
    classPrefix?: string
  }
): [string, () => React.JSX.Element] {
  const style = cssInputToString(styles)
  const selectorMode = options?.selectorMode ?? 'normal'
  const classPrefix = options?.classPrefix ?? 'c'

  // include selectorMode in the hash to avoid React 19 style dedupe collisions
  const className = `${classPrefix}${hash(selectorMode + '|' + style)}`
  const rootSelector =
    selectorMode === 'where' ? `:where(.${className})` : `.${className}`
  const rules = `${rootSelector}{${style}}`

  function Style() {
    return (
      <style href={className} precedence="rs" nonce={nonce}>
        {rules}
      </style>
    )
  }

  return [className, Style]
}
