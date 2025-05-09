"use client"

import { useState, useEffect } from "react"

interface DealScoreProps {
  encodedAddress: number
  beds: number
  baths: number
  area: number
  price: number
}

export function DealScore({ encodedAddress, beds, baths, area, price }: DealScoreProps) {
  const [score, setScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null)

  useEffect(() => {
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
        setScore(data.normalized_score)
        setPredictedPrice(data.predicted_price)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchScore()
  }, [encodedAddress, beds, baths, area, price])

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
    if (!predictedPrice) return null
    const diff = predictedPrice - price
    const percentDiff = (diff / predictedPrice) * 100
    return {
      amount: Math.abs(Math.round(diff)),
      percent: Math.abs(Math.round(percentDiff)),
      isHigher: diff > 0
    }
  }

  const priceDiff = getPriceDifference()

  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-2">
      {!loading && !error && predictedPrice && (
        <div className="text-xs text-gray-600 bg-white/90 px-2 py-1 rounded">
          <div className="font-medium">
            ${price.toLocaleString()} vs ${Math.round(predictedPrice).toLocaleString()}
          </div>
          {priceDiff && (
            <div className={`text-xs ${priceDiff.isHigher ? 'text-green-600' : 'text-red-600'}`}>
              {priceDiff.isHigher ? '↓' : '↑'} ${priceDiff.amount} ({priceDiff.percent}%)
            </div>
          )}
        </div>
      )}
      <div 
        className={`w-8 h-8 rounded-full ${getScoreColor(score)} flex items-center justify-center text-xs font-medium text-white`}
        title={error ? "Error calculating score" : loading ? "Calculating score..." : `Deal Score: ${getScoreText(score)}`}
      >
        {getScoreText(score)}
      </div>
    </div>
  )
} 