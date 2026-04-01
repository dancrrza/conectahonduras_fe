"use client";

import { useState } from "react";
import NextImage, { ImageProps } from "next/image";
import { useFallbackImage } from "@/context/FallbackImageContext";
import { getImageUrl } from "@/sanity/lib/image-builder";

export default function Image({ src, alt = "", ...props }: ImageProps) {
  const fallbackSrc = useFallbackImage();
  const [imgSrc, setImgSrc] = useState<ImageProps["src"]>(src);
  const [hasError, setHasError] = useState(false);

  return (
    <NextImage
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (!hasError && imgSrc !== getImageUrl(fallbackSrc)) {
          setHasError(true);
          setImgSrc(getImageUrl(fallbackSrc));
        }
      }}
    />
  );
}
