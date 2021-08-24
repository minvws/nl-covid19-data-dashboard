import css from '@styled-system/css';
import { ReactComponent as VaccinatieIcon } from '~/assets/vaccinaties.svg';
import { Box } from '~/components/base';
import { Heading } from '~/components/typography';

interface VaccineHeaderWithIcon {
  title: string;
}

export function VaccineHeaderWithIcon({ title }: VaccineHeaderWithIcon) {
  return (
    <Box
      display="flex"
      flexDirection={{ _: 'column', md: 'row' }}
      flexWrap="nowrap"
      alignItems={{ _: 'flex-start', md: 'center' }}
    >
      <Box
        flex="0 0 4rem"
        display="flex"
        justifyContent="center"
        padding={0}
        margin={0}
        mt="-0.6rem"
        css={css({
          svg: {
            height: '3.5rem',
          },
        })}
      >
        <VaccinatieIcon />
      </Box>
      <Heading level={1} hyphens="auto">
        {title}
      </Heading>
    </Box>
  );
}
