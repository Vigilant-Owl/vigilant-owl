"use client"

import React, { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

interface RatingProps {
  totalStars?: number;
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
  filledColor?: string;
  unfilledColor?: string;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({
  totalStars = 5,
  initialRating = 0,
  onRatingChange,
  readOnly = false,
  size = 24,
  filledColor = 'text-yellow-500',
  unfilledColor = 'text-gray-300',
  className = ''
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRatingChange = (newRating: number) => {
    if (readOnly) return;

    setRating(newRating);

    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (starIndex: number) => {
    if (readOnly) return;
    setHoverRating(starIndex);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;

        return (
          <button
            type="button"
            key={starValue}
            className={`
              focus:outline-none transition-colors duration-200
              ${!readOnly && 'hover:scale-110'}
            `}
            onClick={() => handleRatingChange(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            disabled={readOnly}
          >
            {starValue <= (hoverRating || rating) ? (
              <FaStar
                size={size}
                className={`${filledColor} ${!readOnly && 'cursor-pointer'}`}
              />
            ) : (
              <FaRegStar
                size={size}
                className={`${unfilledColor} ${!readOnly && 'cursor-pointer'}`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Rating;