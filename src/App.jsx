import { useState, useEffect } from 'react'
import Standings from './components/Standings'
import SideNav from "./components/SideNav.jsx";
import './App.css'

function App() {
  const [seasons, setSeasons] = useState([])
  const [selectedSeason, setSelectedSeason] = useState('')
  const [standings, setStandings] = useState([])
  const [selectedConstructor, setSelectedConstructor] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch all seasons on component mount.
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await fetch('https://ergast.com/api/f1/seasons.json?limit=100')
        const data = await response.json()
        setSeasons(data.MRData.SeasonTable.Seasons.sort((a, b) => b.season - a.season))
      } catch (error) {
        console.error("Error fetching seasons:", error)
      }
    }
    fetchSeasons()
  }, [])

  const handleSeasonChange = (e) => {
    const season = e.target.value
    setSelectedSeason(season)
    setSearchQuery('')
    setSelectedConstructor('')
    if (season) {
      fetchStandings(season)
    } else {
      setStandings([])
    }
  }

  const handleConstructorChange = (e) => {
    setSelectedConstructor(e.target.value)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Fetch driver standings for a given season.
  const fetchStandings = async (season) => {
    try {
      const response = await fetch(`https://ergast.com/api/f1/${season}/driverStandings.json`)
      const data = await response.json()
      const standingsData = data.MRData.StandingsTable.StandingsLists[0].DriverStandings
      setStandings(standingsData)
    } catch (error) {
      console.error("Error fetching driver standings:", error)
    }
  }

  // Combine both constructor and search filters.
  const filteredStandings = standings.filter((standing) => {
    const fullName = `${standing.Driver.givenName} ${standing.Driver.familyName}`.toLowerCase()
    const matchesSearch = fullName.includes(searchQuery.toLowerCase())
    const matchesConstructor = selectedConstructor 
      ? standing.Constructors.some(constructor => constructor.name === selectedConstructor)
      : true
    return matchesSearch && matchesConstructor
  })

  // Get a list of unique constructor names for the filter dropdown.
  const constructorOptions = [
    ...new Set(
      standings.flatMap((standing) =>
        standing.Constructors.map((constructor) => constructor.name)
      )
    ),
  ]

  return (
    <div className='whole-page'>
      <SideNav />
      <h1>F1 Seasons Archive</h1>
      <div class='season-select'>
        <select value={selectedSeason} onChange={handleSeasonChange}>
          <option value="">Select Season</option>
          {seasons.map((season) => (
            <option key={season.season} value={season.season}>
              {season.season}
            </option>
          ))}
        </select>
      </div>
      {standings.length > 0 && (
        <div class='page'>
          <div class='row'>
            <div class='card'>
              <h2>Drivers' Champion</h2>
              <h3>{standings[0].Driver.givenName} {standings[0].Driver.familyName}</h3>
            </div>
            <div class='card'>
              <h2>Constructors' Champion</h2>
              <h3>{standings[0].Constructors[0].name}</h3>
            </div>
            <div class='card'>
              <h2>Total Points</h2>
              <h3>{standings.reduce((total, standing) => total + parseInt(standing.points), 0)}</h3>
            </div>
          </div>
          <div class='row'>
            <div class='list'>
              <div class='filters'>
                <div className='filter'>
                  <h2>Search Driver</h2>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search Driver"
                  />
                </div>
                <div className='filter'>
                  <h2>Filter</h2>
                  <select onChange={handleConstructorChange} value={selectedConstructor}>
                    <option value="">All Constructors</option>
                    {constructorOptions.map((constructor) => (
                      <option key={constructor} value={constructor}>
                        {constructor}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Standings standings={filteredStandings} />
              {/* <div class='table'>
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
                  {filteredStandings.map((standing) => (
                      <tr key={standing.Driver.driverId}>
                        <td>{standing.position}</td>
                        <td>
                          {standing.Driver.givenName} {standing.Driver.familyName}
                        </td>
                        <td>{standing.Driver.code}</td>
                        <td>
                          {standing.Constructors[0].name}
                        </td>
                        <td>{standing.Driver.permanentNumber || 'N/A'}</td>
                        <td>{standing.Driver.nationality}</td>
                        <td>{standing.wins}</td>
                        <td>{standing.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
