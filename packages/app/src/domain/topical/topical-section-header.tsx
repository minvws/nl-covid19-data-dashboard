import { isEmpty } from 'lodash';
import { ReactNode } from 'react';
import { ArrowIconLeft, ArrowIconRight } from '~/components-styled/arrow-icon';
import { Box } from '~/components-styled/base';
import { LinkWithIcon } from '~/components-styled/link-with-icon';
import { RelativeDate } from '~/components-styled/relative-date';
import {
  Heading,
  HeadingLevel,
  InlineText,
  Text,
} from '~/components-styled/typography';
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
}: TopicalSectionHeaderProps) {
  const { siteText: text, formatDateFromSeconds } = useIntl();

  return (
    <Box spacing={3} mt={{ _: 2, md: 4 }}>
      {showBackLink && (
        <Box fontSize="1.125rem">
          <LinkWithIcon href="/" fontWeight="bold" icon={<ArrowIconLeft />}>
            {text.common_actueel.terug_naar_landelijk}
          </LinkWithIcon>
        </Box>
      )}

      <Box>
        <Box
          borderBottom="1px solid"
          borderBottomColor="border"
          pb={{ _: 2, lg: 3 }}
          mb={{ _: 2, lg: 3 }}
          display="flex"
          flexDirection={{ _: 'column', lg: 'row' }}
          alignItems="baseline"
        >
          <Heading
            level={2}
            fontWeight="bold"
            m={0}
            mb={{ _: 2, lg: 0 }}
            lineHeight={0}
          >
            {title}
          </Heading>

          {
            /**
             * Check also for empty link text, so that clearing it in Lokalize
             * actually removes the link altogether
             */
            link && !isEmpty(link.text) ? (
              <Box ml={{ _: 0, lg: 4 }} mb={'2px'}>
                <LinkWithIcon
                  href={link.href}
                  icon={<ArrowIconRight />}
                  iconPlacement="right"
                  fontWeight="bold"
                >
                  {link.text}
                </LinkWithIcon>
              </Box>
            ) : null
          }
        </Box>
        {lastGenerated && (
          <InlineText color="bodyLight" fontSize={2}>
            {replaceComponentsInText(text.common_actueel.laatst_bijgewerkt, {
              date: <RelativeDate dateInSeconds={lastGenerated} />,
              time: formatDateFromSeconds(lastGenerated, 'time'),
            })}
          </InlineText>
        )}

        {description && (
          <Box mb={4} maxWidth={'30em'}>
            <Text>{description}</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
