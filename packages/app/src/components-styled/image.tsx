import { imageResizeTargets } from '@corona-dashboard/common';
import { findClosestSize } from '~/utils/findClosestSize';
import styled from 'styled-components/';

type ImageProps = {
  src: string;
  width: number;
  height: number;
  alt?: string;
};

const Img = styled.img`
  max-width: 100%;
  height: auto;
`;

/**
 *
 * This is our Image component. It returns a set of resized images
 * in a srcSet. Ideally we'll use next/image as soon as it's
 * compatible with next export.
 */
export function Image(props: ImageProps) {
  const { src, width, height, alt } = props;
  const [filename, extension] = src.split('.');

  const srcSet = imageResizeTargets
    .map((size: number) => {
      return `/cms${filename}-${size}.${extension} ${size}w`;
    })
    .join(', ');

  // filename contains a leading slash.
  const url = `/cms${filename}-${findClosestSize(
    width,
    imageResizeTargets
  )}.${extension}`;

  return (
    <Img
      src={url}
      srcSet={srcSet}
      alt={alt}
      width={width}
      height={Math.floor(height)}
      loading="lazy"
    />
  );
}
