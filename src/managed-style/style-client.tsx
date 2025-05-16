'use client'

import { useInsertionEffect } from 'react'
import { getStyleManager } from './style-manager.js'

export function StyleClient({
  children,
  href,
  precedence,
  nonce,
}: {
  href: string
  precedence: string
  children?: string
  nonce?: string
}) {
  useInsertionEffect(() => {
    const manager = getStyleManager()

    manager.renderStyle({
      href,
      precedence,
      textContent: children ?? null,
      nonce,
    })

    return () => {
      manager.unrenderStyle(href)
    }
  }, [children, href, nonce, precedence])

  return null
}
