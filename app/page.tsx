"use client";

import Link from "next/link";
import { firebaseAuth, googleProvider } from "@/firebase";
import { signInWithRedirect, signOut } from "firebase/auth";
import { useGoogleOneTap } from "@/useGoogleOneTap";
import styles from "./page.module.css";

export default function Home() {
  const {
    shouldShowFallbackButton,
    setShouldShowFallbackButton,
    loggedInUser,
    authLoading,
  } = useGoogleOneTap();

  return (
    <>
      <div className={styles.container}>
        <h1>Google One-Tap + Next.js + Firebase Auth</h1>

        <p>
          A little demo of how to implement Google One-Tap with Next.js &
          Firebase Auth.
        </p>

        <div className={styles.infoBox}>
          <p className={styles.infoText}>
            🎨 Want to see a customizable sign-in button instead?
          </p>
          <Link href="/personalized-button" className={styles.infoLink}>
            Check out the Personalized Button Demo →
          </Link>
        </div>

        {shouldShowFallbackButton && !loggedInUser && !authLoading && (
          <>
            <h3>one-tap is not displayed, here is a fallback button:</h3>
            <button
              onClick={() => {
                console.log(
                  "🔄 Fallback Button: Initiating Google sign-in redirect..."
                );
                signInWithRedirect(firebaseAuth, googleProvider).catch(
                  (error: Error) => {
                    console.error(
                      "❌ Fallback Button: Sign in redirect error:",
                      error
                    );
                  }
                );
              }}
            >
              Continue with Google
            </button>
          </>
        )}

        {loggedInUser && <h2>Wassup, {loggedInUser?.displayName}!</h2>}

        {authLoading && <h5>loading..</h5>}

        {loggedInUser && (
          <button
            disabled={authLoading}
            onClick={() => {
              console.log("🚪 Signing out user...");
              signOut(firebaseAuth)
                .then(() => {
                  console.log("✅ Successfully signed out");
                })
                .catch((error) => {
                  console.error("❌ Sign out error:", error);
                });
              if (typeof window !== "undefined" && window.google) {
                console.log("🔒 Disabling Google auto-select");
                window.google.accounts.id.disableAutoSelect();
              }
              setShouldShowFallbackButton(false);
            }}
          >
            Log out & disable auto-login
          </button>
        )}

        {/* we can make One-Tap attach to a custom element - see 'prompt_parent_id' in useGoogleOneTap.ts */}
        <div
          id="put-google-one-tap-here-plz"
          className={styles.oneTapContainer}
        />
      </div>
    </>
  );
}
