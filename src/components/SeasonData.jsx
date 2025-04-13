import React from 'react';
import SearchFilter from './SearchFilter';
import DriversTable from './DriversTable';

function SeasonData({ 
    searchQuery, 
    onSearchChange, 
    selectedConstructor, 
    onConstructorChange, 
    constructorOptions,
    filteredStandings,
    navigateToDriver 
}) {
    return (
    <div className='list'>
        <SearchFilter 
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            selectedConstructor={selectedConstructor}
            onConstructorChange={onConstructorChange}
            constructorOptions={constructorOptions}
        />
        <DriversTable 
            filteredStandings={filteredStandings} 
            navigateToDriver={navigateToDriver} 
        />
        </div>
    );
}

export default SeasonData;