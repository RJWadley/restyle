import type { CSSObject, CSSValue } from './types.js'
import { u } from './utils.js'

/** Convert a CSS object or string into a string of CSS declarations. */
export function cssInputToString(
  styles: CSSObject | string | undefined
): string {
  if (!styles) return ''
  if (typeof styles === 'string') {
    return styles
  }

  let declarations = ''
  let nestedCss = ''

  for (const key in styles) {
    const value = styles[key as keyof CSSObject]

    if (value === undefined || value === null) {
      continue
    }

    if (typeof value === 'object') {
      nestedCss += `${key}{${cssInputToString(value as CSSObject)}}`
      continue
    }

    const hyphenProp = key.replace(/[A-Z]|^ms/g, '-$&').toLowerCase()
    let parsedValue: CSSValue

    if (key.startsWith('--') || u.test(key)) {
      parsedValue = value
    } else {
      parsedValue = typeof value === 'number' ? value + 'px' : value
    }

    declarations += `${hyphenProp}:${parsedValue};`
  }

  return declarations + nestedCss
}
