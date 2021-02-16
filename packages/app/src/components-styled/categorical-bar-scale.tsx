import css from '@styled-system/css';
import { Box } from './base';
import { InlineText } from './typography';

interface CategoricalBarScaleProps {
  value: number;
  categories: CategoricalBarScaleCategory[];
}

export interface CategoricalBarScaleCategory {
  threshold: number;
  name?: string;
  color?: string;
}

export function getCategory(
  categories: CategoricalBarScaleCategory[],
  value: number
) {
  const level = categories.findIndex((category) => category.threshold > value);
  return level === -1 ? 4 : level;
}

export function CategoricalBarScale({
  value,
  categories,
}: CategoricalBarScaleProps) {
  const maxValue = categories.reduce((maxValue, category) => {
    return Math.max(category.threshold, maxValue);
  }, value);

  const barPieces = categories
    .filter((x) => x.name !== undefined)
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
            key={`bar-${category.name}`}
            height={12}
            bg={category.color}
            width={`${(category.width / maxValue) * 100}%`}
            position="relative"
            borderTopLeftRadius={index === 0 ? '3px' : 0}
            borderBottomLeftRadius={index === 0 ? '3px' : 0}
            borderTopRightRadius={category.isLast ? '3px' : 0}
            borderBottomRightRadius={category.isLast ? '3px' : 0}
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

      <Box>
        {barPieces.map((category) => (
          <>
            <Box
              display="inline-block"
              width="0.6rem"
              height="0.6rem"
              borderRadius="50%"
              bg={category.color}
            />
            <InlineText
              ml={1}
              mr={3}
              key={`legenda-${category.name}`}
              fontWeight={category.isActive ? 'bold' : 'normal'}
              fontSize={1}
            >
              {category.name}
            </InlineText>
          </>
        ))}
      </Box>
    </>
  );
}
