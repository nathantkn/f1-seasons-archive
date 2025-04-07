function Standings({ standings }) {
    return (
        <div className="table">
        <table>
            <thead>
                <tr>
                    <th>Position</th>
                    <th>Driver</th>
                    <th>Code</th>
                    <th>Constructor</th>
                    <th>Number</th>
                    <th>Nationality</th>
                    <th>Wins</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>
                {standings.map((standing) => (
                <tr key={standing.Driver.driverId}>
                    <td>{standing.position}</td>
                    <td>
                        {standing.Driver.givenName} {standing.Driver.familyName}
                    </td>
                    <td>{standing.Driver.code}</td>
                    <td>{standing.Constructors[0].name}</td>
                    <td>{standing.Driver.permanentNumber || 'N/A'}</td>
                    <td>{standing.Driver.nationality}</td>
                    <td>{standing.wins}</td>
                    <td>{standing.points}</td>
                </tr>
                ))}
            </tbody>
        </table>
    </div>
    )
}

export default Standings