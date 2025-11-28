"use client";

import { useContext, useEffect, useRef } from "react";
import { GlobalContext } from "../providers";
import { firebaseAuth } from "../../firebase";
import {
  signInWithCredential,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import Link from "next/link";
import styles from "./page.module.css";

interface CredentialResponse {
  credential: string;
}

export default function PersonalizedButton() {
  const context = useContext(GlobalContext);
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  const loggedInUser = context?.loggedInUser;
  const authLoading = context?.authLoading;

  useEffect(() => {
    if (
      !loggedInUser &&
      !authLoading &&
      buttonContainerRef.current &&
      typeof window !== "undefined" &&
      window.google
    ) {

      const client_id =
          "270016666328-btskilsg599i9ln7sjb1r17aeso3rc8j.apps.googleusercontent.com"

      console.log("🔧 Initializing Google Personalized Button with config:", {
        client_id: client_id.substring(0, 20) + "...",
        auto_select: false,
      });

      window.google.accounts.id.initialize({
        client_id,
        callback: handleCredentialResponse,
        auto_select: false,
      });

      console.log("🎨 Rendering personalized button with theme: filled_black");

      // Render the personalized button
      window.google.accounts.id.renderButton(buttonContainerRef.current, {
        theme: ".",
        size: "large",
        type: "standard",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
      });
    }
  }, [loggedInUser, authLoading]);

  const handleCredentialResponse = (response: CredentialResponse) => {
    console.log("🔐 Personalized Button: Credential received from Google");
    console.log("📋 Response object:", response);
    console.log(
      "🎫 JWT Token (first 50 chars):",
      response.credential.substring(0, 50) + "..."
    );

    // Sign in with credential from the Google user.
    const credential = GoogleAuthProvider.credential(response.credential);
    console.log("🔄 Converting Google credential to Firebase credential...");

    signInWithCredential(firebaseAuth, credential)
      .then((result) => {
        console.log(
          "✅ Personalized Button: Firebase authentication successful!"
        );
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
        });
        console.log("🔑 Provider Data:", result.user.providerData);
      })
      .catch((error: Error) => {
        console.error("❌ Personalized Button: Sign in error:", error);
      });
  };

  return (
    <div className={styles.container}>
      <Link href="/">← Back to One-Tap Demo</Link>

      <h1>Google Personalized Button Demo</h1>

      <p>
        This page demonstrates the{" "}
        <strong>personalized Google Sign-In button</strong>, which is different
        from the One-Tap prompt. The personalized button is a customizable
        button that users can click to sign in.
      </p>

      {!loggedInUser && !authLoading && (
        <div className={styles.signInBox}>
          <h3>Sign in with your Google Account:</h3>
          <div ref={buttonContainerRef} />
        </div>
      )}

      {authLoading && (
        <div className={styles.loadingBox}>
          <h3>Loading...</h3>
        </div>
      )}

      {loggedInUser && (
        <div className={styles.welcomeBox}>
          <h2>✅ Welcome, {loggedInUser?.displayName}!</h2>

          <div className={styles.userInfo}>
            <p>
              <strong>Email:</strong> {loggedInUser?.email}
            </p>
            <p>
              <strong>UID:</strong> {loggedInUser?.uid}
            </p>
          </div>

          {loggedInUser?.photoURL && (
            <img
              src={loggedInUser.photoURL}
              alt="Profile"
              className={styles.profileImage}
            />
          )}

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
            }}
            className={styles.signOutButton}
          >
            Sign Out
          </button>
        </div>
      )}

      <div className={styles.infoBox}>
        <h3>Button Customization Options:</h3>
        <p>The personalized button can be customized with:</p>
        <ul className={styles.optionsList}>
          <li>
            <strong>theme:</strong> "outline", "filled_blue", or "filled_black"
          </li>
          <li>
            <strong>size:</strong> "large", "medium", or "small"
          </li>
          <li>
            <strong>type:</strong> "standard" or "icon"
          </li>
          <li>
            <strong>text:</strong> "signin_with", "signup_with",
            "continue_with", or "signin"
          </li>
          <li>
            <strong>shape:</strong> "rectangular", "pill", "circle", or "square"
          </li>
        </ul>
      </div>
    </div>
  );
}
