import css from '@styled-system/css';
import styled from 'styled-components';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { HoveredPoint } from '../logic';

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

interface DateMarkerProps {
  point: HoveredPoint;
}

export function DateMarker({ point }: DateMarkerProps) {
  return (
    <LabelContainer
      style={{
        left: point.x,
      }}
    >
      <Label>{formatDateFromSeconds(point.value.__date_unix, 'axis')}</Label>
    </LabelContainer>
  );
}
