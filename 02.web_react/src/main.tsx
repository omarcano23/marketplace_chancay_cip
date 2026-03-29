import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ClerkProvider } from "@clerk/react"

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const root = createRoot(document.getElementById('root')!)

if (!publishableKey) {
  root.render(
    <StrictMode>
      <div style={{ fontFamily: 'sans-serif', padding: 24 }}>
        Error: falta `VITE_CLERK_PUBLISHABLE_KEY` en `.env.local`.
      </div>
    </StrictMode>,
  )
} else {
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={publishableKey}>
        <App />
      </ClerkProvider>
    </StrictMode>,
  )
}
