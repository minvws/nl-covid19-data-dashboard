import { findClosestSize } from '~/utils/findClosestSize';
import styled from 'styled-components/';
import { imageResizeTargets } from '@corona-dashboard/common';

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
 * This is our Image component. It returns a set of rezided images
 * in a srcSet. Ideally we'll use next/image as soon as it's
 * compatible with next export.
 */
export function Image(props: ImageProps) {
  const { src, width, height, alt } = props;
  const filename = src.split('.')[0];
  const extension = src.split('.')[1];

  const srcSet = imageResizeTargets
    .map((size: number) => {
      return `/cms${filename}-${size}.${extension} ${size}w`;
    })
    .join(', ');

  const url = `/cms${filename}-${findClosestSize(width)}.${extension}`;

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
