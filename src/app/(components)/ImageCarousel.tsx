// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

'use client';

import { useState } from 'react';
import Image from 'next/image';

type ImageCarouselProps = {
  images: string[];
  title: string;
};

/**
 * ImageCarousel component for displaying product images with thumbnail navigation.
 * @param images - Array of image URLs.
 * @param title - Product title for alt text.
 */
export default function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [mainImage, setMainImage] = useState(images[0] || '');

  return (
    <div>
      <div className="mb-4">
        <Image
          src={mainImage}
          alt={title}
          width={500}
          height={500}
          className="w-full h-auto rounded-lg object-contain"
        />
      </div>
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto">
          {images.map((img: string, index: number) => (
            <Image
              key={index}
              src={img}
              alt={`${title} ${index + 1}`}
              width={100}
              height={100}
              className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                img === mainImage ? 'border-accent' : 'border-transparent hover:border-accent'
              }`}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
      )}
    </div>
  );
}