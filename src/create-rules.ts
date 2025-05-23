import type {
  CSSObject,
  CSSRule,
  CSSRulePrecedences,
  CSSValue,
} from './types.js'
import { resolveNestedSelector, l, m, u, hash } from './utils.js'

/** Create a single CSS rule from a CSS object. */
export function createRule(
  name: string,
  selector: string,
  prop: string,
  value: CSSValue
): string {
  let className = ''

  if (selector === '') {
    className = '.' + name
  } else if (selector.includes('&')) {
    className = selector.replaceAll('&', '.' + name)
  } else {
    className =
      '.' + name + (selector.startsWith(':') ? selector : ' ' + selector)
  }

  const hyphenProp = prop.replace(/[A-Z]|^ms/g, '-$&').toLowerCase()
  let parsedValue: CSSValue
  if (prop.startsWith('--') || u.test(prop)) {
    parsedValue = value
  } else {
    parsedValue = typeof value === 'number' ? value + 'px' : value
  }

  return className.trim() + '{' + hyphenProp + ':' + parsedValue + '}'
}

/** Create a string of CSS class names and rules ordered by precedence from a CSS object. */
export function createRules(
  styles: CSSObject,
  selector = '',
  atRules: string[] = []
): [classNames: string, rules: CSSRulePrecedences] {
  const lowRules: CSSRule[] = []
  const mediumRules: CSSRule[] = []
  const highRules: CSSRule[] = []
  const nested: CSSRulePrecedences[] = []
  let classNames = ''

  for (const key in styles) {
    const value = styles[key as keyof CSSObject]

    if (value === undefined || value === null) {
      continue
    }

    if (typeof value === 'object') {
      let nestedClass = ''
      let nestedRules: CSSRulePrecedences

      if (key.startsWith('@')) {
        atRules.push(key)
        ;[nestedClass, nestedRules] = createRules(
          value as CSSObject,
          selector,
          atRules
        )
        atRules.pop()
      } else {
        ;[nestedClass, nestedRules] = createRules(
          value as CSSObject,
          resolveNestedSelector(key, selector),
          atRules
        )
      }

      classNames += nestedClass + ' '
      nested.push(nestedRules)
      continue
    }

    const precedence = l.has(key) ? 'l' : m.has(key) ? 'm' : 'h'
    const className =
      precedence + hash(key + value + selector + atRules.join(''))
    let rule = createRule(className, selector, key, value)
    if (atRules.length > 0) {
      const atPrefix = atRules.join('{') + '{'
      const atSuffix = '}'.repeat(atRules.length)
      rule = atPrefix + rule + atSuffix
    }
    classNames += className + ' '
    if (precedence === 'l') {
      lowRules.push([className, rule])
    } else if (precedence === 'm') {
      mediumRules.push([className, rule])
    } else {
      highRules.push([className, rule])
    }
  }

  return [classNames.trim(), [lowRules, mediumRules, highRules, nested]]
}
