export const SearchBar = ({setSearchTerm}) => {
    return (
        <div className="search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
            <input
                onChange={(event) => {setSearchTerm(event.target.value)}}
                type="text"
                placeholder="Search orders"
                />
        </div>
    )
}
