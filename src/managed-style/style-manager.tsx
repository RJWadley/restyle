export const marker = '/*⁂*/'

class PrecedenceSheet {
  private maxLength = 4000
  private rulesByHref: Record<string, string | undefined> = {}
  private element: HTMLStyleElement
  public precedence: string
  public isFull = false
  private needsFlush = false

  constructor({
    nonce,
    precedence,
    adoptSheet,
  }: {
    precedence: string
    adoptSheet?: HTMLStyleElement
    nonce: string | undefined
  }) {
    this.element = adoptSheet ?? document.createElement('style')
    this.precedence = precedence

    // create a sheet in the head for this precedence level
    if (adoptSheet) {
      const href = adoptSheet.dataset.href as string
      const hrefs = href.split(' ')
      const contents = adoptSheet.textContent?.split(marker) ?? []

      for (let i = 0; i < hrefs.length; i++) {
        this.rulesByHref[hrefs[i] ?? ''] = contents[i]
      }
    } else {
      this.element.nonce = nonce
      this.element.dataset.precedence = precedence
    }
  }

  private insertSelf() {
    // short circuit if we already are in the head
    if (document.head.contains(this.element)) return

    const precedenceSheets = document.head.querySelectorAll(
      `style[data-precedence="${this.precedence}"][data-href]`
    )
    const allSheets = document.head.querySelectorAll<HTMLStyleElement>(
      'style[data-precedence][data-href]'
    )
    const precedenceSheet = precedenceSheets[precedenceSheets.length - 1]
    const allSheet = allSheets[allSheets.length - 1]
    if (precedenceSheet) {
      precedenceSheet.after(this.element)
    } else if (allSheet) {
      allSheet.after(this.element)
    } else {
      document.head.appendChild(this.element)
    }
  }

  private removeSelf() {
    this.element.remove()
  }

  public hasHref(href: string) {
    return !!this.rulesByHref[href]
  }

  public renderStyle(href: string, textContent: string | null) {
    this.rulesByHref[href] = textContent ?? ''
    this.needsFlush = true
  }

  public unrenderStyle(href: string) {
    if (this.rulesByHref[href]) {
      this.rulesByHref[href] = undefined
      this.needsFlush = true
    }
  }

  public flush() {
    if (!this.needsFlush) return
    this.needsFlush = false

    this.element.textContent = Object.values(this.rulesByHref)
      .filter(Boolean)
      .join(marker)
    if (this.element.textContent.length) this.insertSelf()
    else this.removeSelf()
    this.isFull = this.element.textContent
      ? this.element.textContent.length > this.maxLength
      : false
  }
}

class StyleManager {
  private usageCountsByHref: Record<string, number> = {}
  private precedences: PrecedenceSheet[] = []
  private needsFlush = false

  constructor(nonce?: string) {
    const existingSheets = document.head.querySelectorAll<HTMLStyleElement>(
      'style[data-precedence][data-href]'
    )

    this.precedences = Array.from(existingSheets).map(
      (style) =>
        new PrecedenceSheet({
          precedence: style.dataset.precedence as string,
          adoptSheet: style,
          nonce,
        })
    )
  }

  public renderStyle({
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
    this.needsFlush = true
    this.usageCountsByHref[href] = (this.usageCountsByHref[href] ?? 0) + 1

    const relevantTags = this.precedences.filter(
      (s) => s.precedence === precedence
    )
    const existingStyle = relevantTags?.find((s) => s.hasHref(href))
    const tagWithRoom = relevantTags.find((s) => !s.isFull)
    if (existingStyle) {
      existingStyle.renderStyle(href, textContent)
    } else if (tagWithRoom) {
      tagWithRoom.renderStyle(href, textContent)
    } else {
      const newSheet = new PrecedenceSheet({ precedence, nonce: nonce })
      newSheet.renderStyle(href, textContent)
      this.precedences.push(newSheet)
    }
  }

  public unrenderStyle(href: string) {
    this.needsFlush = true
    this.usageCountsByHref[href] = (this.usageCountsByHref[href] ?? 1) - 1

    if (this.usageCountsByHref[href] === 0) {
      for (const s of this.precedences) {
        s.unrenderStyle(href)
      }
    }
  }

  public flush() {
    if (this.needsFlush) {
      this.needsFlush = false
      for (const s of this.precedences) {
        s.flush()
      }
    }
  }
}

let styleManager: StyleManager

export const getStyleManager = () => {
  if (!styleManager) styleManager = new StyleManager()
  return styleManager
}
