import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './App.css'
import './components/StatsCharts.css'
import StatsCharts from './components/StatsCharts'

function App() {
  const [seasons, setSeasons] = useState([])
  const [selectedSeason, setSelectedSeason] = useState('')
  const [standings, setStandings] = useState([])
  const [selectedConstructor, setSelectedConstructor] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

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
    
    // Check if we have a selected season in state from navigation
    if (location.state && location.state.selectedSeason) {
      const restoredSeason = location.state.selectedSeason
      setSelectedSeason(restoredSeason)
      if (restoredSeason) {
        fetchStandings(restoredSeason)
      }
    }
  }, [location.state])

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

  // Navigate to driver detail and pass selected season in state
  const navigateToDriver = (driverId, driver) => {
    navigate(`/driver/${driverId}`, {
      state: { 
        driver: driver,
        selectedSeason: selectedSeason  // Pass the current selected season
      }
    })
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
    <div>
      <h1>F1 Seasons Archive</h1>
      <div className='season-select'>
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
        <div className='page'>
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
          <div className='row'>
            <div className='list'>
              <div className='filters'>
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
            </div>
          </div>
          
          {/* Add the new charts component */}
          <StatsCharts standings={standings} selectedSeason={selectedSeason} />
        </div>
      )}
    </div>
  )
}

export default App