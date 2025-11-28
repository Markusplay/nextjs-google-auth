import { useState, useContext, useEffect, Dispatch, SetStateAction } from "react"
import { GlobalContext } from "./app/providers"
import { firebaseAuth } from "./firebase"
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth"
import { User } from "firebase/auth"

declare global {
  interface Window {
    google: any
  }
}

declare var google: any

interface GoogleOneTapNotification {
  getMomentType: () => string
  isDisplayMoment: () => boolean
  isNotDisplayed: () => boolean
  getNotDisplayedReason: () => string
  isSkippedMoment: () => boolean
  getSkippedReason: () => string
  isDismissedMoment: () => boolean
  getDismissedReason: () => string
}

interface UseGoogleOneTapReturn {
  shouldShowFallbackButton: boolean
  setShouldShowFallbackButton: Dispatch<SetStateAction<boolean>>
  loggedInUser: User | null
  authLoading: boolean
}

export const useGoogleOneTap = (): UseGoogleOneTapReturn => {
  const [id_token, setId_token] = useState<string | null>(null)
  const [shouldShowFallbackButton, setShouldShowFallbackButton] =
    useState<boolean>(false)

  const context = useContext(GlobalContext)
  const loggedInUser = context?.loggedInUser ?? null
  const authLoading = context?.authLoading ?? false

  useEffect(() => {
    console.log("⏳ Auth Loading State:", authLoading)
  }, [authLoading])

  useEffect(() => {
    if (typeof window === "undefined" || !window.google) {
      return
    }

    if (!loggedInUser) {
      const handleCredentialResponse = (response: { credential: string }) => {
        console.log("🔐 Google One-Tap: Credential received from Google")
        console.log("📋 Response object:", response)
        console.log("🎫 JWT Token (first 50 chars):", response.credential.substring(0, 50) + "...")
        setId_token(response.credential)
      }

      const nativeCallback = (obj: any) => alert("native_callback!")

      const client_id =
        "270016666328-btskilsg599i9ln7sjb1r17aeso3rc8j.apps.googleusercontent.com"

      console.log("🔧 Initializing Google One-Tap with config:", {
        client_id: client_id.substring(0, 20) + "...",
        auto_select: true,
        context: "use",
        prompt_parent_id: "put-google-one-tap-here-plz",
      })

      window.google.accounts.id.initialize({
        client_id,
        callback: handleCredentialResponse,
        auto_select: true,
        context: "use",
        native_callback: nativeCallback,
        prompt_parent_id: "put-google-one-tap-here-plz",
      })
      
      console.log("🚀 Triggering Google One-Tap prompt...")
      window.google.accounts.id.prompt((notification: GoogleOneTapNotification) => {
        console.log("📢 Google One-Tap Notification:", notification.getMomentType())
        
        if (notification.isDisplayMoment()) {
          console.log("✨ One-Tap prompt is being displayed to user")
        }

        if (notification.isNotDisplayed()) {
          console.warn(
            "⚠️ One-tap prompt NOT displayed. Reason:",
            notification.getNotDisplayedReason()
          )
          console.log("🔄 Showing fallback button instead")
          setShouldShowFallbackButton(true)
        }
        
        if (notification.isSkippedMoment()) {
          console.warn(
            "⏭️ One-tap prompt was skipped. Reason:",
            notification.getSkippedReason()
          )
          console.log("🔄 Showing fallback button instead")
          setShouldShowFallbackButton(true)
        }
        
        if (notification.isDismissedMoment()) {
          const reason = notification.getDismissedReason()
          console.warn("❌ One-tap prompt was dismissed. Reason:", reason)
          
          if (reason !== "credential_returned") {
            console.log("🔄 Showing fallback button (credential was not returned)")
            setShouldShowFallbackButton(true)
          } else {
            console.log("✅ Credential was successfully returned")
          }
        }
      })
    } else {
      console.log("👤 User already logged in, canceling Google One-Tap prompt")
      window.google.accounts.id.cancel()
    }
  }, [loggedInUser])

  useEffect(() => {
    if (loggedInUser) {
      console.log("👥 Logged In User Updated:", {
        uid: loggedInUser.uid,
        email: loggedInUser.email,
        displayName: loggedInUser.displayName,
        photoURL: loggedInUser.photoURL,
      })
    } else {
      console.log("👤 User logged out or not authenticated")
    }
  }, [loggedInUser])

  useEffect(() => {
    if (id_token) {
      console.log("🔄 Converting Google credential to Firebase credential...")
      // Sign in with credential from the Google user.
      const credential = GoogleAuthProvider.credential(id_token)
      signInWithCredential(firebaseAuth, credential)
        .then((result) => {
          console.log("✅ Firebase authentication successful!")
          console.log("👤 User Info:", {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            emailVerified: result.user.emailVerified,
            phoneNumber: result.user.phoneNumber,
            metadata: {
              creationTime: result.user.metadata.creationTime,
              lastSignInTime: result.user.metadata.lastSignInTime,
            },
          })
          console.log("🔑 Provider Data:", result.user.providerData)
        })
        .catch(function (error) {
          console.error("❌ Firebase authentication error:", error)
        })
    }
  }, [id_token])

  return {
    shouldShowFallbackButton,
    setShouldShowFallbackButton,
    loggedInUser,
    authLoading,
  }
}
