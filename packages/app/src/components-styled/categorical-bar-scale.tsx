import css from '@styled-system/css';
import { Fragment } from 'react';
import { isDefined } from 'ts-is-present';
import { EscalationLevel } from '~/domain/restrictions/type';
import { Box } from './base';
import { InlineText } from './typography';

const BAR_BORDER_RADIUS = '3px';

interface CategoricalBarScaleProps {
  value: number;
  categories: CategoricalBarScaleCategory[];
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
}: CategoricalBarScaleProps) {
  const maxValue = categories.reduce((maxValue, category) => {
    return Math.max(category.threshold, maxValue);
  }, value);

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
      <Box position="relative" width="100%" display="flex" my={4}>
        {barPieces.map((category, index) => (
          <Box
            key={category.name}
            height={12}
            bg={category.color}
            width={`${(category.width / maxValue) * 100}%`}
            position="relative"
            borderTopLeftRadius={index === 0 ? BAR_BORDER_RADIUS : 0}
            borderBottomLeftRadius={index === 0 ? BAR_BORDER_RADIUS : 0}
            borderTopRightRadius={category.isLast ? BAR_BORDER_RADIUS : 0}
            borderBottomRightRadius={category.isLast ? BAR_BORDER_RADIUS : 0}
          >
            <Box
              position="absolute"
              top="100%"
              left="0"
              fontSize={1}
              color="annotation"
              css={css({
                transform: 'translateX(-50%)',
              })}
            >
              {category.threshold}
            </Box>
          </Box>
        ))}
        <Box
          position="absolute"
          left={`${(value / maxValue) * 100}%`}
          top={-14}
          bg="black"
          width={7}
          height={26}
          css={css({
            transform: 'translateX(-50%)',
            outline: '1px solid white',
          })}
        />
      </Box>

      <Box mb={3}>
        {barPieces.map((category) => (
          <Fragment key={category.name}>
            {/* 0.25px offset is used for sharper rendering of the circle */}
            <Box
              display="inline-block"
              width="0.7rem"
              height="0.7rem"
              borderRadius="50%"
              bg={category.color}
              css={css({ transform: 'translateY(.25px)' })}
            />
            <InlineText
              ml={1}
              mr={3}
              fontWeight={category.isActive ? 'bold' : 'normal'}
              fontSize={1}
            >
              {category.name}
            </InlineText>
          </Fragment>
        ))}
      </Box>
    </>
  );
}
