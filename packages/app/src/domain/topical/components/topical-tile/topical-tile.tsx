import { Box } from '~/components/base';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Heading } from '~/components/typography';
import { LinkWithIcon } from '~/components/link-with-icon';
import { asResponsiveArray } from '~/style/utils';
import { colors } from '@corona-dashboard/common';
import {
  Chevron,
  Down,
  Up,
  Doorstroomevenementen,
} from '@corona-dashboard/icons';
import { Markdown } from '~/components/markdown';

interface IconWrapperProps {
  iconColor: any;
}

interface TopicalTileProps {
  direction: string;
}

export function TopicalTile({ direction }: TopicalTileProps) {
  return (
    <Box
      spacing={3}
      borderColor={colors.gray}
      borderWidth="1px"
      borderStyle="solid"
      position="relative"
      display="flex"
      flexDirection={'column'}
      justifyContent={'space-between'}
    >
      <Box
        display="flex"
        flexDirection={'column'}
        justifyContent={'start'}
        textAlign={'left'}
        p={{ _: 3, xs: 4 }}
      >
        <KpiIcon>
          <Doorstroomevenementen />
        </KpiIcon>

        <Box
          display="block"
          fontSize={{ _: 6, xs: 7 }}
          paddingRight={5}
          marginBottom={3}
        >
          <Heading level={3} color={colors.blue}>
            {'Postieve testen'}
            <IconWrapper iconColor={'#f35065'}>
              {direction === 'DOWN' && <Down />}
              {direction === 'UP' && <Up />}
            </IconWrapper>
          </Heading>
        </Box>

        <Box display="flex" alignItems={'center'}>
          <Markdown
            content={
              'Het aantal positief geteste mensen is de **afgelopen week 10% gestegen**. Hiermee zet de stijgende trend zich voort.'
            }
          />
        </Box>
      </Box>

      <Box
        display="flex"
        justifyContent={'center'}
        bg={colors.lightBlue}
        color={colors.blue}
        padding={3}
      >
        <LinkWithIcon href={'#'} icon={<Chevron />} iconPlacement="right">
          {'Lees meer'}
        </LinkWithIcon>
      </Box>
    </Box>
  );
}

const IconWrapper = styled.span<IconWrapperProps>((x) =>
  css({
    color: x.iconColor,
    display: 'inline-block',
    height: '20px',
    marginLeft: '15px;',
  })
);

const KpiIcon = styled.span(
  css({
    color: colors.white,
    backgroundColor: colors.blue,
    position: 'absolute',
    display: 'block',
    width: asResponsiveArray({ _: 40, sm: 50 }),
    right: 0,
    top: 0,
  })
);
