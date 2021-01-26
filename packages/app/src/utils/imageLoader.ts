import { imageResizeTargets } from '@corona-dashboard/common';
import { findClosestSize } from '~/utils/findClosestSize';

interface LoaderProps {
  src: string;
  width: number;
}

export function imageLoader(props: LoaderProps) {
  const { src, width } = props;

  const [filename, extension] = src.split('.');
  const url = `cms/${filename}-${findClosestSize(
    width,
    imageResizeTargets
  )}.${extension}`;

  return url;
}
