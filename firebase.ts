import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDV7fsgd1Z1E_R2Ri-98h4DTB-bUZ6OebY",
  authDomain: "auth-3a44e.firebaseapp.com",
  databaseURL: "https://auth-3a44e-default-rtdb.firebaseio.com",
  projectId: "auth-3a44e",
  storageBucket: "auth-3a44e.firebasestorage.app",
  messagingSenderId: "270016666328",
  appId: "1:270016666328:web:99845325fc93039534d5ad",
  measurementId: "G-WD0Z13WDDS"
}

const firebase: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp()

const firebaseAuth: Auth = getAuth(firebase)
const googleProvider: GoogleAuthProvider = new GoogleAuthProvider()

export { firebase, googleProvider, firebaseAuth }

