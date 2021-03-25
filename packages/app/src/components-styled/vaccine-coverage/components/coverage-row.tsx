import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';

type CoverageRowProps = {
  children: [ReactNode, ReactNode, ReactNode];
  hideBorder?: boolean;
};

export function CoverageRow(props: CoverageRowProps) {
  const { children, hideBorder = false } = props;
  return (
    <Row hideBorder={hideBorder}>
      <Box flex="0.4">{children[0]}</Box>
      <Box
        flex="0.4"
        justifyContent="center"
        display="flex"
        alignContent="center"
      >
        {children[1]}
      </Box>
      <Box flex="1" display={{ _: 'none', lg: 'block' }}>
        {children[2]}
      </Box>
    </Row>
  );
}

const Row = styled(Box)<{ hideBorder: boolean }>(({ hideBorder }) => {
  const cssProps = hideBorder
    ? { display: 'flex', alignContent: 'center' }
    : {
        display: 'flex',
        justifyContent: 'stretch',
        borderBottomColor: 'border',
        borderBottomStyle: 'solid',
        borderBottomWidth: '1px',
        pb: 3,
        mb: 4,
      };
  return css(cssProps as any);
});
