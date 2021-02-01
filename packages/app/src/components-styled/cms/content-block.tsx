import css from '@styled-system/css';
import { ComponentProps } from 'react';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';

export function ContentBlock(props: ComponentProps<typeof StyledContentBlock>) {
  return <StyledContentBlock {...props} />;
}

const StyledContentBlock = styled(Box)(
  css({
    mx: 'auto',
    maxWidth: 'contentWidth',
    px: 4,
    /** remove padding of nested ContentBlock instances */
    [`& &`]: { px: 0 },
  })
);
