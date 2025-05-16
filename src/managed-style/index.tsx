import { StyleClient } from './style-client.js'
import { marker } from './style-manager.js'

const isServer = typeof document === 'undefined'

export function ManagedStyle({
  children,
  ...props
}: {
  href: string
  precedence: string
  children?: string
  nonce?: string
}) {
  if (isServer)
    return (
      <>
        <style {...props} suppressHydrationWarning>
          {children && `${children.trim()}${marker}`}
        </style>
      </>
    )
  return <StyleClient {...props}>{children}</StyleClient>
}
