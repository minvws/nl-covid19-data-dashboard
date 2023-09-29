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
}

export const CampaignBanner = ({ title, description }: CampaignBannerProps) => (
  <Tile>
    <Box backgroundColor={colors.blue1} marginY={space[4]}>
      <MaxWidth
        alignItems={{ _: 'flex-start', sm: 'center' }}
        display="flex"
        flexDirection={{ _: 'column', sm: 'row' }}
        justifyContent="center"
        gridColumnGap={space[4]}
        paddingX={{ _: space[3], sm: space[4] }}
        paddingY={space[4]}
      >
        <Box
          maxWidth={sizes.maxWidthText}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          gridRowGap={space[4]}
          paddingX={{ sm: space[3], md: space[5] }}
          paddingY={space[4]}
        >
          <Heading level={2} variant="h2">
            {title}
          </Heading>

          <Markdown content={description} />
        </Box>
        <Box paddingX={{ sm: space[5], md: space[2] }} alignSelf={{ _: 'center', sm: 'left' }}>
          <CampaignImage src={'/images/Najaarsronde-coronaprik-hero.svg'} extension="svg" />
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
