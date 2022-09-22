import { Box } from '~/components/base';
import css from '@styled-system/css';
import styled from 'styled-components';
import { ChevronRight } from '@corona-dashboard/icons';
import { colors } from '@corona-dashboard/common';
import { Text } from '~/components/typography';
import { space } from '~/style/theme';

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
};

const IconSmall = styled.div`
  display: inline;
  text-decoration: inherit;
  margin-left: ${space[1]};
  svg {
    width: 11px;
    height: 10px;
  }
`;
