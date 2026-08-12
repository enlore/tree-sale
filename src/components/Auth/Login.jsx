import "./Login.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import { login, setToken } from "../../services/auth"

const messageForStatus = (status) => {
    if (status === 403) {
        return "Not authorized — ask an admin to add your email"
    }
    if (status === 401) {
        return "Google sign-in was rejected. Try again."
    }
    return "Could not sign in. Try again in a moment."
}

export const Login = () => {
    const [pending, setPending] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()

    const handleSuccess = async (credentialResponse) => {
        setErrorMessage("")
        setPending(true)
        try {
            const token = await login(credentialResponse.credential)
            setToken(token)
            navigate("/")
        } catch (error) {
            setErrorMessage(messageForStatus(error.status))
        } finally {
            setPending(false)
        }
    }

    const handleError = () => {
        setErrorMessage("Google sign-in did not complete. Try again.")
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <img
                    src="https://images.squarespace-cdn.com/content/v1/5cb3ca007a1fbd45aeff89ea/1560265287463-4QEFFJPAQZHT9C58UDOL/NTC_Logo_Horiz%28CLR%29.png"
                    alt="Tree Sale Logo"
                    className="login-logo"
                />
                <h1 className="login-title">Tree Sale</h1>
                <p className="login-subtitle">Sign in with your Tree Conservation Corps account.</p>

                {pending ? (
                    <p className="login-pending">Signing in — this can take up to a minute.</p>
                ) : (
                    <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
                )}

                {errorMessage && <p className="login-error">{errorMessage}</p>}
            </div>
        </div>
    )
}
