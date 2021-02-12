import { Image } from '~/components-styled/image';

export type SanityImageProps = {
  src: string;
  srcSet?: string;
  css?: any;
};

export function SanityImage(props: SanityImageProps) {
  const { src, srcSet, ...imageProps } = props;

  if (!srcSet) {
    return <Image {...props} />;
  }

  const extension = src.split('.')[1];
  return (
    <picture>
      <source srcSet={srcSet.split(extension).join('webp')} type="image/webp" />
      <source srcSet={srcSet} type={`image/${extension}`} />
      <Image src={src} {...imageProps} />
    </picture>
  );
}
