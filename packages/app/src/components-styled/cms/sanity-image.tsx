import { Image } from '~/components-styled/image';

type SanityImageProps = {
  src: string;
  srcSet?: string;
  extension: string;
};

export function SanityImage(props: SanityImageProps) {
  const { src, srcSet, extension, ...imageProps } = props;

  if (!srcSet) {
    return <Image src={src} {...imageProps} />;
  }

  return (
    <picture>
      <source srcSet={srcSet.split(extension).join('webp')} type="image/webp" />
      <source srcSet={srcSet} type={`image/${extension}`} />
      <Image src={src} {...imageProps} />
    </picture>
  );
}
