import css from '@styled-system/css';
import { useRouter } from 'next/router';
import { Link } from '~/utils/link';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';

export function LanguageSwitcher() {
  const router = useRouter();

  const { locale } = router;

  return (
    <Box height={55} mt={-55} textAlign="right">
      <Link href={`${router.asPath}`} locale="nl" passHref>
        <LanguageLink
          isActive={locale === 'nl'}
          title="Website in het Nederlands"
        >
          NL
        </LanguageLink>
      </Link>

      <Separator />

      <Link href={`${router.asPath}`} locale="en" passHref>
        <LanguageLink isActive={locale === 'en'} title="Website in English">
          EN
        </LanguageLink>
      </Link>
    </Box>
  );
}
const Separator = styled.span.attrs({ 'aria-hidden': 'true', children: '|' })(
  css({
    mx: 2,
    display: 'inline-block',
  })
);

const LanguageLink = styled.a<{ isActive: boolean }>((x) =>
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
