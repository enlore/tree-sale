import "./NavBar.css"
import { NavLink, useNavigate } from "react-router-dom"
import { clearToken } from "../../services/auth"
import logo from "../../assets/ntcc-logo.png"

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
                    src={logo}
                    alt="Nashville Tree Conservation Corps"
                    className="logo-img"
            /></div>
            <ul className="nav-links">
                <li><NavLink to='/' end>All Orders</NavLink></li>
                <li><NavLink to='/pending'>Pending</NavLink></li>
                <li><NavLink to='/fulfilled'>Fulfilled</NavLink></li>
                <li><NavLink to='/sales'>Sales</NavLink></li>
                <li><button className="sign-out" onClick={handleSignOut}>Sign Out</button></li>
            </ul>
        </nav>
    )
}
