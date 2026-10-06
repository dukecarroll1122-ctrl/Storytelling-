import { useUser } from '@clerk/clerk-react'

// Dev-only: open http://localhost:5173/?demo to skip sign-in (e.g. for screenshots).
// import.meta.env.DEV is false in production builds, so the bypass is stripped from them.
const DEMO = import.meta.env.DEV && new URLSearchParams(window.location.search).has('demo')

export function useAppUser() {
  const result = useUser()
  return DEMO ? { ...result, isLoaded: true, isSignedIn: true, user: { id: 'demo-user' } } : result
}
