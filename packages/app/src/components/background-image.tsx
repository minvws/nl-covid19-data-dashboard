import css from '@styled-system/css';
import { CSSProperties } from 'styled-components';
import { getImageProps } from '~/lib/sanity';
import { ImageBlock } from '~/types/cms';
import { SanityImage } from './cms/sanity-image';

interface BackgroundImageProps {
  image: ImageBlock;
  height: CSSProperties['height'];
  objectFit?: CSSProperties['objectFit'];
  objectPosition?: CSSProperties['objectPosition'];
  sizes?: string[][];
  className?: string;
}

export function BackgroundImage({
  height,
  image,
  sizes,
  className,
  objectFit = 'cover',
  objectPosition = image.hotspot ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%` : undefined,
}: BackgroundImageProps) {
  return (
    <div
      css={css({
        width: '100%',
        height,
        overflow: 'hidden',
        position: 'relative',
        'picture, source, img': {
          '@supports (object-fit: cover)': {
            width: '100%',
            height: '100%',
            position: 'absolute',
            objectFit,
            objectPosition,
          },
        },
      })}
    >
      <SanityImage {...getImageProps(image, { sizes })} className={className} />
    </div>
  );
}
