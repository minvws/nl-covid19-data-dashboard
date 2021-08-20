import css from '@styled-system/css';
import { ComponentType, ReactNode } from 'react';
import { Information } from '@corona-dashboard/icons';
import { Box } from './base';
import { WarningTile } from './warning-tile';

interface InformationTileProps {
  message: ReactNode;
  icon?: ComponentType;
  isFullWidth?: boolean;
}

export function InformationTile({
  message,
  icon = Information,
  isFullWidth = true,
}: InformationTileProps) {
  const Icon = icon;
  return (
    <Box css={css({ boxShadow: 'tile' })}>
      <WarningTile message={message} isFullWidth={isFullWidth} icon={Icon} />
    </Box>
  );
}
