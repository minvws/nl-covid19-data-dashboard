import css from '@styled-system/css';
import styled from 'styled-components';
import { useIntl } from '~/intl';
import { Link } from '~/utils/link';
import logoRo from './logo-ro.svg';
import logoRoSmall from './logo-ro-small.svg';
import { Box } from '~/components/base';
import { asResponsiveArray } from '~/style/utils';

export function Logo() {
  const { commonTexts } = useIntl();

  return (
    <LogoWrapper>
      <Link href="/" passHref>
        <Box
          as="a"
          display="block"
          width={{ _: '40px', xs: '314px' }}
          height={{ _: '76px', xs: '125px' }}
          marginLeft={{ xs: '-50px' }}
          transform={{ xs: 'translateX(50%)' }}
          position="relative"
          css={css({
            /**
             * The logo has a bit of empty space on the right, with this clip path we're slicing
             * of that part so the user can only click on the logo.
             */
            clipPath: asResponsiveArray({
              xs: 'polygon(0 0, 155px 0, 155px 100%, 0% 100%)',
            }),
          })}
        >
          <LogoImage
            src={logoRo}
            alt={commonTexts.header.logo_alt}
            css={css({
              display: asResponsiveArray({ _: 'none', xs: 'block' }),
            })}
          />
          <LogoImage
            src={logoRoSmall}
            alt={commonTexts.header.logo_alt}
            css={css({
              display: asResponsiveArray({ _: 'block', xs: 'none' }),
            })}
          />
        </Box>
      </Link>
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
    width: '100%',
    height: '100%',
  })
);
