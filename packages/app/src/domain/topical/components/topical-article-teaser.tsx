import { colors } from '@corona-dashboard/common';
import { ArrowIconRight } from '~/components/arrow-icon';
import { BackgroundImage } from '~/components/background-image';
import { Box } from '~/components/base';
import { HeadingLinkWithIcon } from '~/components/link-with-icon';
import { Text } from '~/components/typography';
import { space } from '~/style/theme';
import { ImageBlock } from '~/types/cms';

export interface TopicalArticleTeaserProps {
  title: string;
  slug: string;
  cover: ImageBlock;
  category: string;
}

export const TopicalArticleTeaser = ({ title, slug, cover, category }: TopicalArticleTeaserProps) => {
  const imageWidth = 90;

  return (
    <Box display="flex" spacingHorizontal={3} width="100%" alignItems="center" paddingRight={space[3]}>
      <Box maxWidth={imageWidth} width="100%">
        <BackgroundImage image={cover} height="66px" sizes={[[imageWidth]]} />
      </Box>

      <Box maxWidth="25rem" spacing={2}>
        <Text variant="overline2" color={colors.gray7}>
          {category}
        </Text>

        <HeadingLinkWithIcon href={`/artikelen/${slug}`} icon={<ArrowIconRight />} iconPlacement="right" underline>
          {title}
        </HeadingLinkWithIcon>
      </Box>
    </Box>
  );
};
