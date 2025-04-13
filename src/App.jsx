import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './styles/Layout.css'
import './styles/Components.css'
import StatsCharts from './components/StatsCharts'
import SeasonSelect from './components/SeasonSelect'
import SeasonSummary from './components/SeasonSummary'
import SeasonData from './components/SeasonData'

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
      
      <SeasonSelect 
        seasons={seasons}
        selectedSeason={selectedSeason}
        onSeasonChange={handleSeasonChange}
      />
      
      {standings.length > 0 && (
        <div className='page'>
          <SeasonSummary standings={standings} />
          
          <div className='row'>
            <SeasonData 
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              selectedConstructor={selectedConstructor}
              onConstructorChange={handleConstructorChange}
              constructorOptions={constructorOptions}
              filteredStandings={filteredStandings}
              navigateToDriver={navigateToDriver}
            />
          </div>
          
          <StatsCharts standings={standings} selectedSeason={selectedSeason} />
        </div>
      )}
    </div>
  )
}

export default App