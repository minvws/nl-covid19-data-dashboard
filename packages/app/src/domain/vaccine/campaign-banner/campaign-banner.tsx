import { Box } from '~/components/base';
import { sizes, space } from '~/style/theme';
import styled from 'styled-components';
import { MaxWidth } from '~/components/max-width';
import { colors } from '@corona-dashboard/common';
import { Heading } from '~/components/typography';
import { Markdown } from '~/components';

interface CampaignBannerProps {
  title: string;
  description: string;
}

export const CampaignBanner = ({ title, description }: CampaignBannerProps) => (
  <Box backgroundColor={colors.blue1} marginY={space[4]}>
    <BannerContainer
      alignItems={{ _: 'flex-start', sm: 'center' }}
      display="flex"
      flexDirection={{ _: 'column', sm: 'row' }}
      justifyContent="space-between"
      paddingX={{ _: space[3], sm: space[4] }}
      paddingY={space[4]}
    >
      <Box maxWidth={sizes.maxWidthText}>
        <Heading level={2} variant="h2">
          {title}
        </Heading>

        <Markdown content={description} />
      </Box>
    </BannerContainer>
  </Box>
);

const BannerContainer = styled(MaxWidth)`
  column-gap: ${space[4]};
`;
