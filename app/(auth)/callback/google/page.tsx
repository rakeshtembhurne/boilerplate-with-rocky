"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GoogleCallback() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')
    const state = urlParams.get('state')

    if (error) {
      // Forward error to parent window
      if (window.opener) {
        window.opener.postMessage({
          type: 'google-oauth-error',
          payload: {
            error: {
              message: error,
              code: 'oauth_error'
            }
          }
        }, window.location.origin)
      }
      setError(error)
      return
    }

    if (code) {
      // Exchange code for session by calling betterAuth's callback
      const exchangeCode = async () => {
        try {
          const formData = new URLSearchParams()
          formData.append('provider', 'google')
          formData.append('code', code)
          formData.append('state', state || '')
          formData.append('json', 'true')

          const response = await fetch('/api/auth/callback/google', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
          })

          if (!response.ok) {
            throw new Error('Authentication failed')
          }

          const data = await response.json()

          if (data.session) {
            // Store session info temporarily
            localStorage.setItem('temp-session', JSON.stringify({
              user: data.session.user,
              sessionToken: data.session.sessionToken,
              expiresAt: data.session.expiresAt,
            }))

            // Send success message to parent window
            if (window.opener) {
              window.opener.postMessage({
                type: 'google-oauth-success',
                payload: {
                  session: data.session,
                  user: data.session.user,
                }
              }, window.location.origin)
            }
          } else if (data.error) {
            // Forward error to parent window
            if (window.opener) {
              window.opener.postMessage({
                type: 'google-oauth-error',
                payload: { error: data.error }
              }, window.location.origin)
            }
            setError(data.error.message || 'Authentication failed')
          }
        } catch (err) {
          console.error('Code exchange failed:', err)
          if (window.opener) {
            window.opener.postMessage({
              type: 'google-oauth-error',
              payload: {
                error: {
                  message: 'Authentication failed',
                  code: 'exchange_failed'
                }
              }
            }, window.location.origin)
          }
          setError('Authentication failed')
        }
      }

      exchangeCode()
    } else {
      setError('No authorization code received')
    }

    // Auto-close this window after a delay
    const timer = setTimeout(() => {
      window.close()
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Authentication Failed
          </h2>
          <p className="text-gray-700 mb-4">
            {error}
          </p>
          <p className="text-sm text-gray-500">
            This window will close automatically.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          Completing Authentication...
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Please wait while we finish signing you in.
        </p>
      </div>
    </div>
  )
}