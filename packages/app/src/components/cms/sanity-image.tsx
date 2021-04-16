import { Image } from '~/components/image';

type SanityImageProps = {
  src: string;
  extension: string;
  srcSet?: string;
  sizes?: string;
  className?: string;
  alt?: string;
};

export function SanityImage(props: SanityImageProps) {
  const { src, srcSet, sizes, extension, ...imageProps } = props;

  if (!srcSet) {
    return <Image src={src} sizes={sizes} {...imageProps} />;
  }

  return (
    <picture className={props.className}>
      <source
        srcSet={srcSet.split(extension).join('webp')}
        sizes={sizes}
        type="image/webp"
      />
      <source srcSet={srcSet} sizes={sizes} type={`image/${extension}`} />
      <Image src={src} srcSet={srcSet} sizes={sizes} {...imageProps} />
    </picture>
  );
}
