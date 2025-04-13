import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function DriverDetail() {
  const { driverId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [driver, setDriver] = useState(null)
  const [driverExtra, setDriverExtra] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDriverData = async () => {
      setLoading(true)
      try {
        // First, try to use state passed from navigation if available
        if (location.state && location.state.driver) {
          setDriver(location.state.driver)
        } else {
          // Otherwise fetch from API
          const response = await fetch(`https://ergast.com/api/f1/drivers/${driverId}.json`)
          const data = await response.json()
          if (data.MRData.DriverTable.Drivers.length > 0) {
            setDriver(data.MRData.DriverTable.Drivers[0])
          } else {
            throw new Error("Driver not found")
          }
        }
      } catch (error) {
        console.error("Error fetching driver details", error)
        setError("Failed to load driver data. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchDriverData()
  }, [driverId, location.state])

  useEffect(() => {
    if (driver && driver.permanentNumber) {
      const fetchExtraInfo = async () => {
        try {
          const response = await fetch(
            `https://api.openf1.org/v1/drivers?driver_number=${driver.permanentNumber}`
          )
          const data = await response.json()
          if (data && data.length > 0) {
            setDriverExtra(data[0])  // Assuming we want the first matching driver
          }
        } catch (error) {
          console.error("Error fetching extra driver info from OpenF1 API:", error)
        }
      }
      fetchExtraInfo()
    }
  }, [driver])

  // Handle navigation back to standings while preserving the selected season
  const handleBackToStandings = () => {
    // Get the selected season from location state if available
    const selectedSeason = location.state?.selectedSeason || ''
    
    // Navigate back to home with the season info
    navigate('/', { 
      state: { 
        selectedSeason: selectedSeason
      }
    })
  }

  if (loading) {
    return <div className="driver-detail loading">Loading driver details...</div>
  }

  if (error) {
    return <div className="driver-detail error">{error}</div>
  }

  if (!driver) {
    return <div className="driver-detail not-found">Driver not found</div>
  }

  return (
    <div className="driver-detail">
      <h1>{driver.givenName} {driver.familyName}</h1>
      
      <div className="driver-profile">
        {driverExtra && driverExtra.headshot_url && (
            <div className="driver-image">
              <img 
                src={driverExtra.headshot_url} 
                alt={`${driverExtra.full_name}`} 
                style={{ 
                  maxWidth: '200px',
                  border: `4px solid #${driverExtra.team_colour}` 
                }} 
              />
            </div>
          )}

        <div className="driver-basic-info">
          <p><strong>Nationality:</strong> {driver.nationality}</p>
          <p><strong>Date of Birth:</strong> {driver.dateOfBirth}</p>
          <p><strong>Permanent Number:</strong> {driver.permanentNumber || 'N/A'}</p>
          <p><strong>Code:</strong> {driver.code || 'N/A'}</p>
          
          {driverExtra && (
            <>
              <p><strong>Driver Number:</strong> {driverExtra.driver_number}</p>
              <p><strong>Country:</strong> {driverExtra.country_code}</p>
            </>
          )}
          
          <div className="wiki-link" style={{ 
            textAlign: 'center',
            margin: '20px 0'
          }}>
            <a 
              href={driver.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '8px 15px',
                backgroundColor: '#333',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}
            >
              View on Wikipedia
            </a>
          </div>
        </div>
      </div>
      
      {driverExtra && (
        <div className="team-info" style={{ 
          backgroundColor: `#${driverExtra.team_colour}20`, 
          padding: '15px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h2>Current Team: {driverExtra.team_name}</h2>
          <div style={{ 
            backgroundColor: `#${driverExtra.team_colour}`, 
            height: '20px', 
            width: '100%',
            borderRadius: '4px' 
          }}></div>
        </div>
      )}
      
      {/* Use button to navigate back instead of anchor tag */}
      <div className="back-link" style={{ marginTop: '30px' }}>
        <button 
          onClick={handleBackToStandings}
          style={{ 
            padding: '10px 15px',
            backgroundColor: '#e10600',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          ← Back to Standings
        </button>
      </div>
    </div>
  )
}

export default DriverDetail