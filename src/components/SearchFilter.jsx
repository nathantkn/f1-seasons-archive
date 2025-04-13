import React from 'react';

function SearchFilter({ 
    searchQuery, 
    onSearchChange, 
    selectedConstructor, 
    onConstructorChange, 
    constructorOptions 
}) {
    return (
        <div className='filters'>
        <div className='filter'>
            <h2>Search Driver</h2>
            <input
                type="text"
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Search Driver"
            />
        </div>
        <div className='filter'>
            <h2>Filter</h2>
            <select onChange={onConstructorChange} value={selectedConstructor}>
            <option value="">All Constructors</option>
            {constructorOptions.map((constructor) => (
                <option key={constructor} value={constructor}>
                {constructor}
                </option>
            ))}
            </select>
        </div>
        </div>
    );
}

export default SearchFilter;