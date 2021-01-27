import { Box } from '~/components-styled/base';
import { Text } from '~/components-styled/typography';
import { LinkWithIcon } from './link-with-icon';
import { Tile } from '~/components-styled/tile';
import css from '@styled-system/css';
import { colors } from '~/style/theme'
import ArrowIcon from '~/assets/arrow.svg';
import { urlFor } from '~/lib/sanity';

export function ArticleStrip(props) {
  const { articleSummaries } = props;
  console.log(articleSummaries)

  return (
    <Tile css={css({ background: colors.lightBlue, flexDirection: 'row', flexWrap: 'wrap' })}>
      <Text css={css({ width: '100%' })}>Meer informatie over dit onderwerp</Text>

      {articleSummaries.map((article, index: number) => (
        <Box key={index} display="flex" width={'50%'}>
          <Image height={200} image={article.cover} />

          <Box>
            <Text>{article.title}</Text>
            <LinkWithIcon href={'/go'} icon={<ArrowIcon css={css({ transform: 'rotate(-90deg)' })} />} iconPlacement="right" fontWeight="bold">
              Lees meer
            </LinkWithIcon>
          </Box>
        </Box>
      ))}
    </Tile>
  )
}


function Image({ height, image }: CoverImageProps) {
  const url = urlFor(image).url();
  
  return (
    <Box width={150} height={110} overflow="hidden">
      <img src={url}/>
    </Box>
  )
}

// type CoverImageProps = {
//   image: ImageBlock;
//   height: number;
// };

// function CoverImage({ height, image }: CoverImageProps) {
//   const url = urlFor(image).url();
//   assert(
//     url !== null,
//     `Could not get url for node: ${JSON.stringify(image, null, 2)}`
//   );

//   const { hotspot } = image;

//   const bgPosition = hotspot
//     ? `${hotspot.x * 100}% ${hotspot.y * 100}%`
//     : undefined;

//   return (
//     <Box height={height} overflow="hidden">
//       <BackgroundImage
//         height={height}
//         backgroundImage={`url(${url})`}
//         backgroundPosition={bgPosition}
//         backgroundRepeat="no-repeat"
//         backgroundSize="cover"
//         aria-label={image.alt}
//       />
//     </Box>
//   );
// }