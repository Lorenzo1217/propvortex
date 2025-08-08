'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  CloudRain, 
  Wind, 
  RefreshCw, 
  Umbrella, 
  AlertCircle, 
  AlertTriangle,
  Sun,
  Cloud,
  CloudSnow,
  Zap,
  Droplets,
  Thermometer,
  Navigation
} from "lucide-react"
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

export function LuxuryWeatherForecast({ weatherData, projectLocation, onRefresh, isEditing = false }: WeatherForecastProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  if (!weatherData) {
    return (
      <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-50 rounded-lg">
              <Sun className="w-5 h-5 text-sky-600" />
            </div>
            <CardTitle className="text-xl font-light tracking-wide text-gray-900">
              Weather Outlook
            </CardTitle>
          </div>
          <CardDescription className="text-gray-600 mt-2">
            Weather information not available for this week's report
          </CardDescription>
        </CardHeader>
      </Card>
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

  // Calculate overall construction impact
  const impactDays = weatherData.days.filter(day => 
    day.precipitationChance >= 80 || 
    day.windSpeed >= 25 || 
    day.tempHigh >= 100 || 
    day.tempLow <= 32 ||
    day.hazards.some(h => h.severity === 'high')
  ).length

  return (
    <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-sky-50 to-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-50 rounded-lg">
              <Sun className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-light tracking-wide text-gray-900">
                Weather Outlook
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                7-day construction forecast for {weatherData.location || projectLocation}
              </CardDescription>
            </div>
          </div>
          {isEditing && onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-sky-600 hover:bg-sky-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Update
            </Button>
          )}
        </div>
        
        {/* Overall Impact Summary */}
        {impactDays > 0 && (
          <div className={`mt-4 flex items-center gap-3 px-4 py-3 rounded-lg ${
            impactDays >= 3 
              ? 'bg-red-50 border border-red-200' 
              : 'bg-amber-50 border border-amber-200'
          }`}>
            <AlertTriangle className={`w-5 h-5 ${
              impactDays >= 3 ? 'text-red-600' : 'text-amber-600'
            }`} />
            <p className={`text-sm font-medium ${
              impactDays >= 3 ? 'text-red-700' : 'text-amber-700'
            }`}>
              {impactDays} day{impactDays > 1 ? 's' : ''} may impact construction schedule
            </p>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="px-8 py-6">
        {/* Weather grid - premium layout */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weatherData.days.map((day, index) => (
            <LuxuryDayForecast key={index} day={day} isFirst={index === 0} />
          ))}
        </div>
        
        {/* Data freshness indicator */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center">
          <p className="text-xs text-gray-500">
            Weather data updated {new Date(weatherData.fetchedAt).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function LuxuryDayForecast({ day, isFirst }: { day: WeatherDay; isFirst: boolean }) {
  const date = new Date(day.date)
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  
  // Determine construction impact level
  const hasHighWind = day.windSpeed >= 25
  const hasHighPrecip = day.precipitationChance >= 80
  const hasExtremeTemp = day.tempHigh >= 100 || day.tempLow <= 32
  const hasHighRisk = day.hazards.some(h => h.severity === 'high')
  
  const impactLevel = 
    (hasHighWind || hasHighPrecip || hasExtremeTemp || hasHighRisk) 
      ? 'high' 
      : (day.precipitationChance >= 50 || day.windSpeed >= 20) 
      ? 'medium' 
      : 'low'
  
  const impactStyles = {
    high: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: 'text-red-600'
    },
    medium: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      icon: 'text-amber-600'
    },
    low: {
      bg: 'bg-white',
      border: 'border-gray-200',
      text: 'text-gray-700',
      icon: 'text-gray-600'
    }
  }
  
  const style = impactStyles[impactLevel]
  
  return (
    <div className={`
      group relative flex flex-col p-4 rounded-xl border-2 transition-all duration-200
      hover:shadow-lg ${style.bg} ${style.border}
      ${isFirst ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
    `}>
      {/* Day header */}
      <div className="text-center mb-3">
        <p className={`font-semibold text-base ${style.text}`}>{dayName}</p>
        <p className="text-sm text-gray-600">{dateStr}</p>
        {isFirst && (
          <Badge variant="default" className="mt-2 bg-blue-600 text-white border-0">
            Today
          </Badge>
        )}
      </div>
      
      {/* Weather Icon */}
      <div className="flex justify-center mb-4">
        <div className={`p-3 rounded-full ${
          impactLevel === 'high' ? 'bg-red-100' : 
          impactLevel === 'medium' ? 'bg-amber-100' : 
          'bg-gray-100'
        }`}>
          <WeatherIcon 
            condition={day.condition} 
            className={`w-8 h-8 ${style.icon}`} 
          />
        </div>
      </div>
      
      {/* Temperature Range */}
      <div className="text-center mb-4">
        <div className="flex items-baseline justify-center gap-1">
          <span className={`text-2xl font-light ${style.text}`}>{day.tempHigh}°</span>
          <span className="text-gray-400 mx-1">/</span>
          <span className="text-lg text-gray-500">{day.tempLow}°</span>
        </div>
      </div>
      
      {/* Key Metrics with icons */}
      <div className="space-y-2 mb-3">
        {/* Precipitation */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">Rain</span>
          </div>
          <span className={`text-sm font-medium ${
            day.precipitationChance >= 50 ? style.text : 'text-gray-700'
          }`}>
            {day.precipitationChance}%
          </span>
        </div>
        
        {/* Wind */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Wind</span>
          </div>
          <span className={`text-sm font-medium ${
            day.windSpeed >= 20 ? style.text : 'text-gray-700'
          }`}>
            {day.windSpeed} mph
          </span>
        </div>
      </div>
      
      {/* Impact indicator */}
      {impactLevel !== 'low' && (
        <div className={`
          mt-auto pt-3 border-t text-center
          ${impactLevel === 'high' ? 'border-red-200' : 'border-amber-200'}
        `}>
          <div className="flex items-center justify-center gap-1.5">
            <AlertTriangle className={`w-4 h-4 ${style.icon}`} />
            <p className={`text-xs font-medium ${style.text}`}>
              {impactLevel === 'high' ? 'Work Impact' : 'Possible Delays'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// Premium weather icons
function WeatherIcon({ condition, className }: { condition: string; className?: string }) {
  const conditionLower = condition.toLowerCase()
  
  if (conditionLower.includes('clear') || conditionLower.includes('sun')) {
    return <Sun className={className} />
  }
  
  if (conditionLower.includes('cloud') && !conditionLower.includes('rain')) {
    return <Cloud className={className} />
  }
  
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return <CloudRain className={className} />
  }
  
  if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return <Zap className={className} />
  }
  
  if (conditionLower.includes('snow')) {
    return <CloudSnow className={className} />
  }
  
  // Default partly cloudy
  return <Cloud className={className} />
}