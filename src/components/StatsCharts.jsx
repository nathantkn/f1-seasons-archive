import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import '../styles/StatsCharts.css';

const StatsCharts = ({ standings, selectedSeason }) => {
  if (!standings || standings.length === 0) return null;

  // Prepare data for top drivers chart (top 5 by points)
  const topDriversData = standings
    .slice(0, 5)
    .map((standing) => ({
      name: `${standing.Driver.familyName}`,
      points: parseFloat(standing.points),
      wins: parseInt(standing.wins),
    }));

  // Prepare data for constructor points - aggregate points by constructor
  const constructorPointsMap = {};
  standings.forEach((standing) => {
    const constructor = standing.Constructors[0].name;
    if (constructorPointsMap[constructor]) {
      constructorPointsMap[constructor] += parseFloat(standing.points);
    } else {
      constructorPointsMap[constructor] = parseFloat(standing.points);
    }
  });

  const constructorPointsData = Object.keys(constructorPointsMap).map((constructor) => ({
    name: constructor,
    points: constructorPointsMap[constructor],
  }));

  // Sort by points
  constructorPointsData.sort((a, b) => b.points - a.points);

  // Prepare data for win distribution pie chart
  const winsData = standings
    .filter((standing) => parseInt(standing.wins) > 0)
    .map((standing) => ({
      name: `${standing.Driver.familyName}`,
      value: parseInt(standing.wins),
    }));

  // Prepare custom colors for the pie chart
  const COLORS = ['#FF0000', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#6B66FF'];

  // Tooltip formatter to display full numbers instead of decimals
  const tooltipFormatter = (value) => Math.round(value);

  return (
    <div className="charts-container">
      <h2>F1 {selectedSeason} Season Statistics</h2>
      
      <div className="chart-section">
        <h3>Top 5 Drivers by Points</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topDriversData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={tooltipFormatter} />
            <Legend />
            <Bar dataKey="points" fill="#8884d8" name="Points" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="chart-section">
        <h3>Constructor Points</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={constructorPointsData.slice(0, 5)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={tooltipFormatter} />
            <Legend />
            <Bar dataKey="points" fill="#82ca9d" name="Points" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {winsData.length > 0 && (
        <div className="chart-section">
          <h3>Win Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={winsData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {winsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default StatsCharts;