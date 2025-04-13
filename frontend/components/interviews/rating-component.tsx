"use client"

import { useState } from 'react'
import { Star } from 'lucide-react'
import { interviewsApi } from '@/lib/api/interviews'

export function RatingComponent({ 
  initialRating, 
  interviewId 
}: { 
  initialRating?: number, 
  interviewId: string 
}) {
  const [rating, setRating] = useState(initialRating || 0)
  const [hover, setHover] = useState(0)

  const handleRatingChange = async (currentRating: number) => {
    try {
      const response = await interviewsApi.updateInterviewRating(interviewId, currentRating)
      
      if (response.data) {
        setRating(currentRating)
      } else {
        console.error('Failed to update rating:', response.error)
      }
    } catch (error) {
      console.error('Error updating rating:', error)
    }
  }

  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => {
        const currentRating = index + 1
        return (
          <Star 
            key={currentRating}
            size={24}
            className={`cursor-pointer ${
              currentRating <= (hover || rating) 
                ? 'text-yellow-500 fill-yellow-500' 
                : 'text-gray-300'
            }`}
            onMouseEnter={() => setHover(currentRating)}
            onMouseLeave={() => setHover(0)}
            onClick={() => handleRatingChange(currentRating)}
          />
        )
      })}
      <span className="ml-2 text-sm text-gray-600">
        {rating ? `${rating}/5` : 'Rate this interview'}
      </span>
    </div>
  )
}
