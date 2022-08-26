import { Box } from '~/components/base';
import css from '@styled-system/css';
import styled from 'styled-components';
import { ChevronRight } from '@corona-dashboard/icons';
import { colors } from '@corona-dashboard/common';
import { Text } from '~/components/typography';

type TextWithChevronProps = {
  label: string;
};

export const TextWithChevron = ({ label }: TextWithChevronProps) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg={colors.lightBlue}
      color={colors.blue}
      padding={3}
      className="topical-tile-cta"
      css={css({
        transition: 'background .1s ease-in-out',
      })}
    >
      <Text>{label}</Text>
      <IconSmall>
        <ChevronRight />
      </IconSmall>
    </Box>
  );
}

const IconSmall = styled.div(
  css({
    display: 'inline',
    textDecoration: 'inherit',
    svg: {
      width: 11,
      height: 10,
    },
    marginLeft: 1,
  })
);
