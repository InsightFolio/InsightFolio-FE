import type { PerformancePoint, TimeFilter } from '../components/portfolio/BalanceSection';

export const FILTER_LABELS: Record<TimeFilter, string> = {
  '3D': 'Past 3 days',
  '1W': 'Past week',
  '1M': 'Past month',
  'YTD': 'Year to date'
};

export const CHART_COLORS = {
  green: '#206f27',
  red: '#d64545'
} as const;

/**
 * Calculate Y-axis domain with padding
 */
export const getYAxisDomain = (data: PerformancePoint[]): [number, number] => {
  if (data.length === 0) return [0, 10000];
  
  const values = data.map(p => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.1;
  
  return [Math.max(0, min - padding), max + padding];
};

/**
 * Generate Y-axis ticks with deduplication
 */
export const getYAxisTicks = (
  data: PerformancePoint[], 
  domain: [number, number], 
  activeFilter: TimeFilter
): number[] | undefined => {
  if (data.length === 0) return undefined;
  
  const [min, max] = domain;
  const range = max - min;
  
  if (range === 0) return undefined;
  
  const step = range / 4;
  const ticks: number[] = [];
  
  for (let i = 0; i <= 4; i++) {
    ticks.push(min + (step * i));
  }
  
  const decimals = activeFilter === '3D' || activeFilter === '1W' ? 2 : 1;
  const formatted = new Set<string>();
  const uniqueTicks: number[] = [];
  
  for (const tick of ticks) {
    const kValue = tick / 1000;
    const label = `$${kValue.toFixed(decimals)}k`;
    
    if (!formatted.has(label)) {
      formatted.add(label);
      uniqueTicks.push(tick);
    }
  }
  
  return uniqueTicks.length >= 3 ? uniqueTicks : undefined;
};

/**
 * Format Y-axis tick values
 */
export const formatYAxisTick = (value: number, activeFilter: TimeFilter): string => {
  const decimals = activeFilter === '3D' || activeFilter === '1W' ? 2 : 1;
  if (value >= 1000) {
    const kValue = value / 1000;
    return `$${kValue.toFixed(decimals)}k`;
  }
  return `$${value.toFixed(0)}`;
};

/**
 * Determine graph color based on data trend
 */
export const getGraphColor = (data: PerformancePoint[]): string => {
  if (data.length < 2) return CHART_COLORS.green;
  
  const startValue = data[0].value;
  const endValue = data[data.length - 1].value;
  
  return endValue >= startValue ? CHART_COLORS.green : CHART_COLORS.red;
};

/**
 * Filter data based on time range
 */
export const filterDataByTimeRange = (
  data: PerformancePoint[], 
  filter: TimeFilter
): PerformancePoint[] => {
  if (data.length === 0 || data.length <= 2) return data;
  
  const daysToShow = filter === '3D' ? 3 : filter === '1W' ? 7 : filter === '1M' ? 30 : data.length;
  return data.slice(-daysToShow);
};

/**
 * Generate interpolated performance data
 */
export const generatePerformanceData = (
  currentValue: number,
  growthPercent: number
): PerformancePoint[] => {
  const startValue = growthPercent !== 0 
    ? currentValue / (1 + growthPercent / 100)
    : currentValue * 0.9;
  
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const points: PerformancePoint[] = [];
  
  const daysDiff = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const step = Math.max(1, Math.floor(daysDiff / 50)); // ~50 data points max
  
  for (let i = 0; i <= daysDiff; i += step) {
    const date = new Date(startOfYear);
    date.setDate(startOfYear.getDate() + i);
    
    const progress = daysDiff === 0 ? 1 : i / daysDiff;
    const interpolatedValue = startValue + (currentValue - startValue) * progress;
    
    points.push({
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.round(interpolatedValue * 100) / 100
    });
  }
  
  // Always include today as the last point
  const todayLabel = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (points.length === 0 || points[points.length - 1].label !== todayLabel) {
    points.push({
      label: todayLabel,
      value: currentValue
    });
  }
  
  return points;
};

/**
 * Render time filter buttons
 */
export const TIME_FILTERS: TimeFilter[] = ['3D', '1W', '1M', 'YTD'];
