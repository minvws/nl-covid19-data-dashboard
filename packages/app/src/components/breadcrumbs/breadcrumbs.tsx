import { useBreadcrumbs } from './logic/use-breadcrumbs';
import { Link } from '~/utils/link';
import css from '@styled-system/css';
import { Box } from '../base';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { MaxWidth } from '../max-width';
import { Anchor } from '../typography';

export function Breadcrumbs() {
  const breadcrumbs = useBreadcrumbs();
  const { siteText } = useIntl();

  return (
    <Box
      css={css({
        borderBottom: `1px solid ${colors.border}`,
        position: 'absolute',
        top: -9999,
        left: -9999,
        '&:focus-within': {
          position: 'static',
        },
      })}
    >
      <MaxWidth
        css={css({
          py: 3,
          px: 4,
        })}
        as={'nav'}
        aria-label={siteText.breadcrumbs.label}
      >
        <ol vocab="http://schema.org/" typeof="BreadcrumbList">
          {breadcrumbs.map(({ title, href }, index) => (
            <li
              key={href}
              css={css({
                display: 'inline-block',
                '&::after': { content: '">"', mx: 2 },
                '&:last-of-type': { '&::after': { content: '""' } },
              })}
              property="itemListElement"
              typeof="ListItem"
            >
              <Link href={href} passHref>
                <Anchor
                  underline="hover"
                  property="item"
                  typeof="WebPage"
                  css={css({ outlineOffset: 2 })}
                >
                  <span property="name">{title}</span>
                </Anchor>
              </Link>
              <meta property="position" content={`${index + 1}`} />
            </li>
          ))}
        </ol>
      </MaxWidth>
    </Box>
  );
}
