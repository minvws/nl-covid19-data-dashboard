// lib/sanity.ts
import { assert, imageResizeTargets } from '@corona-dashboard/common';
import BlockContent from '@sanity/block-content-to-react';
import { ClientConfig, SanityClient } from '@sanity/client';
import { ImageBlock, SanityFileProps, SanityImageProps } from '~/types/cms';
import { findClosestSize } from '~/utils/find-closest-size';

assert(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'NEXT_PUBLIC_SANITY_DATASET is undefined'
);

assert(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'NEXT_PUBLIC_SANITY_PROJECT_ID is undefined'
);

const config: ClientConfig = {
  /**
   * Find your project ID and dataset in `sanity.json` in your studio project.
   * These are considered “public”, but you can use environment variables
   * if you want differ between local dev and production.
   *
   * https://nextjs.org/docs/basic-features/environment-variables
   **/
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2021-03-25',
  withCredentials: process.env.NEXT_PUBLIC_HOT_RELOAD_LOKALIZE === '1',
  /**
   * Set useCdn to `false` if your application require the freshest possible
   * data always (potentially slightly slower and a bit more expensive).
   * Authenticated request (like preview) will always bypass the CDN
   **/
};

// Set up Portable Text serialization
export const PortableText = BlockContent;

// Set up the client for fetching data
let clientInstance: SanityClient | undefined;
export async function getClient() {
  if (clientInstance) return clientInstance;

  clientInstance = (await import('@sanity/client')).default(config);
  return clientInstance;
}

// const builder = imageUrlBuilder(client);
/**
 * Set up a helper function for generating Image URLs with only the asset reference data in your documents.
 * Read more: https://www.sanity.io/docs/image-url
 * CAUTION: This is commented out because we should be talking to our images on our own filesystem!
 * Chances are high this helper will be removed completely!
 **/
// export const urlFor = (source: SanityImageSource) => builder.image(source);

export function localize<T>(value: T | T[], languages: string[]): T {
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
 * Optionally you can provide a configuration objext to override this size.
 *
 * The configuration object accepts a an array called sizes where you map viewport widths to an image width in pixels.
 * This allows you to override the 1-on-1 matching behavior of srcSet to a tailored one for your image.
 * E.g. Normally a 1024vw viewport will load a 1024px image.
 *
 *
 * Usage:
 *
 *     <img {...getImageProps(node)} />
 *     <img {...getImageProps(node, {defaultWidth: 450})} />
 *     <img {...getImageProps(node, {defaultWidth: 450, sizes: [[320, 320], [1024, 512]]})} />
 */

type ImageProps = {
  defaultWidth?: number;
  sizes?: number[][];
};

export function getImageProps<T extends ImageBlock>(
  node: T,
  options: ImageProps
) {
  const { asset, alt = '' } = node;
  const { metadata } = asset;

  const {
    defaultWidth = node.asset.metadata.dimensions.width,
    sizes: sizesOption,
  } = options;

  const width = findClosestSize(defaultWidth, imageResizeTargets);
  const height = width / metadata.dimensions.aspectRatio;

  const src = getImageSrc(node.asset, defaultWidth);
  let srcSet = undefined; //we keep this undefined for SVG's, which don't need srcSets

  if (asset.extension !== 'svg') {
    /**
     * The following srcset attribute will tell the browser which image-widths
     * are available.
     */
    srcSet = imageResizeTargets
      .map((size) => `${getImageSrc(asset, size)} ${size}w`)
      .join(', ');
  }

  /**
   * The sizes attribute will tell the browser which image-width to use on given
   * viewport-widths.
   */
  const sizes = sizesOption
    ?.map(([viewport, size]) => `(min-width: ${viewport}px) ${size}px`)
    .join(', ');

  return {
    src,
    srcSet,
    sizes,
    alt,
    width,
    height,
    extension: asset.extension,
  };
}

export function getFileSrc(asset: SanityFileProps) {
  return `/cms/files/${asset.assetId}.${asset.extension}`;
}

export function getImageSrc(
  asset: SanityImageProps,
  defaultWidth = asset.metadata.dimensions.width
) {
  if (asset.extension === 'svg') {
    return `/cms/images/${asset.assetId}.svg`;
  }
  const size = findClosestSize(defaultWidth, imageResizeTargets);
  return `/cms/images/${asset.assetId}-${size}.${asset.extension}`;
}

export function maybeCreateWebpUrl(url: string) {
  const extensionRegex = /(.(png|gif|jpe?g))$/;

  return url.startsWith('/cms/images') && extensionRegex.test(url)
    ? url.replace(extensionRegex, '.webp')
    : undefined;
}
