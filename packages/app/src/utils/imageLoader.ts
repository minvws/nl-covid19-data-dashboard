import { findClosestSize } from '~/utils/findClosestSize';

interface LoaderProps {
  src: string;
  width: number;
}

export interface SanityImageProps {
  assetId: string;
  extension: string;
  metadata: {
    dimensions: {
      aspectRatio: number;
    };
  };
}

export function imageLoader(props: LoaderProps) {
  const { src, width } = props;
  const filename = src.split('.')[0];
  const extension = src.split('.')[1];

  return `cms/${filename}-${findClosestSize(width)}.${extension}`;
}
