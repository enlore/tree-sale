import "./Login.css"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../../services/firebase"
import { sendVerificationEmail, getIdToken, logOut } from "../../services/auth"
import logo from "../../assets/ntcc-logo.png"

export const PendingAccess = () => {
    const navigate = useNavigate()
    const [sent, setSent] = useState(false)
    const [message, setMessage] = useState("")

    const user = auth.currentUser
    const needsVerification = Boolean(user && !user.emailVerified)

    // Verified users have no business here: they are either whitelisted
    // (and would not have been 403'd) or not getting in. Sign out, no copy.
    useEffect(() => {
        if (!needsVerification) {
            logOut().then(() => navigate("/login", { replace: true }))
        }
    }, [needsVerification, navigate])

    if (!needsVerification) {
        return null
    }

    const handleSend = async () => {
        setMessage("")
        try {
            await sendVerificationEmail()
            setSent(true)
        } catch {
            setMessage("Could not send the email. Try again in a moment.")
        }
    }

    const handleConfirm = async () => {
        setMessage("")
        try {
            await user.reload()
            if (auth.currentUser.emailVerified) {
                await getIdToken(true)
                navigate("/")
            } else {
                setMessage("Not verified yet. Click the link in the email first.")
            }
        } catch {
            setMessage("Something went wrong. Try again in a moment.")
        }
    }

    const handleSignOut = async () => {
        await logOut()
        navigate("/login")
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <img
                    src={logo}
                    alt="Nashville Tree Conservation Corps"
                    className="login-logo"
                />
                <h1 className="login-title">Almost there</h1>
                <p className="login-subtitle">
                    We need to confirm you own {user.email}.
                    {sent && " Check your email and click the verification link."}
                </p>
                <div className="login-providers">
                    <button className="login-provider-btn" onClick={handleSend}>
                        Send verification email
                    </button>
                    <button className="login-provider-btn" onClick={handleConfirm}>
                        I clicked the link
                    </button>
                </div>
                {message && <p className="login-error">{message}</p>}
                <button className="login-provider-btn" onClick={handleSignOut}>Sign Out</button>
            </div>
        </div>
    )
}
