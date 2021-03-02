import { ReactNode } from 'react';
import { ArrowIconLeft } from '~/components-styled/arrow-icon';
import { Box } from '~/components-styled/base';
import { LinkWithIcon } from '~/components-styled/link-with-icon';
import { RelativeDate } from '~/components-styled/relative-date';
import { Heading, InlineText } from '~/components-styled/typography';
import text from '~/locale';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';

interface TopicalPageHeaderProps {
  title: ReactNode;
  lastGenerated: number;
  showBackLink?: boolean;
  link?: ReactNode;
}

export function TopicalPageHeader({
  title,
  lastGenerated,
  showBackLink,
  link,
}: TopicalPageHeaderProps) {
  return (
    <Box spacing={3}>
      {showBackLink && (
        <Box fontSize="1.125rem">
          <LinkWithIcon href="/" fontWeight="bold" icon={<ArrowIconLeft />}>
            {text.common_actueel.terug_naar_landelijk}
          </LinkWithIcon>
        </Box>
      )}

      <Box>
        <Box
          borderBottomColor="border"
          borderBottomStyle="solid"
          borderBottomWidth="1px"
          pb={{ _: 2, lg: 3 }}
          mb={{ _: 2, lg: 3 }}
          display="flex"
          flexDirection={{ _: 'column', lg: 'row' }}
          alignItems="baseline"
        >
          <Heading
            level={1}
            m={0}
            mb={{ _: 2, lg: 0 }}
            lineHeight={0}
            fontSize={{ _: '2rem', lg: '2.75rem' }}
          >
            {title}
          </Heading>
          {link && <Box ml={{ _: 0, lg: 4 }}>{link}</Box>}
        </Box>
        <InlineText color="bodyLight">
          {replaceComponentsInText(text.common_actueel.laatst_bijgewerkt, {
            date: <RelativeDate dateInSeconds={lastGenerated} />,
            time: formatDateFromSeconds(lastGenerated, 'time'),
          })}
        </InlineText>
      </Box>
    </Box>
  );
}
