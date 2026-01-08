"use client"

import { env } from "@/env.mjs"

interface GoogleOAuthConfig {
  clientId: string
  redirectUri: string
  authCodeRedirectUri: string
}

interface GoogleOAuthResponse {
  code?: string
  error?: string
  state?: string
}

// Generate a random state string for CSRF protection
function generateState(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15)
}

// Parse URL parameters from popup response
function parsePopupResponse(url: string): GoogleOAuthResponse {
  const urlParams = new URLSearchParams(url.split('?')[1])
  return {
    code: urlParams.get('code') || undefined,
    error: urlParams.get('error') || undefined,
    state: urlParams.get('state') || undefined,
  }
}

// Open a popup window and wait for the OAuth response
function openPopup(url: string, width: number = 500, height: number = 600): Promise<GoogleOAuthResponse> {
  return new Promise((resolve, reject) => {
    // Calculate position for centering popup
    const left = (window.innerWidth - width) / 2
    const top = (window.innerHeight - height) / 2

    const popup = window.open(
      url,
      'google-oauth',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    )

    if (!popup) {
      reject(new Error('Popup window was blocked. Please allow popups for this site.'))
      return
    }

    // Timeout after 5 minutes
    const timeout = setTimeout(() => {
      popup.close()
      reject(new Error('Authentication timeout'))
    }, 5 * 60 * 1000)

    // Listen for message from popup (OAuth callback page)
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      clearTimeout(timeout)
      window.removeEventListener('message', messageListener)

      if (event.data?.type === 'google-oauth-success') {
        popup.close()
        // Check for stored session in localStorage
        if (typeof localStorage !== 'undefined') {
          const tempSession = localStorage.getItem('temp-session')
          if (tempSession) {
            const sessionData = JSON.parse(tempSession)
            localStorage.removeItem('temp-session')
            resolve({
              code: 'success',
              state: event.data.payload.session?.user?.id
            })
          }
        }
        resolve({ code: 'success', state: event.data.payload.session?.user?.id })
      } else if (event.data?.type === 'google-oauth-error') {
        popup.close()
        reject(new Error(event.data.payload.error?.message || 'Authentication failed'))
      } else if (event.data?.type === 'google-oauth-response') {
        popup.close()
        resolve(event.data.payload)
      }
    }

    window.addEventListener('message', messageListener)

    // Poll to check if popup was closed manually
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed)
        clearTimeout(timeout)
        window.removeEventListener('message', messageListener)
        reject(new Error('Popup was closed'))
      }
    }, 1000)
  })
}

// Custom Google OAuth popup function
export async function signInWithGoogle(): Promise<void> {
  const config: GoogleOAuthConfig = {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || (window as any).googleClientId || "465376631713-dmqlviunifrm4qpv21ssg55bibki66f5.apps.googleusercontent.com",
    redirectUri: `${window.location.origin}/auth/callback/google`,
    authCodeRedirectUri: `${window.location.origin}/api/auth/callback/google`,
  }

  const state = generateState()

  // Store state in sessionStorage for verification
  sessionStorage.setItem('google-oauth-state', state)

  // Google OAuth parameters with popup support
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.authCodeRedirectUri,
    scope: 'openid email profile',
    response_type: 'code',
    state: state,
    access_type: 'offline',
    prompt: 'consent',
  })

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

  try {
    const response = await openPopup(authUrl)

    if (response.error) {
      throw new Error(`Google OAuth error: ${response.error}`)
    }

    if (!response.code) {
      throw new Error('No authorization code received')
    }

    // Verify state parameter for CSRF protection
    const storedState = sessionStorage.getItem('google-oauth-state')
    if (!storedState || storedState !== response.state) {
      throw new Error('Invalid state parameter - potential CSRF attack')
    }

    // Clear state from storage
    sessionStorage.removeItem('google-oauth-state')

  } catch (error) {
    console.error('Google OAuth popup failed:', error)
    // Provide a more specific error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    // Check if it's a popup blocker error
    if (errorMessage.includes('blocked by your browser')) {
      throw new Error(errorMessage)
    }

    const enhancedError = new Error(`Google OAuth popup failed: ${errorMessage}`)
    throw enhancedError
  }
}

// Exchange authorization code for session tokens
async function exchangeCodeForTokens(code: string, state: string): Promise<void> {
  try {
    // Create a form to submit to betterAuth's callback endpoint
    const formData = new URLSearchParams()
    formData.append('provider', 'google')
    formData.append('code', code)
    formData.append('state', state)
    formData.append('json', 'true') // Request JSON response instead of redirect

    // Call betterAuth's callback endpoint directly
    const response = await fetch('/api/auth/callback/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Authentication failed: ${errorData}`)
    }

    const data = await response.json()

    // For popup mode, if we get a session, we need to close the popup
    // and notify the parent window
    if (data.session) {
      // Send message to parent window to update session
      if (window.opener) {
        window.opener.postMessage({
          type: 'google-oauth-success',
          payload: {
            user: data.session.user,
            session: data.session,
          },
        }, window.location.origin)
      }

      // Store session info in localStorage for the client to pick up
      if (typeof window !== 'undefined') {
        localStorage.setItem('temp-session', JSON.stringify({
          user: data.session.user,
          sessionToken: data.session.sessionToken,
          expiresAt: data.session.expiresAt,
        }))
      }
    }

    // If it's an error response, forward it to the parent
    if (data.error) {
      if (window.opener) {
        window.opener.postMessage({
          type: 'google-oauth-error',
          payload: { error: data.error },
        }, window.location.origin)
      }
      throw new Error(data.error.message || 'Authentication failed')
    }

  } catch (error) {
    console.error('Token exchange failed:', error)
    throw error
  }
}