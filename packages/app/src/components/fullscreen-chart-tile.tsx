import { colors } from '@corona-dashboard/common';
import { Close, Expand } from '@corona-dashboard/icons';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Tile } from '~/components/tile';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { usePrevious } from '~/utils/use-previous';
import { Spacer } from './base';
import { Box } from './base/box';
import { IconButton } from './icon-button';
import { Metadata, MetadataProps } from './metadata';
import { Modal } from './modal';

interface FullscreenChartTileProps {
  children: React.ReactNode;
  disabled?: boolean;
  id?: string;
  metadata?: MetadataProps;
  disableBorder?: boolean;
}

export const FullscreenChartTile = ({ children, disabled, id, metadata, disableBorder }: FullscreenChartTileProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const wasFullscreen = usePrevious(isFullscreen);
  const breakpoints = useBreakpoints();
  const { commonTexts } = useIntl();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (wasFullscreen && !isFullscreen) {
      buttonRef.current?.focus();
    }
  }, [wasFullscreen, isFullscreen]);

  const label = replaceVariablesInText(isFullscreen ? commonTexts.common.modal_close : commonTexts.common.modal_open, { subject: commonTexts.common.grafiek_singular });

  const tile = (
    <Tile hasNoBorder={isFullscreen || disableBorder} height="100%" id={id}>
      <Box
        paddingX={isFullscreen ? { _: space[3], sm: space[4] } : undefined}
        paddingY={isFullscreen ? { _: space[2], sm: space[3] } : undefined}
        height="100%"
        display="flex"
        flexDirection="column"
      >
        {children}

        {metadata && (
          <>
            <Spacer margin="auto" />
            <Metadata {...metadata} isTileFooter />
          </>
        )}

        {!disabled && breakpoints.md && (
          <StyledModalCloseButtonWrapper isFullscreen={isFullscreen}>
            <IconButton ref={isFullscreen ? undefined : buttonRef} title={label} onClick={() => setIsFullscreen((previousValue) => !previousValue)} size={16}>
              {isFullscreen ? <Close /> : <Expand />}
            </IconButton>
          </StyledModalCloseButtonWrapper>
        )}
      </Box>
    </Tile>
  );

  if (!disabled && breakpoints.md && isFullscreen) {
    return (
      <Modal id="chart-tile-container" onClose={() => setIsFullscreen(false)} isFullheight>
        {tile}
      </Modal>
    );
  }

  return <div>{tile}</div>;
};

interface StyledModalCloseButtonWrapperProps {
  isFullscreen: boolean;
}

const StyledModalCloseButtonWrapper = styled.div<StyledModalCloseButtonWrapperProps>`
  color: ${colors.gray3};
  position: absolute;
  right: ${({ isFullscreen }) => (isFullscreen ? '25px' : '0')};
  top: 25px;

  &:focus {
    outline: 1px dashed ${colors.blue8};
  }

  &:hover {
    color: ${colors.gray5};
  }
`;
