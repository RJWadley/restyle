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
  const manager = getStyleManager()
  manager.renderStyle({
    href,
    precedence,
    textContent: children ?? null,
    nonce,
  })

  useInsertionEffect(() => {
    manager.flush()
    return () => {
      manager.unrenderStyle(href)
    }
  }, [href, manager])

  return null
}
