import css from '@styled-system/css';
import styled from 'styled-components';
import ChevronLargeIcon from '~/assets/chevron-large.svg';
import ExternalLinkIcon from '~/assets/external-link-2.svg';
import { Box } from '~/components/base';
import { ExternalLink } from '~/components/external-link';
import { Anchor, InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { spacingStyle } from '~/style/functions/spacing';
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
      <Text fontWeight="bold">{siteText.informatie_header.handige_links}</Text>
      <OrderedList>
        {links.map((link, index) => (
          <ListItem key={index}>
            {isAbsoluteUrl(link.href) ? (
              <ExternalLink href={link.href} underline="hover">
                <TitleWithIcon title={link.title} icon={<ExternalLinkIcon />} />
              </ExternalLink>
            ) : (
              <Link href={link.href} passHref>
                <Anchor underline="hover">
                  <TitleWithIcon
                    title={link.title}
                    icon={<ChevronLargeIcon />}
                  />
                </Anchor>
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
    <InlineText>
      {titleWithoutLastWord}{' '}
      <Box display="inline-flex" position="relative">
        <InlineText>
          {lastWord}
          <IconContainer>{icon}</IconContainer>
        </InlineText>
      </Box>
    </InlineText>
  );
}

const OrderedList = styled.ol(
  css({
    listStyle: 'none',
    display: 'flex',
    flexWrap: 'wrap',
    ...spacingStyle(2),
  })
);

const ListItem = styled.li(
  css({
    width: asResponsiveArray({ _: '100%', md: '50%' }),
    pr: 4,
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
