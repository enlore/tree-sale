import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth"

// Public client config (not secrets), from the project's hosting init.json
const app = initializeApp({
    apiKey: "AIzaSyBQbD82c8WLQtUn98ESgdSfziDg8KPJzlU",
    authDomain: "tree-sale.firebaseapp.com",
    projectId: "tree-sale"
})

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const microsoftProvider = new OAuthProvider("microsoft.com")
