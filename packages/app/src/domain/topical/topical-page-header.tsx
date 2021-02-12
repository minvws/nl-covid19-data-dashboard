import css from '@styled-system/css';
import { ReactNode } from 'react';
import ArrowIcon from '~/assets/arrow.svg';

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
}

export function TopicalPageHeader({
  title,
  lastGenerated,
  showBackLink,
}: TopicalPageHeaderProps) {
  return (
    <Box spacing={3}>
      {showBackLink && (
        <Box fontSize="1.125rem">
          <LinkWithIcon
            href="/"
            fontWeight="bold"
            icon={<ArrowIcon css={css({ transform: 'rotate(90deg)' })} />}
          >
            {text.common_actueel.terug_naar_landelijk}
          </LinkWithIcon>
        </Box>
      )}

      <Box>
        <Heading
          level={1}
          fontWeight="normal"
          m={0}
          lineHeight={0}
          mb={2}
          fontSize={{ _: '2rem', lg: '2.75rem' }}
        >
          {title}
        </Heading>
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
