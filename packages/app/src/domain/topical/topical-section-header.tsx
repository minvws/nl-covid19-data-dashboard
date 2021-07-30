import { isEmpty } from 'lodash';
import { ReactNode } from 'react';
import { ArrowIconLeft, ArrowIconRight } from '~/components/arrow-icon';
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
}: TopicalSectionHeaderProps) {
  const { siteText: text, formatDateFromSeconds } = useIntl();

  return (
    <Box spacing={3}>
      {showBackLink && (
        <Box fontSize="1.125rem" fontWeight="bold">
          <LinkWithIcon href="/" icon={<ArrowIconLeft />}>
            {text.common_actueel.terug_naar_landelijk}
          </LinkWithIcon>
        </Box>
      )}

      <Box spacing={{ _: 2, lg: 3 }}>
        <Box
          borderBottom="1px solid"
          borderBottomColor="border"
          pb={{ _: 2, lg: 3 }}
          display="flex"
          flexDirection={{ _: 'column', lg: 'row' }}
          alignItems="baseline"
          spacing={2}
        >
          <Heading level={headingLevel} variant="h1">
            {title}
          </Heading>

          {
            /**
             * Check also for empty link text, so that clearing it in Lokalize
             * actually removes the link altogether
             */
            link && !isEmpty(link.text) ? (
              <Box ml={{ _: 0, lg: 4 }} mb={'2px'} fontWeight="bold">
                <LinkWithIcon
                  href={link.href}
                  icon={<ArrowIconRight />}
                  iconPlacement="right"
                >
                  {link.text}
                </LinkWithIcon>
              </Box>
            ) : null
          }
        </Box>

        {lastGenerated && (
          <InlineText color="bodyLight">
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
