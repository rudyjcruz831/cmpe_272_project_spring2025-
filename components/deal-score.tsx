"use client"

import { useState, useEffect } from "react"

interface DealScoreProps {
  encodedAddress: number
  beds: number
  baths: number
  area: number
  price: number
  score?: number | null
  predictedPrice?: number | null
  percentDifference?: number | null
}

export function DealScore({ encodedAddress, beds, baths, area, price, score, predictedPrice, percentDifference }: DealScoreProps) {
  const [loading, setLoading] = useState(!score)
  const [error, setError] = useState<string | null>(null)
  const [currentScore, setCurrentScore] = useState<number | null>(score ?? null)
  const [currentPredictedPrice, setCurrentPredictedPrice] = useState<number | null>(predictedPrice ?? null)
  const [currentPercentDifference, setCurrentPercentDifference] = useState<number | null>(percentDifference ?? null)

  // Update local state when props change
  useEffect(() => {
    setCurrentScore(score ?? null)
    setCurrentPredictedPrice(predictedPrice ?? null)
    setCurrentPercentDifference(percentDifference ?? null)
    setLoading(!score)
  }, [score, predictedPrice, percentDifference])

  const getScoreColor = (score: number | null) => {
    if (score === null) return "bg-gray-200"
    if (score >= 115) return "bg-green-700"
    if (score >= 100) return "bg-green-500"
    if (score >= 90) return "bg-yellow-400"
    if (score >= 75) return "bg-orange-500"
    return "bg-red-500"
  }

  const getScoreText = (score: number | null) => {
    if (score === null) return "-"
    return Math.round(score)
  }

  const getDealQuality = (score: number | null) => {
    if (score === null) return "Calculating..."
    if (score >= 115) return "Exceptional deal"
    if (score >= 100) return "Good deal"
    if (score >= 90) return "Fair deal"
    if (score >= 75) return "Mediocre"
    return "Bad deal"
  }

  const getPriceDifference = () => {
    if (!currentPredictedPrice || currentPercentDifference === null) return null
    const diff = currentPredictedPrice - price
    return {
      amount: Math.abs(Math.round(diff)),
      percent: Math.abs(Math.round(currentPercentDifference)),
      isHigher: diff > 0
    }
  }

  const priceDiff = getPriceDifference()

  return (
    <div className="absolute bottom-5 right-6 flex items-center">
      {!loading && !error && currentPredictedPrice && (
        <div className="text-xs text-gray-600 bg-card/90 px-1 py-0.5 rounded">
          <div className="font-medium">
            Similar Listings: ${Math.round(currentPredictedPrice).toLocaleString()} | This Listing: ${price.toLocaleString()}
          </div>
          {priceDiff && (
            <div className={`text-xs ${priceDiff.isHigher ? 'text-green-600' : 'text-red-600'}`}>
              {priceDiff.isHigher ? '↓' : '↑'} ${priceDiff.amount} ({priceDiff.percent}%) difference
            </div>
          )}
        </div>
      )}
      <div 
        className={`w-9 h-9 rounded-full ${getScoreColor(currentScore)} flex items-center justify-center text-xs font-medium text-white`}
        title={error ? "Error calculating score" : loading ? "Calculating score..." : `Listing Score: ${getScoreText(currentScore)}`}
      >
        {getScoreText(currentScore)}
      </div>
    </div>
  )
} 