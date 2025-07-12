// ai-color-palette-generator/src/pages/index.tsx

 'use client';

import { useState, useRef, useEffect } from 'react';
import ColorThief from 'color-thief-browser';
import Image from 'next/image';

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const extractColors = async () => {
      if (imgRef.current && imageSrc) {
        const colorThief = new ColorThief();
        const result = await colorThief.getPalette(imgRef.current, 6);
        const hexColors = result.map((rgb: number[]) => {
          return `#${rgb.map(x => x.toString(16).padStart(2, '0')).join('')}`;
        });
        setColors(hexColors);
      }
    };

    if (imageSrc) {
      const timeout = setTimeout(() => extractColors(), 500); // Delay to ensure image loads
      return () => clearTimeout(timeout);
    }
  }, [imageSrc]);

  return (
    <main className="min-h-screen p-8 bg-gray-100 text-center">
      <h1 className="text-3xl font-bold mb-6">🎨 AI Color Palette Generator</h1>

      <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />

      {imageSrc && (
        <div className="flex flex-col items-center">
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Uploaded"
            crossOrigin="anonymous"
            className="max-w-md rounded-md shadow-md"
          />

          <div className="mt-6 grid grid-cols-3 sm:grid-cols-6 gap-4">
            {colors.map((color, index) => (
              <div
                key={index}
                className="w-16 h-16 rounded shadow-md border border-gray-300"
                style={{ backgroundColor: color }}
                title={color}
              >
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
