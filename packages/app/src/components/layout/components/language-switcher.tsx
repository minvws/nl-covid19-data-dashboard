import css from '@styled-system/css';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { Anchor } from '~/components/typography';

export function LanguageSwitcher() {
  const router = useRouter();
  const { locale = 'nl' } = router;

  const [currentPath] = router.asPath.split('?');

  return (
    <Box height={55} mt={-55} textAlign="right" position="absolute" right={3}>
      <LanguageLink
        href={`https://coronadashboard.rijksoverheid.nl${currentPath}`}
        lang="nl"
        hrefLang="nl"
        isActive={locale === 'nl'}
        title="Website in het Nederlands"
      >
        NL
      </LanguageLink>

      <Separator aria-hidden="true" />

      <LanguageLink
        href={`https://coronadashboard.government.nl${currentPath}`}
        lang="en-GB"
        hrefLang="en-GB"
        isActive={locale?.startsWith('en') ?? false}
        title="Website in English"
      >
        EN
      </LanguageLink>
    </Box>
  );
}
const Separator = styled.span(
  css({
    mx: 2,
    display: 'inline-block',

    '&:after': {
      content: '"|"',
    },
  })
);

const LanguageLink = styled(Anchor)<{ isActive: boolean }>((x) =>
  css({
    borderBottom: '2px solid',
    borderBottomColor: x.isActive ? 'button' : 'transparent',
    color: 'inherit',
    display: 'inline-block',
    textAlign: 'center',
    textDecoration: 'none',

    fontWeight: x.isActive ? 'heavy' : 'normal',

    '&:hover, &:focus': {
      borderBottomColor: 'button',
    },
  })
);
