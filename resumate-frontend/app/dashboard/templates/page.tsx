// Server component wrapper to ensure Next honors the route segment config
export const dynamic = 'force-dynamic'

import TemplatesPageClient from './TemplatesPageClient'

export default function TemplatesPage() {
  // No server-side work; render the client component only
  return <TemplatesPageClient />
}
