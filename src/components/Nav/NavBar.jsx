import "./NavBar.css"
import {Link} from "react-router-dom"

export const NavBar = () => {
    return <ul className="navbar">
        <li className="nav-links">
            <Link to='/'>All Orders</Link>
        </li>
        <li className="nav-links">
            <Link to='/pending'>Pending</Link>
        </li>
        <li className="nav-links">
            <Link to='/completed'>Completed</Link>
        </li>
    </ul>
}