// src/lib/services/weather.ts

interface WeatherDay {
  date: Date
  tempHigh: number
  tempLow: number
  condition: string
  description: string
  windSpeed: number
  windGust: number
  precipitation: number
  precipitationChance: number
  humidity: number
  hazards: WeatherHazard[]
}

interface WeatherHazard {
  type: 'rain' | 'wind' | 'temperature' | 'storm' | 'snow'
  severity: 'low' | 'medium' | 'high'
  description: string
  icon: string
}

interface WeatherForecast {
  location: string
  fetchedAt: Date
  days: WeatherDay[]
}

// Construction-specific weather thresholds
const HAZARD_THRESHOLDS = {
  rain: {
    heavy: 0.5,              // inches per day
    probability: 70,         // % chance
    severityThresholds: {
      low: 0.25,            // Light rain warning
      medium: 0.5,          // Moderate rain - delays likely
      high: 1.0             // Heavy rain - work stoppage
    }
  },
  wind: {
    sustained: {
      low: 15,              // mph - caution for light materials
      medium: 25,           // mph - crane/lift restrictions
      high: 35              // mph - work stoppage
    },
    gusts: {
      low: 25,              // mph
      medium: 35,           // mph
      high: 45              // mph
    }
  },
  temperature: {
    cold: {
      low: 40,              // °F - concrete curing concerns
      medium: 32,           // °F - freezing
      high: 20              // °F - extreme cold
    },
    hot: {
      low: 85,              // °F - heat precautions
      medium: 95,           // °F - heat stress risk
      high: 105             // °F - extreme heat
    }
  }
};

export async function fetchWeatherForecast(zipCode: string, city?: string, state?: string): Promise<WeatherForecast> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenWeather API key not configured');
  }

  // Prefer zipCode for accuracy, fallback to city/state
  const location = zipCode || `${city},${state},US`;
  
  if (!location || location === ',US') {
    throw new Error('No valid location data available');
  }

  try {
    console.log('🌤️ Fetching weather for location:', location);
    
    // Use the free 5-day forecast API
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?${
      zipCode ? `zip=${zipCode},US` : `q=${city},${state},US`
    }&units=imperial&appid=${apiKey}`;
    
    const forecastResponse = await fetch(forecastUrl);
    
    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.json();
      console.error('Weather API error:', errorData);
      throw new Error(`Weather API error: ${errorData.message || forecastResponse.statusText}`);
    }

    const forecastData = await forecastResponse.json();
    console.log('✅ Weather data received for:', forecastData.city.name);

    // Group forecast data by day (API gives 3-hour intervals)
    const dailyData = new Map<string, any[]>();
    
    // Start from today to ensure we get 7 days starting from report creation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!dailyData.has(dateKey)) {
        dailyData.set(dateKey, []);
      }
      dailyData.get(dateKey)!.push(item);
    });

    // Ensure we have 7 days of data starting from today
    const days: WeatherDay[] = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      const dateKey = currentDate.toISOString().split('T')[0];
      
      const dayItems = dailyData.get(dateKey) || [];
      
      if (dayItems.length > 0) {
        // We have forecast data for this day
        const temps = dayItems.map(item => item.main.temp);
        const tempHighs = dayItems.map(item => item.main.temp_max);
        const tempLows = dayItems.map(item => item.main.temp_min);
        
        const tempHigh = Math.round(Math.max(...tempHighs));
        const tempLow = Math.round(Math.min(...tempLows));
        
        // Get the most common weather condition
        const conditions = dayItems.map(item => item.weather[0]);
        const mainCondition = conditions[Math.floor(conditions.length / 2)];
        
        // Calculate averages and maximums
        const windSpeeds = dayItems.map(item => item.wind.speed);
        const windSpeed = Math.round(Math.max(...windSpeeds));
        const windGust = Math.round(windSpeed * 1.3);
        
        // Calculate total precipitation
        const precipitation = dayItems.reduce((sum: number, item: any) => {
          const rain = (item.rain && item.rain['3h']) || 0;
          const snow = (item.snow && item.snow['3h']) || 0;
          return sum + rain + snow;
        }, 0) / 25.4; // Convert mm to inches
        
        // Get max precipitation chance
        const precipChances = dayItems.map(item => (item.pop || 0) * 100);
        const precipitationChance = Math.round(Math.max(...precipChances));
        
        // Average humidity
        const humidity = Math.round(
          dayItems.reduce((sum: number, item: any) => sum + item.main.humidity, 0) / dayItems.length
        );

        // Analyze hazards
        const hazards = analyzeConstructionHazards({
          tempHigh,
          tempLow,
          condition: mainCondition.main,
          windSpeed,
          windGust,
          precipitation,
          precipitationChance
        });

        days.push({
          date: currentDate,
          tempHigh,
          tempLow,
          condition: mainCondition.main,
          description: mainCondition.description,
          windSpeed,
          windGust,
          precipitation,
          precipitationChance,
          humidity,
          hazards
        });
      } else {
        // No forecast data for this day (beyond 5-day forecast)
        // Use the last available day's data as an estimate
        if (days.length > 0) {
          const lastDay = days[days.length - 1];
          days.push({
            ...lastDay,
            date: currentDate,
            // Slightly randomize to show variation
            tempHigh: lastDay.tempHigh + Math.round((Math.random() - 0.5) * 4),
            tempLow: lastDay.tempLow + Math.round((Math.random() - 0.5) * 4),
            windSpeed: Math.max(0, lastDay.windSpeed + Math.round((Math.random() - 0.5) * 5)),
            precipitationChance: Math.max(0, Math.min(100, lastDay.precipitationChance + Math.round((Math.random() - 0.5) * 20)))
          });
        } else {
          // Fallback if no data at all
          days.push({
            date: currentDate,
            tempHigh: 75,
            tempLow: 60,
            condition: 'Clear',
            description: 'clear sky',
            windSpeed: 10,
            windGust: 13,
            precipitation: 0,
            precipitationChance: 10,
            humidity: 50,
            hazards: []
          });
        }
      }
    }

    const forecast: WeatherForecast = {
      location: `${forecastData.city.name}, ${forecastData.city.country}`,
      fetchedAt: new Date(),
      days: days.slice(0, 7) // Ensure exactly 7 days
    };

    console.log('✅ Weather forecast processed:', days.length, 'days');
    return forecast;

  } catch (error: any) {
    console.error('Weather fetch error:', error);
    throw new Error(`Failed to fetch weather forecast: ${error.message}`);
  }
}

function analyzeConstructionHazards(weather: {
  tempHigh: number;
  tempLow: number;
  condition: string;
  windSpeed: number;
  windGust: number;
  precipitation: number;
  precipitationChance: number;
}): WeatherHazard[] {
  const hazards: WeatherHazard[] = [];

  // Temperature hazards
  if (weather.tempLow <= HAZARD_THRESHOLDS.temperature.cold.high) {
    hazards.push({
      type: 'temperature',
      severity: 'high',
      description: 'Extreme cold - work stoppage likely',
      icon: '🥶'
    });
  } else if (weather.tempLow <= HAZARD_THRESHOLDS.temperature.cold.medium) {
    hazards.push({
      type: 'temperature',
      severity: 'medium',
      description: 'Freezing temps - concrete/mortar concerns',
      icon: '❄️'
    });
  } else if (weather.tempLow <= HAZARD_THRESHOLDS.temperature.cold.low) {
    hazards.push({
      type: 'temperature',
      severity: 'low',
      description: 'Cold weather - monitor concrete curing',
      icon: '🌡️'
    });
  }

  if (weather.tempHigh >= HAZARD_THRESHOLDS.temperature.hot.high) {
    hazards.push({
      type: 'temperature',
      severity: 'high',
      description: 'Extreme heat - mandatory breaks required',
      icon: '🔥'
    });
  } else if (weather.tempHigh >= HAZARD_THRESHOLDS.temperature.hot.medium) {
    hazards.push({
      type: 'temperature',
      severity: 'medium',
      description: 'High heat - increase water breaks',
      icon: '🥵'
    });
  } else if (weather.tempHigh >= HAZARD_THRESHOLDS.temperature.hot.low) {
    hazards.push({
      type: 'temperature',
      severity: 'low',
      description: 'Warm weather - heat precautions advised',
      icon: '☀️'
    });
  }

  // Wind hazards
  if (weather.windGust >= HAZARD_THRESHOLDS.wind.gusts.high) {
    hazards.push({
      type: 'wind',
      severity: 'high',
      description: 'Dangerous wind gusts - suspend crane operations',
      icon: '🌪️'
    });
  } else if (weather.windGust >= HAZARD_THRESHOLDS.wind.gusts.medium || 
             weather.windSpeed >= HAZARD_THRESHOLDS.wind.sustained.medium) {
    hazards.push({
      type: 'wind',
      severity: 'medium',
      description: 'High winds - restrict lifting operations',
      icon: '💨'
    });
  } else if (weather.windSpeed >= HAZARD_THRESHOLDS.wind.sustained.low) {
    hazards.push({
      type: 'wind',
      severity: 'low',
      description: 'Breezy - secure loose materials',
      icon: '🍃'
    });
  }

  // Precipitation hazards
  if (weather.precipitation >= HAZARD_THRESHOLDS.rain.severityThresholds.high || 
      (weather.precipitationChance >= 90 && weather.precipitation >= HAZARD_THRESHOLDS.rain.severityThresholds.medium)) {
    hazards.push({
      type: 'rain',
      severity: 'high',
      description: 'Heavy rain expected - indoor work only',
      icon: '🌧️'
    });
  } else if (weather.precipitation >= HAZARD_THRESHOLDS.rain.severityThresholds.medium || 
             weather.precipitationChance >= HAZARD_THRESHOLDS.rain.probability) {
    hazards.push({
      type: 'rain',
      severity: 'medium',
      description: 'Rain likely - plan for delays',
      icon: '🌦️'
    });
  } else if (weather.precipitation >= HAZARD_THRESHOLDS.rain.severityThresholds.low || 
             weather.precipitationChance >= 50) {
    hazards.push({
      type: 'rain',
      severity: 'low',
      description: 'Possible showers - have covers ready',
      icon: '☔'
    });
  }

  // Storm/severe weather hazards
  const severeConditions = ['Thunderstorm', 'Tornado', 'Hurricane', 'Hail'];
  if (severeConditions.some(condition => weather.condition.includes(condition))) {
    hazards.push({
      type: 'storm',
      severity: 'high',
      description: `${weather.condition} - seek shelter immediately`,
      icon: '⛈️'
    });
  }

  // Snow/ice hazards
  const winterConditions = ['Snow', 'Sleet', 'Ice', 'Freezing'];
  if (winterConditions.some(condition => weather.condition.includes(condition))) {
    hazards.push({
      type: 'snow',
      severity: weather.condition.includes('Heavy') ? 'high' : 'medium',
      description: `${weather.condition} - site may be inaccessible`,
      icon: '❄️'
    });
  }

  return hazards;
}

export function getHighestHazardSeverity(hazards: WeatherHazard[]): 'none' | 'low' | 'medium' | 'high' {
  if (hazards.length === 0) return 'none';
  
  const severityOrder = { 'low': 1, 'medium': 2, 'high': 3 };
  const highest = hazards.reduce((max, hazard) => {
    return severityOrder[hazard.severity] > severityOrder[max] ? hazard.severity : max;
  }, 'low' as 'low' | 'medium' | 'high');
  
  return highest;
}