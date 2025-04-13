import React from 'react';

function SeasonSummary({ standings }) {
    return (
        <div className='row'>
            <div className='card'>
                <h2>Drivers' Champion</h2>
                <h3>{standings[0].Driver.givenName} {standings[0].Driver.familyName}</h3>
            </div>
            <div className='card'>
                <h2>Constructors' Champion</h2>
                <h3>{standings[0].Constructors[0].name}</h3>
            </div>
            <div className='card'>
                <h2>Total Points</h2>
                <h3>{standings.reduce((total, standing) => total + parseInt(standing.points), 0)}</h3>
            </div>
        </div>
    );
}

export default SeasonSummary;