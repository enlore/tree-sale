import "./Loading.css"
import shield from "../assets/ntcc-logo-shield.webp"

export const Loading = () => {
    return (
        <div className="loading">
            <img src={shield} alt="Nashville Tree Conservation Corps" className="loading-shield" />
            <span className="loading-text">Loading...</span>
        </div>
    )
}
