import "./Login.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signInWithGoogle, signInWithMicrosoft } from "../../services/auth"
import logo from "../../assets/ntcc-logo.png"

const DISMISSED_POPUP_CODES = ["auth/popup-closed-by-user", "auth/cancelled-popup-request"]

export const Login = () => {
    const [pending, setPending] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()

    const handleSignIn = async (signIn) => {
        setErrorMessage("")
        setPending(true)
        try {
            await signIn()
            navigate("/")
        } catch (error) {
            if (!DISMISSED_POPUP_CODES.includes(error?.code)) {
                setErrorMessage("Could not sign in. Try again in a moment.")
            }
        } finally {
            setPending(false)
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <img
                    src={logo}
                    alt="Nashville Tree Conservation Corps"
                    className="login-logo"
                />
                <h1 className="login-title">Tree Sale</h1>
                <p className="login-subtitle">Sign in with the account we have on file for you.</p>

                {pending ? (
                    <p className="login-pending">Signing in…</p>
                ) : (
                    <div className="login-providers">
                        <button className="login-provider-btn" onClick={() => handleSignIn(signInWithGoogle)}>
                            Sign in with Google
                        </button>
                        <button className="login-provider-btn" onClick={() => handleSignIn(signInWithMicrosoft)}>
                            Sign in with Microsoft
                        </button>
                    </div>
                )}

                {errorMessage && <p className="login-error">{errorMessage}</p>}
            </div>
        </div>
    )
}
