import "./NavBar.css"
import { Link, useNavigate } from "react-router-dom"
import { clearToken } from "../../services/auth"

export const NavBar = () => {
    const navigate = useNavigate()

    const handleSignOut = () => {
        clearToken()
        navigate("/login")
    }

    return (
        <nav className="navbar">
            <div className="logo-box">
                <img
                    src="https://images.squarespace-cdn.com/content/v1/5cb3ca007a1fbd45aeff89ea/1560265287463-4QEFFJPAQZHT9C58UDOL/NTC_Logo_Horiz%28CLR%29.png"
                    alt="Tree Sale Logo"
                    className="logo-img"
            /></div>
            <ul className="nav-links">
                <li><Link to='/'>All Orders</Link></li>
                <li><Link to='/pending'>Pending</Link></li>
                <li><Link to='/fulfilled'>Fulfilled</Link></li>
                <li><Link to='/sales'>Sales</Link></li>
                <li><button className="sign-out" onClick={handleSignOut}>Sign Out</button></li>
            </ul>
        </nav>
    )
}
