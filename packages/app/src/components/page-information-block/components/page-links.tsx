import { ChevronRight, External as ExternalIcon } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { ExternalLink } from '~/components/external-link';
import { Anchor, InlineText, BoldText } from '~/components/typography';
import { useIntl } from '~/intl';
import { spacingStyle } from '~/style/functions/spacing';
import { space } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
import { isInternalUrl } from '~/utils/is-internal-url';
import { Link } from '~/utils/link';

interface pageLinksProps {
  links: {
    title: string;
    href: string;
  }[];
}

export function PageLinks({ links }: pageLinksProps) {
  const { commonTexts } = useIntl();

  const combinedAriaLabel = (title: string) => `${commonTexts.informatie_header.external_link}. ${title}`;

  return (
    <Box spacing={2} paddingTop={space[3]}>
      <BoldText>{commonTexts.informatie_header.handige_links}</BoldText>
      <OrderedList>
        {links.map((link, index) => (
          <ListItem key={index}>
            {isInternalUrl(link.href) ? (
              <Link href={link.href} passHref>
                <Anchor underline="hover" ariaLabel={link.title}>
                  <TitleWithIcon title={link.title} icon={<ChevronRight />} />
                </Anchor>
              </Link>
            ) : (
              <ExternalLink href={link.href} underline="hover" ariaLabel={combinedAriaLabel(link.title)}>
                <TitleWithIcon title={link.title} icon={<ExternalIcon />} />
              </ExternalLink>
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
          <IconWrapper>{icon}</IconWrapper>
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
    width: asResponsiveArray({ _: '100%', md: `calc(50% - ${space[4]})` }),

    '&:nth-child(2n+1)': {
      marginRight: asResponsiveArray({ md: space[5] }),
    },
  })
);

const IconWrapper = styled.span(
  css({
    marginLeft: space[1],
    svg: {
      width: '11px',
      height: '11px',
    },
  })
);
