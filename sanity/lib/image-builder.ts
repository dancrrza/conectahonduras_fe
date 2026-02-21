/**
 * Lightweight Sanity Image Helper
 * Simple utility for handling Sanity images in your storefront
 */
import {
  createImageUrlBuilder,
  ImageUrlBuilder,
  SanityImageSource,
} from "@sanity/image-url";
import type { SanityClient } from "@sanity/client";
import { client } from "@/sanity/lib/client";

let builder: ImageUrlBuilder;

/**
 * Initialize the helper with your Sanity client
 */
export function initImageHelper(client: SanityClient): void {
  builder = createImageUrlBuilder(client);
}

/**
 * Get image URL
 */
export function getImageUrl(
  source?: SanityImageSource,
  width?: number,
): string {
  if (!source) {
    return "";
  }
  if (!builder) {
    initImageHelper(client);
    if (!builder) {
      return "";
    }
  }

  const imageBuilder = builder.image(source);

  if (width) {
    return imageBuilder.width(width).auto("format").quality(85).url();
  }

  return imageBuilder.auto("format").quality(85).url();
}

/**
 * Get thumbnail (square crop)
 */
export function getThumbnail(
  source: SanityImageSource,
  size: number = 150,
): string {
  return builder
    .image(source)
    .width(size)
    .height(size)
    .fit("crop")
    .auto("format")
    .url();
}

/**
 * Get responsive srcSet
 */
export function getSrcSet(
  source: SanityImageSource,
  widths: number[] = [400, 800, 1200],
): string {
  return widths
    .map((w) => `${builder.image(source).width(w).auto("format").url()} ${w}w`)
    .join(", ");
}

/**
 * Get blur placeholder for loading
 */
export function getBlurUrl(source: SanityImageSource): string {
  return builder.image(source).width(20).blur(50).quality(30).url();
}
