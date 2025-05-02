
# 📈 Tracking Trends

This document outlines how to implement and work with the trend tracking features in FormCoach.

## Overview

The Trends page visualizes user progress over time, including:
- Workout frequency
- Body measurements
- Weight changes
- Performance metrics

## Implementing Charts

FormCoach uses Recharts for data visualization:

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const WorkoutTrendsChart = ({ data }) => {
  return (
    <LineChart width={350} height={200} data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
      <XAxis dataKey="date" stroke="#A4B1B7" />
      <YAxis stroke="#A4B1B7" />
      <Tooltip 
        contentStyle={{ 
          backgroundColor: '#020D0C', 
          borderColor: '#00C4B4',
          color: '#B0E8E3' 
        }} 
      />
      <Legend />
      <Line type="monotone" dataKey="weight" stroke="#00C4B4" activeDot={{ r: 8 }} />
    </LineChart>
  );
};
```

## Best Practices

### Data Management

- Store trend data in a consistent format
- Use date-fns for date manipulation
- Group data for different time periods (weekly, monthly, yearly)

### UI Guidelines

- Use the FormCoach teal for primary metrics
- Provide toggles for different data views
- Include hover states for detailed information
- Add empty states for new users with no data

### Responsive Design

- Charts should adapt to screen width
- On mobile, prioritize legibility over detail
- Consider vertical scrolling for multiple charts

## Implementation Example

A typical implementation might look like:

```tsx
const TrendsPage = () => {
  const [selectedMetric, setSelectedMetric] = useState('weight');
  const [timeRange, setTimeRange] = useState('month');
  
  // Chart configurations based on selections...
  
  return (
    <PageContainer>
      <h1>Your Progress</h1>
      
      {/* Metric selectors */}
      <div className="metric-selectors">
        {/* Toggle buttons for metrics */}
      </div>
      
      {/* Time range selector */}
      <div className="time-range">
        {/* Time period options */}
      </div>
      
      {/* The actual chart */}
      <div className="chart-container">
        <WorkoutTrendsChart data={chartData} />
      </div>
      
      {/* Stats summary */}
      <div className="stats-summary">
        {/* Key statistics */}
      </div>
    </PageContainer>
  );
};
```
