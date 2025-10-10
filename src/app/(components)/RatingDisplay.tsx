// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

'use client';

type RatingDisplayProps = {
  rating: number;
};

/**
 * Displays a compact rating out of 5.0 with a currency emoji, rounding down to nearest tenth.
 * @param rating - The rating value (0 to 5).
 */
export default function RatingDisplay({ rating }: RatingDisplayProps) {
  const displayRating = (Math.floor(rating * 10) / 10).toFixed(1);

  return (
    <div className="flex items-center">
      <span className="text-sm">{displayRating} 💵</span>
    </div>
  );
}