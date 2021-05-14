import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import { InlineIndicator } from './components/inline-indicator';
import { SidebarIndicator } from './components/sidebar-indicator';

import { TileIndicator } from './components/tile-indicator';

interface DifferenceIndicatorProps {
  value: DifferenceDecimal | DifferenceInteger;
  isDecimal?: boolean;
  context?: 'sidebar' | 'tile' | 'inline';
  maximumFractionDigits?: number;
  staticTimespan?: string;
}

export function DifferenceIndicator(props: DifferenceIndicatorProps) {
  switch (props.context) {
    case 'sidebar':
      return <SidebarIndicator {...props} />;

    case 'inline':
      return <InlineIndicator {...props} />;

    default:
      return <TileIndicator {...props} />;
  }
}
