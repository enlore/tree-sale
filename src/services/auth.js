import {
    onAuthStateChanged,
    sendEmailVerification,
    signInWithPopup,
    signOut,
} from "firebase/auth"
import { auth, googleProvider, microsoftProvider } from "./firebase"

const authReady = new Promise((resolve) => {
    let unsubscribe
    unsubscribe = onAuthStateChanged(auth, () => {
        unsubscribe()
        resolve()
    })
})

export const getIdToken = async (forceRefresh = false) => {
    await authReady
    const user = auth.currentUser
    return user ? user.getIdToken(forceRefresh) : null
}

export const getUserEmail = () => auth.currentUser?.email ?? null

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider)

export const signInWithMicrosoft = () => signInWithPopup(auth, microsoftProvider)

export const sendVerificationEmail = () => sendEmailVerification(auth.currentUser)

export const logOut = () => signOut(auth)

export const subscribe = (callback) => onAuthStateChanged(auth, callback)
