import React from 'react';

function DriversTable({ filteredStandings, navigateToDriver }) {
    return (
        <div className='table'>
        <table>
            <thead>
            <tr>
                <th>Position</th>
                <th>Driver</th>
                <th>Constructor</th>
                <th>Wins</th>
                <th>Points</th>
            </tr>
            </thead>
            <tbody>
            {filteredStandings.map((standing) => (
                <tr
                    key={standing.Driver.driverId}
                    onClick={() => navigateToDriver(standing.Driver.driverId, standing.Driver)}
                    style={{ cursor: 'pointer' }}
                >
                <td>{standing.position}</td>
                <td>
                    {standing.Driver.givenName} {standing.Driver.familyName}
                </td>
                <td>
                    {standing.Constructors[0].name}
                </td>
                <td>{standing.wins}</td>
                <td>{standing.points}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
}

export default DriversTable;