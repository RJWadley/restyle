import { StyleClient } from './style-client.js'

const isServer = typeof document === 'undefined'

export function ManagedStyle({children,...props}: {
  href: string
  precedence: string
  children?: string 
  nonce?: string
}) {
  if (isServer) return <style {...props} suppressHydrationWarning >{children?.trim() || 'p{}'}</style>
  return <StyleClient {...props} />
}
