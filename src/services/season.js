// A sale season runs July 1 through June 30 and is named "2026-2027".
// Mirrors seasonOf in the backend.
export const seasonOf = (date) => {
    const parsed = new Date(date)
    const year = parsed.getUTCFullYear()
    return parsed.getUTCMonth() >= 6 ? `${year}-${year + 1}` : `${year - 1}-${year}`
}

// Distinct seasons present in a list of orders, newest first
export const seasonsOf = (orders) => {
    return [...new Set(orders.map((order) => seasonOf(order.date)))].sort().reverse()
}
