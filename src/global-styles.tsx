import { cssInputToString } from './css-input-to-string.js'
import type { CSSObject } from './types.js'
import { hash } from './utils.js'

/** Generates styles from an object of styles. */
export function GlobalStyles({
  children,
  nonce,
}: {
  children: CSSObject | string
  nonce?: string
}) {
  const rules = cssInputToString(children)
  const id = hash(rules)

  return (
    <style href={id} precedence="rsg" nonce={nonce}>
      {rules}
    </style>
  )
}
