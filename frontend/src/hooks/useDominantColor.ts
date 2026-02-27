/**
 * Extracts a dominant color from an image URL for use in gradients (e.g. expanded player background).
 * Uses canvas to sample pixels; no external dependency.
 */

import { useState, useEffect } from 'react';

function getDominantColorFromImageUrl(url: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 32;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve('#1a1a2e');
          return;
        }
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;
        let r = 0, g = 0, b = 0;
        let count = 0;
        const step = 4;
        for (let i = 0; i < data.length; i += step * 4) {
          const pr = data[i];
          const pg = data[i + 1];
          const pb = data[i + 2];
          const brightness = (pr + pg + pb) / 3;
          if (brightness > 30 && brightness < 240) {
            r += pr;
            g += pg;
            b += pb;
            count++;
          }
        }
        if (count === 0) {
          resolve('#1a1a2e');
          return;
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        const hex = '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
        resolve(hex);
      } catch {
        resolve('#1a1a2e');
      }
    };
    img.onerror = () => resolve('#1a1a2e');
    img.src = url;
  });
}

export function useDominantColor(imageUrl: string | undefined): string | null {
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setColor(null);
      return;
    }
    let cancelled = false;
    getDominantColorFromImageUrl(imageUrl).then((c) => {
      if (!cancelled) setColor(c);
    });
    return () => { cancelled = true; };
  }, [imageUrl]);

  return color;
}
