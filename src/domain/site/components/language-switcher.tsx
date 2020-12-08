import css from '@styled-system/css';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';
import { getLocale } from '~/utils/getLocale';

export function LanguageSwitcher() {
  const router = useRouter();
  const locale = getLocale();

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
        isActive={locale === 'en'}
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
