import { Image } from '~/components/image';

type SanityImageProps = {
  src: string;
  extension: string;
  srcSet?: string;
  srcSetWebp?: string;
  sizes?: string;
  className?: string;
  alt?: string;
};

export function SanityImage(props: SanityImageProps) {
  const { src, srcSet, srcSetWebp, sizes, extension, ...imageProps } = props;

  if (!srcSet) {
    return <Image src={src} sizes={sizes} {...imageProps} />;
  }

  return (
    <picture className={props.className}>
      {srcSetWebp && (
        <source srcSet={srcSetWebp} sizes={sizes} type="image/webp" />
      )}
      <source srcSet={srcSet} sizes={sizes} type={`image/${extension}`} />
      <Image src={src} srcSet={srcSet} sizes={sizes} {...imageProps} />
    </picture>
  );
}
