import "./UiExpo.css"
import { Loading } from "./Loading"
import { ErrorMessage } from "./ErrorMessage"
import { StatusBadge } from "./Orders/StatusBadge"
import { SproutIcon } from "./Orders/SproutIcon"

export const UiExpo = () => {
    return (
        <div className="app-container">
            <h1 className="page-title">UI Expo</h1>

            <section className="expo-section">
                <h2 className="expo-label">Loading</h2>
                <Loading />
            </section>

            <section className="expo-section">
                <h2 className="expo-label">Status badges</h2>
                <div className="expo-row">
                    <StatusBadge status="PENDING" />
                    <StatusBadge status="FULFILLED" />
                    <StatusBadge status="PENDING" large />
                    <StatusBadge status="FULFILLED" large />
                </div>
            </section>

            <section className="expo-section">
                <h2 className="expo-label">Errors</h2>
                <ErrorMessage>Rate limit exceeded. Retry in 30 seconds.</ErrorMessage>
                <ErrorMessage>Could not load sales data. Try again in a moment.</ErrorMessage>
            </section>

            <section className="expo-section">
                <h2 className="expo-label">Sprout icon</h2>
                <div className="expo-row expo-sprout">
                    <SproutIcon />
                    <SproutIcon size={20} />
                    <SproutIcon size={28} />
                </div>
            </section>
        </div>
    )
}
