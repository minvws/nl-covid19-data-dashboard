import css from '@styled-system/css';
import styled from 'styled-components';
import text from '~/locale/index';

export function Logo() {
  return (
    <LogoWrapper>
      <LogoImage
        src="/images/logo-ro.svg"
        alt={text.header.logo_alt}
        width={314}
        height={125}
        css={css({ display: ['none', 'block'] })}
      />
      <LogoImage
        src="/images/logo-ro-small.svg"
        alt={text.header.logo_alt}
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
