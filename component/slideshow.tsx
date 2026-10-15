"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface StorySlideshowProps {
  images: string[];
}

export default function StorySlideshow({ images }: StorySlideshowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const validImages = imagesRef.current.filter(
      (img): img is HTMLImageElement => img !== null
    );
    if (validImages.length === 0) return;

    let intervalId: NodeJS.Timeout;

    // gsap.context ले React Strict Mode मा animation अड्किन दिँदैन
    const ctx = gsap.context(() => {
      // 1. सुरुआतमा पहिलो फोटो बाहेक अरुलाई hide गर्ने
      gsap.set(validImages, { opacity: 0, scale: 1, zIndex: 0 });
      gsap.set(validImages[0], { opacity: 1, scale: 1, zIndex: 1 });

      // पहिलो फोटोको initial zoom
      gsap.to(validImages[0], {
        scale: 1.08,
        duration: 6,
        ease: "none",
      });

      let currentIndex = 0;
      const stayDuration = 5000; // प्रत्येक फोटो ५ सेकेन्ड बस्ने
      const fadeDuration = 1.5;  // अर्को फोटोमा सर्दा १.५ सेकेन्ड लाग्ने

      const nextSlide = () => {
        const currentImg = validImages[currentIndex];
        // गणितीय हिसाबले अन्तिम फोटोपछि आफैं पहिलो (0) मा जान्छ
        const nextIndex = (currentIndex + 1) % validImages.length;
        const nextImg = validImages[nextIndex];

        // अर्को फोटोलाई माथि ल्याउने (zIndex: 2)
        gsap.set(nextImg, { zIndex: 2, scale: 1, opacity: 0 });
        gsap.set(currentImg, { zIndex: 1 });

        // अर्को फोटो Fade In हुने
        gsap.to(nextImg, {
          opacity: 1,
          duration: fadeDuration,
          ease: "power2.inOut",
        });

        // अर्को फोटो बिस्तारै Zoom हुने
        gsap.to(nextImg, {
          scale: 1.08,
          duration: stayDuration / 1000 + fadeDuration,
          ease: "none",
        });

        // पुरानो फोटो बिस्तारै हराउने (Fade Out)
        gsap.to(currentImg, {
          opacity: 0,
          duration: fadeDuration,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(currentImg, { zIndex: 0, scale: 1 });
          },
        });

        currentIndex = nextIndex;
      };

      // निरन्तर लुप चलाउने
      intervalId = setInterval(nextSlide, stayDuration);
    }, containerRef);

    return () => {
      clearInterval(intervalId);
      ctx.revert(); // सफा गर्ने ताकि loop कहिल्यै नअड्कियोस्
    };
  }, [images]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden bg-slate-950"
    >
      {images.map((src, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          ref={(el) => {
            imagesRef.current[index] = el;
          }}
          src={src}
          alt="Story background"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ))}
    </div>
  );
}