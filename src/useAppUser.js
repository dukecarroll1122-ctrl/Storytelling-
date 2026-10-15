import { useUser } from '@clerk/clerk-react'

// Open /?demo to skip sign-in. Demo mode never calls the backend (see api.js); data stays in localStorage.
const DEMO = new URLSearchParams(window.location.search).has('demo')

export function useAppUser() {
  const result = useUser()
  return DEMO ? { ...result, isLoaded: true, isSignedIn: true, user: { id: 'demo-user' } } : result
}
