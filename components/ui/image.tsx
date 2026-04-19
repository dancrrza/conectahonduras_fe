"use client";

import { useState } from "react";
import NextImage, { ImageProps } from "next/image";

export default function Image({ src, alt = "", ...props }: ImageProps) {
  const [imgSrc, setImgSrc] = useState<ImageProps["src"]>(src);
  const [hasError, setHasError] = useState(false);

  return (
    <NextImage
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc("/logo-white.png");
        }
      }}
    />
  );
}
