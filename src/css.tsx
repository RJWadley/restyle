import * as React from 'react'

import { createRules } from './create-rules.js'
import { ClientStyles } from './client-styles.js'
import type { CSSObject } from './types.js'

/**
 * Generates CSS from an object of styles.
 * @returns Atomic class names for each rule and style elements for each precedence.
 */
export function css(
  styles: CSSObject,
  nonce?: string,
  classOverrides?: string[]
): [string, () => React.JSX.Element] {
  const [classNames, rules] = createRules(styles, '', [], classOverrides)

  function Styles() {
    return <ClientStyles r={rules} n={nonce} />
  }

  return [classNames, Styles]
}
