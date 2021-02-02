// lib/sanity.ts
import { imageResizeTargets } from '@corona-dashboard/common';
import BlockContent from '@sanity/block-content-to-react';
import sanityClient from '@sanity/client';
import { TLanguageKey } from '~/locale';
import { ImageBlock, SanityFileProps, SanityImageProps } from '~/types/cms';
import { findClosestSize } from '~/utils/findClosestSize';

const config = {
  /**
   * Find your project ID and dataset in `sanity.json` in your studio project.
   * These are considered “public”, but you can use environment variables
   * if you want differ between local dev and production.
   *
   * https://nextjs.org/docs/basic-features/environment-variables
   **/
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  useCdn: process.env.NODE_ENV === 'production',
  /**
   * Set useCdn to `false` if your application require the freshest possible
   * data always (potentially slightly slower and a bit more expensive).
   * Authenticated request (like preview) will always bypass the CDN
   **/
};

// Set up Portable Text serialization
export const PortableText = BlockContent;

// Set up the client for fetching data in the getProps page functions
export const client = sanityClient(config);

// const builder = imageUrlBuilder(client);
/**
 * Set up a helper function for generating Image URLs with only the asset reference data in your documents.
 * Read more: https://www.sanity.io/docs/image-url
 * CAUTION: This is commented out because we should be talking to our images on our own filesystem!
 * Chances are high this helper will be removed completely!
 **/
// export const urlFor = (source: SanityImageSource) => builder.image(source);

export function localize<T>(value: T | T[], languages: TLanguageKey[]): T {
  const anyValue = value as any;

  if (Array.isArray(value)) {
    return (value.map((v: unknown) => localize(v, languages)) as unknown) as T;
  }

  if (typeof value == 'object' && value !== null) {
    if (/^locale[A-Z]/.test(anyValue._type)) {
      const language = languages.find((lang: string) => (value as any)[lang]);

      return (language && anyValue[language]) ?? null;
    }

    return Object.keys(anyValue).reduce(
      (result, key) => ({
        ...result,
        [key]: localize(anyValue[key], languages),
      }),
      {} as T
    );
  }
  return value;
}

/**
 * Utility to get an object which can be spread on an `<img />`-element.
 * It will return the `src`, `srcSet` and `alt`-attributes together with the
 * width and height.
 * It's probably wise to set `height: auto` with css on the image-element itself
 * for a correctly resizing responsive image.
 *
 * By default the `src` will resolve the to a size close to the original size.
 * Optionally you can provide a second parameter to override this size.
 *
 * Usage:
 *
 *     <img {...getImageProps(node)} />
 *     <img {...getImageProps(node, 450)} />
 */
export function getImageProps<T extends ImageBlock>(
  node: T,
  desiredWith = node.asset.metadata.dimensions.width
) {
  const { asset, alt } = node;
  const { metadata } = asset;

  const width = findClosestSize(desiredWith, imageResizeTargets);
  const height = width / metadata.dimensions.aspectRatio;

  const src = getImageSrc(node.asset, desiredWith);
  const srcSet =
    asset.extension === 'svg'
      ? undefined
      : imageResizeTargets
          .map((size) => `${getImageSrc(asset, size)} ${size}w`)
          .join(', ');

  return {
    src,
    srcSet,
    alt,
    width,
    height,
  };
}

export function getFileSrc(asset: SanityFileProps) {
  return `/cms/files/${asset.assetId}.${asset.extension}`;
}

export function getImageSrc(
  asset: SanityImageProps,
  desiredWidth = asset.metadata.dimensions.width
) {
  if (asset.extension === 'svg') {
    return `/cms/images/${asset.assetId}.svg`;
  }
  const size = findClosestSize(desiredWidth, imageResizeTargets);
  return `/cms/images/${asset.assetId}-${size}.${asset.extension}`;
}
