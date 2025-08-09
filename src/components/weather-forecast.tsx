// src/components/weather-forecast.tsx
'use client'

import { CloudRain, Wind, RefreshCw, Umbrella, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

interface WeatherDay {
  date: string | Date
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

interface WeatherForecastProps {
  weatherData: {
    location: string
    fetchedAt: string | Date
    days: WeatherDay[]
  } | null
  projectLocation?: string
  onRefresh?: () => Promise<void>
  isEditing?: boolean
}

export function WeatherForecast({ weatherData, projectLocation, onRefresh, isEditing = false }: WeatherForecastProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  if (!weatherData) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">Weather information not available for this week's report</p>
      </div>
    )
  }

  const handleRefresh = async () => {
    if (!onRefresh) return
    
    setIsRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div>
      {/* Update button for edit mode */}
      {isEditing && onRefresh && (
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Update Weather
          </Button>
        </div>
      )}
      
      {/* Weather grid - centered and professional */}
      <div className="flex justify-center">
        <div className="grid grid-cols-7 gap-2 max-w-6xl">
          {weatherData.days.map((day, index) => (
            <DayForecast key={index} day={day} isFirst={index === 0} />
          ))}
        </div>
      </div>
    </div>
  )
}

function DayForecast({ day, isFirst }: { day: WeatherDay; isFirst: boolean }) {
  const date = new Date(day.date)
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
  const dateStr = date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })
  
  // Determine if this day might cause delays (client-friendly assessment)
  const mightCauseDelay = 
    day.precipitationChance >= 80 || 
    day.windSpeed >= 25 || 
    day.tempHigh >= 100 || 
    day.tempLow <= 32 ||
    day.hazards.some(h => h.severity === 'high')
  
  return (
    <div className={`
      flex flex-col p-3 rounded-lg border transition-all min-w-[100px]
      ${mightCauseDelay 
        ? 'border-gray-300 bg-gray-50 shadow-sm' 
        : 'border-gray-200 bg-white'
      }
    `}>
      {/* Day header */}
      <div className="text-center mb-2">
        <p className="font-semibold text-sm text-gray-900">{dayName}</p>
        <p className="text-xs text-gray-500">{dateStr}</p>
        {isFirst && (
          <Badge variant="outline" className="mt-1 text-xs py-0 px-1">
            Report Date
          </Badge>
        )}
      </div>
      
      {/* Weather Icon - Professional */}
      <div className="flex justify-center mb-3">
        <WeatherIcon 
          condition={day.condition} 
          className={`w-10 h-10 ${mightCauseDelay ? 'text-gray-700' : 'text-gray-600'}`} 
        />
      </div>
      
      {/* Temperature Range */}
      <div className="text-center mb-3">
        <div className="flex items-center justify-center space-x-1">
          <span className="text-lg font-semibold">{day.tempHigh}°</span>
          <span className="text-sm text-gray-400">/</span>
          <span className="text-sm text-gray-500">{day.tempLow}°</span>
        </div>
      </div>
      
      {/* Key Metrics - Always visible */}
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <Umbrella className="w-3 h-3 text-gray-400" />
          <span className={`${day.precipitationChance >= 50 ? 'font-medium text-gray-700' : 'text-gray-500'}`}>
            {day.precipitationChance}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <Wind className="w-3 h-3 text-gray-400" />
          <span className={`${day.windSpeed >= 20 ? 'font-medium text-gray-700' : 'text-gray-500'}`}>
            {day.windSpeed} mph
          </span>
        </div>
      </div>
      
      {/* Delay indicator - centered with icon above text */}
      {mightCauseDelay && (
        <div className="mt-2 pt-2 border-t border-gray-200 text-center">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500 mx-auto mb-0.5" />
          <p className="text-xs text-red-600 font-medium">
            Possible Delays
          </p>
        </div>
      )}
    </div>
  )
}

// Professional weather icons using Lucide React
function WeatherIcon({ condition, className }: { condition: string; className?: string }) {
  const conditionLower = condition.toLowerCase()
  
  if (conditionLower.includes('clear') || conditionLower.includes('sun')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    )
  }
  
  if (conditionLower.includes('cloud')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    )
  }
  
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return <CloudRain className={className} />
  }
  
  if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9" />
        <polyline points="13 11 9 17 15 17 11 23" />
      </svg>
    )
  }
  
  if (conditionLower.includes('snow')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
        <line x1="8" y1="16" x2="8.01" y2="16" />
        <line x1="8" y1="20" x2="8.01" y2="20" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
        <line x1="12" y1="22" x2="12.01" y2="22" />
        <line x1="16" y1="16" x2="16.01" y2="16" />
        <line x1="16" y1="20" x2="16.01" y2="20" />
      </svg>
    )
  }
  
  // Default partly cloudy
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 16a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
      <path d="M17.5 19.5 17.5 19.501" />
      <path d="M17.5 7.5 17.5 7.501" />
      <path d="M3 12 3 12.001" />
      <path d="M12 3 12 3.001" />
      <path d="M21 12 21 12.001" />
      <path d="M5.6 5.6l.01.01" />
      <path d="M18.4 5.6l.01.01" />
      <path d="M18.4 18.4l.01.01" />
      <path d="M5.6 18.4l.01.01" />
    </svg>
  )
}