import css from '@styled-system/css';
import styled from 'styled-components';
import { useIntl } from '~/intl';

import logoRo from './logo-ro.svg';
import logoRoSmall from './logo-ro-small.svg';

export function Logo() {
  const { siteText } = useIntl();

  return (
    <LogoWrapper>
      <LogoImage
        src={logoRo}
        alt={siteText.header.logo_alt}
        width={314}
        height={125}
        css={css({ display: ['none', 'block'] })}
      />
      <LogoImage
        src={logoRoSmall}
        alt={siteText.header.logo_alt}
        width={40}
        height={76}
        css={css({ display: ['block', 'none'] })}
      />
    </LogoWrapper>
  );
}

const LogoWrapper = styled.div(
  css({
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
    background: 'white',
    width: '100%',
  })
);

const LogoImage = styled.img(
  css({
    marginLeft: -50,
    transform: 'translateX(50%)',
  })
);
