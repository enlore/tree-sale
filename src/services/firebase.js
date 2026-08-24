import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth"

// Public client config (not secrets), from `firebase apps:sdkconfig web`
const app = initializeApp({
    apiKey: "AIzaSyBQbD82c8WLQtUn98ESgdSfziDg8KPJzlU",
    authDomain: "tree-sale.firebaseapp.com",
    projectId: "tree-sale",
    appId: "1:15912314705:web:9f2d99ebe504c64ffcd570"
})

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const microsoftProvider = new OAuthProvider("microsoft.com")
