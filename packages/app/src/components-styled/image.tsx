import css from '@styled-system/css';
import styled from 'styled-components/';
import { CssFunctionReturnType } from '@styled-system/css';

export const Image = styled.img(
  css({
    display: 'block',
    maxWidth: '100%',
    height: 'auto',
  })
);

type SanityImageProps = {
  src: string;
  srcSet?: string;
  css?: CssFunctionReturnType;
};

export function SanityImage(props: SanityImageProps) {
  const { src, srcSet, ...imageProps } = props;
  const extension = src.split('.').pop();

  if (!srcSet || !extension) {
    return <Image {...props} />;
  }

  return (
    <picture>
      <source srcSet={srcSet.split(extension).join('webp')} type="image/webp" />
      <source srcSet={srcSet} type={`image/${extension}`} />
      <Image src={src} {...imageProps} />
    </picture>
  );
}
