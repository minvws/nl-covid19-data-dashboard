import { findClosestSize } from '~/utils/findClosestSize';

interface LoaderProps {
  src: string;
  width: number;
}

export function imageLoader(props: LoaderProps) {
  const { src, width } = props;
  const filename = src.split('.')[0];
  const extension = src.split('.')[1];
  const url = `cms/${filename}-${findClosestSize(width)}.${extension}`;

  return url;
}
