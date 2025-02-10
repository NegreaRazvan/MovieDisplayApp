import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {
    return (
        <div className="w-full flex bg-light-100/5 px-4 py-3 rounded-lg mt-10 max-w-3xl mx-auto">
            <img src="./Search.png" className="size-6"></img>

            <input className="px-1 w-full outline-hidden placeholder-light-200 text-gray-200"
                   type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

        </div>
    )
}
export default Search
