import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { Loading } from "../Loading"
import { subscribe } from "../../services/auth"

export const Authorized = ({ children }) => {
    const [user, setUser] = useState(undefined)

    useEffect(() => subscribe(setUser), [])

    if (user === undefined) {
        return <Loading />
    }

    if (user === null) {
        return <Navigate to="/login" replace />
    }

    return <>{children ?? <Outlet />}</>
}
