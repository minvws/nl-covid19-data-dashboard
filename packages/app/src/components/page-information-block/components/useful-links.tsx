import css from '@styled-system/css';
import styled from 'styled-components';
import ChevronLargeIcon from '~/assets/chevron-large.svg';
import ExternalLinkIcon from '~/assets/external-link-2.svg';
import { Box } from '~/components/base';
import { ExternalLink } from '~/components/external-link';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
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
  const { siteText } = useIntl();

  return (
    <Box spacing={2}>
      <InlineText
        fontSize={2}
        fontWeight="bold"
        css={css({ display: 'block' })}
      >
        {siteText.informatie_header.handige_links}
      </InlineText>
      <OrderedList>
        {links.map((link, index) => (
          <ListItem key={index}>
            {isAbsoluteUrl(link.href) ? (
              <ExternalLink href={link.href}>
                <TitleWithIcon title={link.title} icon={<ExternalLinkIcon />} />
              </ExternalLink>
            ) : (
              <Link href={link.href} passHref>
                <a>
                  <TitleWithIcon
                    title={link.title}
                    icon={<ChevronLargeIcon />}
                  />
                </a>
              </Link>
            )}
          </ListItem>
        ))}
      </OrderedList>
    </Box>
  );
}

function TitleWithIcon({ title, icon }: { title: string; icon?: JSX.Element }) {
  const [lastWord, ...splittedWords] = title.split(' ').reverse();
  const titleWithoutLastWord = splittedWords.reverse().join(' ');

  return (
    <InlineText fontFamily="body" fontSize="1rem">
      {titleWithoutLastWord}{' '}
      <InlineText display="inline-flex" position="relative">
        {lastWord}
        <IconContainer>{icon}</IconContainer>
      </InlineText>
    </InlineText>
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

const IconContainer = styled.span(
  css({
    position: 'absolute',
    right: -20,
    top: 0,

    svg: {
      width: 24,
      height: 24,
    },
  })
);
