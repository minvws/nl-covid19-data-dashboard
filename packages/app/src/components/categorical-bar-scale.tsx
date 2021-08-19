import css from '@styled-system/css';
import { Fragment } from 'react';
import { isDefined } from 'ts-is-present';
import { EscalationLevel } from '~/domain/restrictions/types';
import { Box } from './base';
import { InlineText } from './typography';

const BAR_BORDER_RADIUS = '2.5px';

interface CategoricalBarScaleProps {
  value: number;
  categories: CategoricalBarScaleCategory[];
  hideLegend?: boolean;
  hideNumbers?: boolean;
  maxValue?: number;
}

export interface CategoricalBarScaleCategory {
  threshold: number;
  name?: string;
  color?: string;
}

export function getCategoryLevel(
  categories: CategoricalBarScaleCategory[],
  value: number
): EscalationLevel {
  const level = categories.findIndex((category) => category.threshold > value);
  return level === -1 ? 4 : (level as EscalationLevel);
}

export function CategoricalBarScale({
  value,
  categories,
  hideLegend = false,
  hideNumbers = false,
  maxValue: givenMaxValue,
}: CategoricalBarScaleProps) {
  const maxValue = categories.reduce((maxValue, category) => {
    return Math.max(category.threshold, maxValue);
  }, givenMaxValue ?? value);

  const barPieces = categories
    .filter((x) => isDefined(x.name))
    .map((category, index, array) => {
      const isLast = array.length === index + 1;
      const to = isLast ? maxValue : array[index + 1].threshold;
      const width = to - category.threshold;
      const isActive =
        (category.threshold <= value && value < to) ||
        (isLast && value === maxValue);
      return { ...category, isLast, width, isActive };
    });

  return (
    <>
      <Box
        position="relative"
        width="100%"
        display="flex"
        mb={hideLegend ? undefined : 4}
      >
        {barPieces.map((category, index) => (
          <Box
            style={{ width: `${(category.width / maxValue) * 100}%` }}
            key={category.name}
            height={12}
            bg={category.color}
            position="relative"
            borderTopLeftRadius={index === 0 ? BAR_BORDER_RADIUS : 0}
            borderBottomLeftRadius={index === 0 ? BAR_BORDER_RADIUS : 0}
            borderTopRightRadius={category.isLast ? BAR_BORDER_RADIUS : 0}
            borderBottomRightRadius={category.isLast ? BAR_BORDER_RADIUS : 0}
          >
            {!hideNumbers && (
              <Box
                position="absolute"
                top="100%"
                left="0"
                transform="translateX(-50%)"
              >
                <InlineText variant="label1" color="annotation">
                  {category.threshold}
                </InlineText>
              </Box>
            )}
          </Box>
        ))}
        <Box
          position="absolute"
          left={`${(value / maxValue) * 100}%`}
          bottom={0}
          bg="black"
          width={7}
          height={26}
          transform="translateX(-50%)"
          css={css({
            outline: '1px solid white',
          })}
        />
      </Box>

      {!hideLegend && (
        <Box mb={3} spacingHorizontal={3}>
          {barPieces.map((category) => (
            <Box
              as="span"
              style={{ whiteSpace: 'nowrap' }}
              key={category.name}
              spacingHorizontal={1}
            >
              {/* 0.25px offset is used for sharper rendering of the circle */}
              <Box
                display="inline-block"
                width="0.7rem"
                height="0.7rem"
                borderRadius="50%"
                bg={category.color}
                transform="translateY(.25px)"
              />
              <InlineText
                fontWeight={category.isActive ? 'bold' : 'normal'}
                variant="label1"
              >
                {category.name}
              </InlineText>
            </Box>
          ))}
        </Box>
      )}
    </>
  );
}
