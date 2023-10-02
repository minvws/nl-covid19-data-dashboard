import { Box } from '~/components/base';
import { sizes, space } from '~/style/theme';
import { MaxWidth } from '~/components/max-width';
import { colors } from '@corona-dashboard/common';
import { Heading } from '~/components/typography';
import { Markdown, Tile } from '~/components';
import { Image } from '~/components/image';

interface CampaignBannerProps {
  title: string;
  description: string;
  altText: string;
}

export const CampaignBanner = ({ title, description, altText }: CampaignBannerProps) => (
  <Tile>
    <Box backgroundColor={colors.blue1} marginY={space[4]}>
      <MaxWidth
        alignItems={{ _: 'flex-start', sm: 'center' }}
        display="flex"
        flexDirection={{ _: 'column', md: 'row' }}
        justifyContent="center"
        gridColumnGap={{ _: space[4], md: space[2] }}
        paddingX={{ _: space[3], sm: space[4] }}
        paddingY={space[4]}
      >
        <Box
          maxWidth={sizes.maxWidthText}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          gridRowGap={space[4]}
          paddingX={{ md: space[4], lg: space[5] }}
          paddingY={space[4]}
        >
          <Heading level={2} variant="h2">
            {title}
          </Heading>

          <Markdown content={description} />
        </Box>
        <Box paddingX={{ sm: space[5], md: space[4] }} alignSelf={{ _: 'center', sm: 'left' }}>
          <CampaignImage src={'/images/Najaarsronde-coronaprik-hero.svg'} extension="svg" alt={altText} />
        </Box>
      </MaxWidth>
    </Box>
  </Tile>
);

type CampaignImageProps = {
  src: string;
  extension: string;
  className?: string;
  alt?: string;
};

const CampaignImage = (props: CampaignImageProps) => {
  const { src, extension, ...imageProps } = props;

  return (
    <Box alignSelf="center">
      <picture className={props.className}>
        <source type={`image/${extension}`} />
        <Image loading="lazy" src={src} {...imageProps} />
      </picture>
    </Box>
  );
};
