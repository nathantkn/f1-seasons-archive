import React from 'react';

function SeasonSelect({ seasons, selectedSeason, onSeasonChange }) {
    return (
        <div className='season-select'>
            <select value={selectedSeason} onChange={onSeasonChange}>
                <option value="">Select Season</option>
                {seasons.map((season) => (
                    <option key={season.season} value={season.season}>
                        {season.season}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SeasonSelect;