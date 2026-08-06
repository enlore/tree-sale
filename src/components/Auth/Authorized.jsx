import { Navigate, Outlet } from "react-router-dom"
import { isAuthenticated } from "../../services/auth"

export const Authorized = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />
    }

    return <>{children ?? <Outlet />}</>
}
