import css from '@styled-system/css';
import styled from 'styled-components';
import { TimestampedValue } from '@corona-dashboard/common';
import { useIntl } from '~/intl';
import { HoveredPoint } from '../logic';

interface DateMarkerProps<T extends TimestampedValue> {
  point: HoveredPoint<T>;
}

export function DateMarker<T extends TimestampedValue>({
  point,
}: DateMarkerProps<T>) {
  const { formatDateFromSeconds } = useIntl();

  return (
    <LabelContainer
      style={{
        left: point.x,
      }}
    >
      <Label>
        {formatDateFromSeconds(point.seriesValue.__date_unix, 'axis')}
      </Label>
    </LabelContainer>
  );
}

const LabelContainer = styled.div({
  position: 'absolute',
  pointerEvents: 'none',
  top: '100%',

  display: 'flex',
  justifyContent: 'center',
  marginTop: '7px',
  transform: 'translate(-50%, 0)',
  width: 100,
});

const Label = styled.span(
  css({
    backgroundColor: 'white',
    px: '0.5em',
    fontSize: 12,
    fontWeight: 'bold',
  })
);
