import { ChevronRight } from '@corona-dashboard/icons';
import { isEmpty } from 'lodash';
import { ReactNode } from 'react';
import { ArrowIconLeft } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { LinkWithIcon } from '~/components/link-with-icon';
import { RelativeDate } from '~/components/relative-date';
import { Heading, HeadingLevel, InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { space } from '~/style/theme';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';

interface TopicalSectionHeaderProps {
  title: ReactNode;
  text: SiteText['pages']['topical_page']['shared'];
  description?: string;
  lastGenerated?: number;
  showBackLink?: boolean;
  headingLevel?: HeadingLevel;
  headerVariant?: 'h1' | 'h2';
  link?: {
    href: string;
    text: string;
  };
}

export const TopicalSectionHeader = ({ title, lastGenerated, showBackLink, link, description, headingLevel = 2, headerVariant = 'h1', text }: TopicalSectionHeaderProps) => {
  const { formatDateFromSeconds } = useIntl();

  return (
    <Box spacing={3}>
      {showBackLink && (
        <Box paddingY={space[3]} borderBottom={'solid 1px'} borderColor={'gray3'}>
          <LinkWithIcon href="/" icon={<ArrowIconLeft />}>
            {text.terug_naar_landelijk}
          </LinkWithIcon>
        </Box>
      )}

      <Box spacing={{ _: 1, lg: 2 }}>
        <Box display="flex" flexDirection={{ _: 'column', lg: 'row' }} alignItems="baseline" spacing={2} spacingHorizontal={{ _: 0, lg: 4 }} flexWrap="wrap">
          <Heading level={headingLevel} variant={headerVariant}>
            {title}
          </Heading>

          {
            /**
             * Check also for empty link text, so that clearing it in Lokalize
             * actually removes the link altogether
             */
            link && !isEmpty(link.text) && (
              <Box marginBottom="2px">
                <LinkWithIcon href={link.href} icon={<ChevronRight />} iconPlacement="right">
                  {link.text}
                </LinkWithIcon>
              </Box>
            )
          }
        </Box>

        {lastGenerated && (
          <InlineText variant="label1" color="gray7">
            {replaceComponentsInText(text.laatst_bijgewerkt, {
              date: <RelativeDate dateInSeconds={lastGenerated} />,
              time: formatDateFromSeconds(lastGenerated, 'time'),
            })}
          </InlineText>
        )}

        {description && (
          <Box maxWidth={'30em'}>
            <Text>{description}</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};
