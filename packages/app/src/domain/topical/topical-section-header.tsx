import { Chevron } from '@corona-dashboard/icons';
import { isEmpty } from 'lodash';
import { ReactNode } from 'react';
import { ArrowIconLeft } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { LinkWithIcon } from '~/components/link-with-icon';
import { RelativeDate } from '~/components/relative-date';
import {
  Heading,
  HeadingLevel,
  InlineText,
  Text,
} from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';

interface TopicalSectionHeaderProps {
  title: ReactNode;
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

export function TopicalSectionHeader({
  title,
  lastGenerated,
  showBackLink,
  link,
  description,
  headingLevel = 2,
  headerVariant = 'h1',
}: TopicalSectionHeaderProps) {
  const { siteText: text, formatDateFromSeconds } = useIntl();

  return (
    <Box spacing={3}>
      {showBackLink && (
        <Box py={3} borderBottom={'solid 1px'} borderColor={'border'}>
          <LinkWithIcon href="/" icon={<ArrowIconLeft />}>
            {text.common_actueel.terug_naar_landelijk}
          </LinkWithIcon>
        </Box>
      )}

      <Box spacing={{ _: 1, lg: 2 }}>
        <Box
          display="flex"
          flexDirection={{ _: 'column', lg: 'row' }}
          alignItems="baseline"
          spacing={2}
          spacingHorizontal={{ _: 0, lg: 4 }}
          flexWrap="wrap"
        >
          <Heading level={headingLevel} variant={headerVariant}>
            {title}
          </Heading>

          {
            /**
             * Check also for empty link text, so that clearing it in Lokalize
             * actually removes the link altogether
             */
            link && !isEmpty(link.text) ? (
              <Box mb={'2px'}>
                <LinkWithIcon
                  href={link.href}
                  icon={<Chevron />}
                  iconPlacement="right"
                >
                  {link.text}
                </LinkWithIcon>
              </Box>
            ) : null
          }
        </Box>

        {lastGenerated && (
          <InlineText variant="label1" color="bodyLight">
            {replaceComponentsInText(text.common_actueel.laatst_bijgewerkt, {
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
}
