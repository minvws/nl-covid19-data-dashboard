import css from '@styled-system/css';
import styled from 'styled-components';
import ChevronLargeIcon from '~/assets/chevron-large.svg';
import ExternalLinkIcon from '~/assets/external-link-2.svg';
import { Box } from '~/components/base';
import { ExternalLink } from '~/components/external-link';
import { InlineText } from '~/components/typography';
import { asResponsiveArray } from '~/style/utils';
import { isAbsoluteUrl } from '~/utils/is-absolute-url';
import { Link } from '~/utils/link';

interface usefulLinksProps {
  links: {
    title: string;
    href: string;
  }[];
}

export function UsefulLinks({ links }: usefulLinksProps) {
  return (
    <Box>
      <InlineText
        mb={2}
        fontSize="1.25rem"
        as="span"
        fontWeight="bold"
        css={css({ display: 'block' })}
      >
        Nuttige links
      </InlineText>
      <OrderedList>
        {links.map((link, index) => (
          <ListItem key={index}>
            {isAbsoluteUrl(link.href) ? (
              <ExternalLink href={link.href}>
                <TitleWidthIcon
                  title={link.title}
                  icon={<ExternalLinkIcon />}
                />
              </ExternalLink>
            ) : (
              <>
                <Link href={link.href} passHref>
                  <a>
                    <TitleWidthIcon
                      title={link.title}
                      icon={<ChevronLargeIcon />}
                    />
                  </a>
                </Link>
              </>
            )}
          </ListItem>
        ))}
      </OrderedList>
    </Box>
  );
}

function TitleWidthIcon({
  title,
  icon,
}: {
  title: string;
  icon?: JSX.Element;
}) {
  const splittedWords = title.split(' ');

  return (
    <>
      {splittedWords.map((word, index) => (
        <InlineText
          key={index}
          css={css({
            whiteSpace: 'pre-wrap',
            fontFamily: 'body',
            fontSize: '1rem',
          })}
        >
          {splittedWords.length - 1 === index ? (
            <InlineText
              css={css({
                display: 'flex',
                position: 'relative',
                flexWrap: 'wrap',
              })}
            >
              {word}
              <IconContainer>{icon}</IconContainer>
            </InlineText>
          ) : (
            `${word} `
          )}
        </InlineText>
      ))}
    </>
  );
}

const OrderedList = styled.ol(
  css({
    display: 'flex',
    flexWrap: 'wrap',
    p: 0,
    m: 0,
    listStyle: 'none',
  })
);

const ListItem = styled.li(
  css({
    mb: 2,
    pr: 4,
    flexGrow: 1,
    width: asResponsiveArray({ _: '100%', md: '50%' }),

    // Remove the margin of the last 2 elements
    '&:nth-last-of-type(-n+2)': {
      mb: asResponsiveArray({ md: 0 }),
    },

    '&:last-of-type': {
      mb: 0,
    },

    a: {
      display: 'inline-flex',
      flexWrap: 'wrap',
      textDecoration: 'none',

      '&:hover': {
        textDecoration: 'underline',
      },
    },
  })
);

const IconContainer = styled.div(
  css({
    position: 'absolute',
    right: -25,
    top: 0,

    svg: {
      width: 24,
      height: 24,
    },
  })
);
