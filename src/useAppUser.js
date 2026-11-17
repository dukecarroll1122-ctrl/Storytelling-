import { useUser } from '@clerk/clerk-react'
import { GUEST_ID, wantsGuest, endGuest, setGuestActive } from './guest'

// Signing in is optional: signed-out visitors who chose guest mode (or opened /?demo) get a local-only guest user.
export function useAppUser() {
  const result = useUser()
  if (result.isSignedIn) {
    endGuest()
    setGuestActive(false)
    return result
  }
  const guest = wantsGuest()
  setGuestActive(guest)
  return guest ? { ...result, isLoaded: true, isSignedIn: false, user: { id: GUEST_ID } } : result
}
