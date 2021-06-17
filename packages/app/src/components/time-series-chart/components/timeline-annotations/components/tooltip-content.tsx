import ChevronIcon from '~/assets/chevron.svg';
import { Box } from '~/components/base';
import { IconButton } from '~/components/icon-button';
import { TimelineAnnotationConfig } from '~/components/time-series-chart/logic';
import { InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';

interface TooltipContentProps {
  value: TimelineAnnotationConfig;
  onNext: () => void;
  onPrev: () => void;
}

export function TooltipContent({ value, onNext, onPrev }: TooltipContentProps) {
  const intl = useIntl();
  const isTouch = useIsTouchDevice();
  const date = Array.isArray(value.date)
    ? value.date.map((x) => intl.formatDateFromSeconds(x)).join(' - ')
    : intl.formatDateFromSeconds(value.date);

  return (
    <Box color="black" px={18} py={15} spacing={3}>
      {isTouch && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          ml={-2}
          mr={-2}
        >
          <ChevronButton onClick={onPrev} title="@TODO prev" rotate />
          <InlineText fontSize={1} color="labelGray">
            {date}
          </InlineText>
          <ChevronButton onClick={onNext} title="@TODO next" />
        </Box>
      )}
      <Box spacing={2}>
        {!isTouch && (
          <Text fontSize={1} color="labelGray">
            {date}
          </Text>
        )}

        <Text fontSize={1} fontWeight="bold">
          {value.title}
        </Text>
        <Text fontSize={1}>{value.description}</Text>
      </Box>
    </Box>
  );
}

function ChevronButton({
  onClick,
  title,
  rotate,
}: {
  onClick: () => void;
  title: string;
  rotate?: boolean;
}) {
  return (
    <Box
      color="blue"
      style={{ transform: rotate ? 'rotate(180deg)' : undefined }}
    >
      <IconButton title={title} onClick={onClick} size={13} padding={2}>
        <ChevronIcon />
      </IconButton>
    </Box>
  );
}
