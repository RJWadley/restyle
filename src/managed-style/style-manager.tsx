class StyleSheet {
  hrefs: string[]
  element: HTMLStyleElement
  precedence: string

  constructor({
    precedence,
    styleElement,
  }: {
    precedence: string
    styleElement: HTMLStyleElement
  }) {
    this.hrefs = styleElement.dataset.href?.split(' ') ?? []
    this.element = styleElement
    this.precedence = precedence

    // validate that each rule corresponds to one of the hrefs
    if (this.hrefs.length !== this.element.sheet?.cssRules.length) {
      throw new Error(
        'StyleSheet: the number of rules in the style element does not match the number of hrefs. each href must correspond to exactly one rule.'
      )
    }

    // @ts-expect-error
    window.randomSheet = this
  }

  removeStyle(href: string) {
    const index = this.hrefs.indexOf(href)

    if (index !== -1) {
      this.element.sheet?.deleteRule(index)
      this.hrefs.splice(index, 1)
    }
  }

  upsertStyle(href: string, textContent: string) {
    const index = this.hrefs.indexOf(href)

    if (index === -1) {
      this.element.sheet?.insertRule(
        textContent,
        // we want to insert the rule at the end of the sheet
        this.element.sheet?.cssRules.length ?? 0
      )
      this.hrefs.push(href)
    } else {
      this.element.sheet?.deleteRule(index)
      this.element.sheet?.insertRule(textContent, index)
    }

    this.element.dataset.href = this.hrefs.join(' ')
  }

  renderStyle(href: string, textContent: string | null) {
    if (textContent?.trim()) this.upsertStyle(href, textContent)
    else this.removeStyle(href)
  }
}

class StyleManager {
  levelsInOrder: StyleSheet[] = []
  levelsByPrecedence: Record<string, StyleSheet[]> = {}

  constructor() {
    this.hydrateSelf()
  }

  hydrateSelf() {
    const styles = document.head.querySelectorAll<HTMLStyleElement>(
      'style[data-precedence]'
    )
    this.levelsInOrder = Array.from(styles).map(
      (style) =>
        new StyleSheet({
          precedence: style.dataset.precedence ?? 'never',
          styleElement: style,
        })
    )
    this.levelsByPrecedence = this.levelsInOrder.reduce(
      (acc, level) => {
        acc[level.precedence] = acc[level.precedence] ?? []
        acc[level.precedence]?.push(level)
        return acc
      },
      {} as Record<string, StyleSheet[]>
    )
  }

  removeStyle(href: string) {
    for (const level of this.levelsInOrder) {
      level.removeStyle(href)
    }
  }

  renderStyle({
    precedence,
    href,
    textContent,
    nonce,
  }: {
    precedence: string
    href: string
    textContent: string | null
    nonce?: string
  }) {
    const level = this.levelsByPrecedence[precedence]?.at(-1)
    if (level) {
      level.renderStyle(href, textContent)
      return
    }

    this.hydrateSelf()

    const hydratedLevel = this.levelsByPrecedence[precedence]?.at(-1)
    if (hydratedLevel) {
      hydratedLevel.renderStyle(href, textContent)
      return
    }

    const newElement = document.createElement('style')
    newElement.dataset.precedence = precedence
    newElement.dataset.href = href
    newElement.textContent = textContent
    newElement.nonce = nonce
    document.head.appendChild(newElement)

    const newSheet = new StyleSheet({
      precedence,
      styleElement: newElement,
    })
    this.levelsByPrecedence[precedence] = [newSheet]
    this.levelsInOrder.push(newSheet)
  }
}

let styleManager: StyleManager | undefined

export const getStyleManager = () => {
  if (!styleManager) {
    styleManager = new StyleManager()
  }

  // @ts-expect-error
  window.styleManager = styleManager

  return styleManager
}
