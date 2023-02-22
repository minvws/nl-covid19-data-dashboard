// lib/sanity.ts
import { imageResizeTargets } from '@corona-dashboard/common';
import BlockContent from '@sanity/block-content-to-react';
import { ClientConfig } from '@sanity/client';
import { isPresent } from 'ts-is-present';
import { ImageBlock, SanityFileProps, SanityImageProps } from '~/types/cms';
import { findClosestSize } from '~/utils/find-closest-size';

const config: ClientConfig = {
  /**
   * Find your project ID and dataset in `sanity.json` in your studio project.
   * These are considered “public”, but you can use environment variables if you
   * want differ between local dev and production.
   *
   * https://nextjs.org/docs/basic-features/environment-variables
   **/
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'development',
  projectId: '5mog5ask',
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2021-03-25',
  withCredentials: process.env.NEXT_PUBLIC_PHASE === 'develop',
  /**
   * Set useCdn to `false` if your application require the freshest possible
   * data always (potentially slightly slower and a bit more expensive).
   * Authenticated request (like preview) will always bypass the CDN
   **/
};

// Set up Portable Text serialization
export const PortableText = BlockContent;

// Set up the client for fetching data
export async function getClient(dataset = config.dataset as 'production' | 'development') {
  return (await import('@sanity/client')).default({
    ...config,
    dataset,
  });
}

/**
 * This method reduces multi language query results to a single language.
 *
 * So, a query result that looks like this:
 * {
 *   nl: ...dutchData
 *   en: ...englishData
 * }
 *
 * will be reduced to the following when given languages are [nl]
 * {
 *   ...dutchData
 * }
 *
 */
export function localize<T>(value: T | T[], languages: string[]): T {
  const anyValue = value as any;

  if (Array.isArray(value)) {
    return value.map((v: unknown) => localize(v, languages)) as unknown as T;
  }

  if (typeof value == 'object' && value !== null) {
    if (/^locale[A-Z]/.test(anyValue._type)) {
      const language = languages.find((lang: string) => (value as any)[lang]);

      return (language && localize(anyValue[language], languages)) ?? null;
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
 * Utility to get an object which can be spread on an `<img />`-element. It will
 * return the `src`, `srcSet` and `alt`-attributes together with the width and
 * height. It's probably wise to set `height: auto` with css on the
 * image-element itself for a correctly resizing responsive image.
 *
 * By default the `src` will resolve to a size close to the original size.
 * Optionally you can provide a configuration object to override this size.
 *
 * The configuration object accepts an array called sizes where you map viewport
 * widths to an image width in pixels. This allows you to override the 1-on-1
 * matching behavior of srcSet to a tailored one for your image. E.g. Normally a
 * 1024vw viewport will load a 1024px image.
 *
 *
 * Usage:
 *
 *     <img {...getImageProps(node)} />
 *     <img {...getImageProps(node, {defaultWidth: '450'})} />
 *     <img {...getImageProps(node, {defaultWidth: '450', sizes: [['320', '320'], ['1024', '512']]})} />
 */

type ImageProps = {
  defaultWidth?: string;
  sizes?: string[][];
};

export function getImageProps<T extends ImageBlock>(node: T, options: ImageProps) {
  const { asset, alt = '' } = node;
  const { metadata } = asset;

  const { sizes: sizesOption } = options;

  // This regex part on the following lines,
  // gets the first part of the string and gets alle the numbers and a '.' (if it exists).
  // that would mean that it rmoves the unit from the value.
  // For example:
  // If the input is 100px; It would extraxt the 100 and returns it. without the 'px'.
  // And if it receives a input of 10.5% it would extract the 10.5 and return that value without the '%' character.
  // If the input is non existing or the value is not valid it falls back to its metadata fallback value.
  const regexForFindingValue = /(^[\d]+.[\d]+)/g;
  const extractedWidthValue = (options.defaultWidth && options.defaultWidth.match(regexForFindingValue)) || metadata.dimensions.width;
  const defaultWidth = typeof extractedWidthValue !== 'number' ? parseInt(`${extractedWidthValue}`) : extractedWidthValue;

  const width = findClosestSize(defaultWidth, imageResizeTargets);
  const height = width / metadata.dimensions.aspectRatio;

  const src = getImageSrc(node.asset, defaultWidth);

  /* we keep these undefined for SVGs, which don't need srcSets */
  let srcSet: undefined | string;

  if (asset.extension !== 'svg') {
    /**
     * The following srcset attribute will tell the browser which image-widths
     * are available.
     */
    srcSet = imageResizeTargets.map((size) => `${getImageSrc(asset, size)} ${size}w`).join(', ');
  }

  /**
   * The sizes attribute will tell the browser which image-width to use on given
   * viewport-widths.
   */
  const sizes = sizesOption?.map(([viewportOrSize, size]) => (isPresent(size) ? `(min-width: ${viewportOrSize}px) ${size}` : `${viewportOrSize}`)).join(', ');

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
  return `/cms-files/${asset.assetId}.${asset.extension}`;
}

export function getImageSrc(asset: SanityImageProps, defaultWidth = asset.metadata.dimensions.width) {
  const filename = `${asset.assetId}-${asset.metadata.dimensions.width}x${asset.metadata.dimensions.height}.${asset.extension}`;
  if (asset.extension === 'svg') {
    return `/cms-images/${filename}`;
  }
  const size = findClosestSize(defaultWidth, imageResizeTargets);
  return `/cms-images/${filename}?w=${size}&q=65&auto=format`;
}
