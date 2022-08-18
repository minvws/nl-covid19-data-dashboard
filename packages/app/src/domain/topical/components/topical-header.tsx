import { Chevron } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import { isEmpty } from 'lodash';
import { ReactNode } from 'react';
import { asResponsiveArray } from '~/style/utils';
import { Box } from '~/components/base';
import { LinkWithIcon } from '~/components/link-with-icon';
import { Heading, HeadingLevel, Text } from '~/components/typography';

interface TopicalHeaderProps {
  title: ReactNode;
  description_first?: string;
  description_second?: string;
  headingLevel?: HeadingLevel;
  linkFirst?: {
    href: string;
    text: string;
  };
  linkSecond?: {
    href: string;
    text: string;
  };
}

export function TopicalHeader({
  title,
  linkFirst,
  linkSecond,
  description_first,
  description_second,
  headingLevel = 2,
}: TopicalHeaderProps) {
  return (
    <Box spacing={3}>
      <Box spacing={{ _: 1, lg: 2 }}>
        <Box
          display="flex"
          flexDirection={{ _: 'column', sm: 'row' }}
          alignItems="flex-start"
          spacing={{ _: 3, sm: 0 }}
          width="100%"
        >
          <Heading level={headingLevel}>{title}</Heading>
        </Box>
        <Box
          css={css({
            width: asResponsiveArray({
              xl: '25%',
              lg: '50%',
              sm: '100%',
            }),
          })}
        >
          {
            /**
             * Check also for empty link text, so that clearing it in Lokalize
             * actually removes the link altogether
             */
            linkFirst && !isEmpty(linkFirst.text) ? (
              <Box
                display="flex"
                flexDirection={{ _: 'row', sm: 'row' }}
                alignItems="baseline"
              >
                <Text>{description_first}</Text>
                <LinkWithIcon
                  href={linkFirst.href}
                  icon={<Chevron />}
                  iconPlacement="right"
                >
                  {linkFirst.text}
                </LinkWithIcon>
              </Box>
            ) : null
          }
        </Box>
        <Box>
          {
            /**
             * Check also for empty link text, so that clearing it in Lokalize
             * actually removes the link altogether
             */
            linkSecond && !isEmpty(linkSecond.text) ? (
              <Box mb={'2px'}>
                <Text>{description_second}</Text>
                <LinkWithIcon
                  href={linkSecond.href}
                  icon={<Chevron />}
                  iconPlacement="right"
                >
                  {linkSecond.text}
                </LinkWithIcon>
              </Box>
            ) : null
          }
        </Box>
      </Box>
    </Box>
  );
}
