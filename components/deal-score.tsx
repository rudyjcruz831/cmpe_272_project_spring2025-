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
}

export function DealScore({ encodedAddress, beds, baths, area, price, score, predictedPrice }: DealScoreProps) {
  const [loading, setLoading] = useState(!score)
  const [error, setError] = useState<string | null>(null)
  const [currentScore, setCurrentScore] = useState<number | null>(score ?? null)
  const [currentPredictedPrice, setCurrentPredictedPrice] = useState<number | null>(predictedPrice ?? null)

  useEffect(() => {
    if (score === undefined) {
      const fetchScore = async () => {
        try {
          const response = await fetch("http://localhost:8000/predict", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              encoded_address: encodedAddress,
              beds: beds,
              baths: baths,
              area: area,
              price: price
            }),
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          setCurrentScore(data.normalized_score)
          setCurrentPredictedPrice(data.predicted_price)
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
          setLoading(false)
        }
      }

      fetchScore()
    }
  }, [encodedAddress, beds, baths, area, price, score])

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

  const getPriceDifference = () => {
    if (!currentPredictedPrice) return null
    const diff = currentPredictedPrice - price
    const percentDiff = (diff / currentPredictedPrice) * 100
    return {
      amount: Math.abs(Math.round(diff)),
      percent: Math.abs(Math.round(percentDiff)),
      isHigher: diff > 0
    }
  }

  const priceDiff = getPriceDifference()

  return (
    <div className="absolute bottom-6 right-4 flex items-center gap-2">
      {!loading && !error && currentPredictedPrice && (
        <div className="text-xs text-gray-600 bg-white/90 px-2 py-1 rounded">
          <div className="font-medium">
            Listed: ${price.toLocaleString()} | Expected: ${Math.round(currentPredictedPrice).toLocaleString()}
          </div>
          {priceDiff && (
            <div className={`text-xs ${priceDiff.isHigher ? 'text-green-600' : 'text-red-600'}`}>
              {priceDiff.isHigher ? '↓' : '↑'} ${priceDiff.amount} ({priceDiff.percent}%) difference
            </div>
          )}
        </div>
      )}
      <div 
        className={`w-8 h-8 rounded-full ${getScoreColor(currentScore)} flex items-center justify-center text-xs font-medium text-white`}
        title={error ? "Error calculating score" : loading ? "Calculating score..." : `Listing Score: ${getScoreText(currentScore)}`}
      >
        {getScoreText(currentScore)}
      </div>
    </div>
  )
} 