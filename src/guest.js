// Guest mode: use the app without an account. Projects stay in this browser's localStorage and the backend is never called.
const KEY = 'guestMode'

export const GUEST_ID = 'guest-user'

const demoParam = () => new URLSearchParams(window.location.search).has('demo')

export const wantsGuest = () => {
  if (demoParam()) return true
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export const startGuest = () => {
  localStorage.setItem(KEY, '1')
  window.location.reload()
}

export const endGuest = () => {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}

// Set by useAppUser on each render; read by api.js to decide whether to skip the backend.
let active = false
export const setGuestActive = (value) => {
  active = value
}
export const isGuest = () => active
