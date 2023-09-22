import { Box } from '~/components/base';
import { sizes, space } from '~/style/theme';
import styled from 'styled-components';
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
      <BannerContainer
        alignItems={{ _: 'flex-start', sm: 'center' }}
        display="flex"
        flexDirection={{ _: 'column', sm: 'row' }}
        justifyContent="center"
        paddingX={{ _: space[3], sm: space[4] }}
        paddingY={space[4]}
      >
        <CampaignDescription
          maxWidth={sizes.maxWidthText}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          paddingX={{ sm: space[3], md: space[5] }}
          paddingY={space[4]}
        >
          <Heading level={2} variant="h2">
            {title}
          </Heading>

          <Markdown content={description} />
        </CampaignDescription>
        <Box paddingX={{ sm: space[5], md: space[2] }} alignSelf={{ _: 'center', sm: 'left' }}>
          <CampaignIllustration src={'/images/Najaarsronde-coronaprik-hero.svg'} extension="svg" />
        </Box>
      </BannerContainer>
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
    <picture className={props.className}>
      <source type={`image/${extension}`} />
      <Image loading="lazy" src={src} {...imageProps} />
    </picture>
  );
};

const BannerContainer = styled(MaxWidth)`
  column-gap: ${space[4]};
`;

const CampaignDescription = styled(Box)`
  row-gap: ${space[4]};
`;

const CampaignIllustration = styled(CampaignImage)`
  align-self: center;
`;
