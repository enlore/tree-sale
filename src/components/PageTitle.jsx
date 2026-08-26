import "./PageTitle.css"

// VITE_APP_VERSION is injected by the deploy workflow from `git describe --tags`
export const PageTitle = ({ children }) => {
    const version = import.meta.env.VITE_APP_VERSION || "dev"
    return (
        <h1 className="page-title">
            {children} <span className="page-version">{version}</span>
        </h1>
    )
}
