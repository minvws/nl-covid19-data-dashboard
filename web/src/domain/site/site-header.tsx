import css from '@styled-system/css';
import { Link } from '~/utils/link';
import React from 'react';
import { Box } from '~/components-styled/base';
import { MaxWidth } from '~/components-styled/max-width';
import text from '~/locale/index';
import { LanguageSwitcher } from './components/language-switcher';
import { Logo } from './components/logo';
import { TopNavigation } from './components/top-navigation';

export function SiteHeader() {
  return (
    <Box as="header" zIndex={4} position="relative" bg="white">
      <MaxWidth>
        <Logo />
        <LanguageSwitcher />
      </MaxWidth>
      <Box backgroundColor="header" py={4} color="white">
        <MaxWidth spacing={3}>
          <Box fontSize={5} lineHeight={0} fontWeight="bold">
            {text.header.title}
          </Box>
          <p css={css({ m: 0 })}>
            {text.header.text}{' '}
            <Link passHref href="/over">
              <a css={css({ color: 'white' })}>{text.header.link}</a>
            </Link>
          </p>
        </MaxWidth>
      </Box>
      <Box backgroundColor="#aa004b" color="white">
        <TopNavigation />
      </Box>
    </Box>
  );
}
