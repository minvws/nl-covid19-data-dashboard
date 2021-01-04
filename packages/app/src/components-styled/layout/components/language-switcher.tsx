import css from '@styled-system/css';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';
import { getLocale } from '~/utils/getLocale';
import { LinkRadialLine } from '@visx/shape';

export function LanguageSwitcher() {
  const router = useRouter();

  const { locale: routerLocale } = router;

  const locale = getLocale();

  if (process.env.NEXT_PUBLIC_IS_PREVIEW_SERVER) {
    console.log(router.asPath, routerLocale);

    return (
      <Box height={55} mt={-55} textAlign="right">
        <Link href={router.asPath} locale="nl" passHref>
          <LanguageLink
            isActive={routerLocale === 'nl'}
            title="Website in het Nederlands"
          >
            NL
          </LanguageLink>
        </Link>
        <span aria-hidden="true">|</span>
        <Link href={router.asPath} locale="en-GB" passHref>
          <LanguageLink
            isActive={routerLocale === 'en-GB'}
            title="Website in English"
          >
            EN
          </LanguageLink>
        </Link>
      </Box>
    );
  }

  return (
    <Box height={55} mt={-55} textAlign="right">
      <LanguageLink
        href={`https://coronadashboard.rijksoverheid.nl${router.asPath}`}
        lang="nl"
        hrefLang="nl"
        isActive={locale === 'nl'}
        title="Website in het Nederlands"
      >
        NL
      </LanguageLink>
      <span aria-hidden="true">|</span>
      <LanguageLink
        href={`https://coronadashboard.government.nl${router.asPath}`}
        lang="en-GB"
        hrefLang="en-GB"
        isActive={locale === 'en-GB'}
        title="Website in English"
      >
        EN
      </LanguageLink>
    </Box>
  );
}

const LanguageLink = styled.a<{ isActive: boolean }>((x) =>
  css({
    borderBottom: '2px solid',
    borderBottomColor: x.isActive ? 'button' : 'transparent',
    color: 'inherit',
    display: 'inline-block',
    mx: 1,
    textAlign: 'center',
    textDecoration: 'none',
    minWidth: 24,

    fontWeight: x.isActive ? 'heavy' : 'normal',

    '&:hover, &:focus': {
      borderBottomColor: 'button',
    },
  })
);
