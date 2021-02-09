import { Box } from './base';

interface CategoricalBarScaleProps {
  value: number;
  categories: CategoricalBarScaleCategory[];
}

interface CategoricalBarScaleCategory {
  name: string;
  from: number;
  to: number;
  color: string;
  baseRatio?: number;
}

export function CategoricalBarScale({
  value,
  categories,
}: CategoricalBarScaleProps) {
  const lastValue = categories[categories.length - 1];
  let newRatio = 1;
  if (value > lastValue.to) {
    const width = lastValue.to - lastValue.from;
    const difference = value - lastValue.to;
    newRatio = (difference / width) * (lastValue.baseRatio ?? 1);
  }

  return (
    <Box>
      {categories.map((category) => (
        <Box key={category.name}>
          {category.from} - {category.to} {newRatio}
        </Box>
      ))}
    </Box>
  );
}
