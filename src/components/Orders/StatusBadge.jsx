export const StatusBadge = ({ status, large }) => {
    const colorClass = status === "FULFILLED" ? "status-fulfilled" : "status-pending"
    return (
        <span className={`status-badge ${large ? "status-badge-lg " : ""}${colorClass}`}>
            {status}
        </span>
    )
}
