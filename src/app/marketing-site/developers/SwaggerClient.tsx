'use client'

import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

export function SwaggerClient({ spec }: { spec: object }) {
  return (
    <div className="swagger-wrapper">
      <SwaggerUI spec={spec} docExpansion="list" defaultModelsExpandDepth={-1} />
    </div>
  )
}
