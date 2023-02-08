import { colors } from '@corona-dashboard/common';
import { Fragment } from 'react';
import styled from 'styled-components';
import { mediaQueries, radii, space } from '~/style/theme';
import { useUniqueId } from '~/utils/use-unique-id';
import { Box } from './base';
import { InlineText } from './typography';

export interface RadioGroupItem<T extends string> {
  label: string;
  value: T;
  ariaLabel?: string;
}

interface RadioGroupProps<T extends string> {
  onChange: (value: T) => void;
  value: T;
  items: RadioGroupItem<T>[];
}

/**
 * A radiogroup component that takes an array of radiogroup items and
 * reports its changes using the given onSelect callback.
 */
export const RadioGroup = <T extends string>(props: RadioGroupProps<T>) => {
  const { onChange, items, value } = props;
  const id = useUniqueId();

  return (
    <Box backgroundColor={colors.white} display="flex" justifyContent="center" data-cy="radiogroup">
      {items.map((item, index) => (
        <Fragment key={`radiogroup-${id}-input-${index}`}>
          <Input
            onChange={() => onChange(item.value)}
            id={`radiogroup-${item.value}-${id}-${index}`}
            type="radio"
            name={`radiogroup-${id}-item`}
            value={item.value}
            checked={value === item.value}
            aria-label={value === item.value ? item.ariaLabel : undefined}
          />
          <Label htmlFor={`radiogroup-${item.value}-${id}-${index}`}>
            <InlineText variant="button2">{item.label}</InlineText>
          </Label>
        </Fragment>
      ))}
    </Box>
  );
};

const Label = styled.label`
  border: 1px solid ${colors.gray3};
  color: ${colors.blue8};
  cursor: pointer;
  flex: 0 1 auto;
  padding: ${space[1]} ${space[2]};
  text-align: center;
  user-select: none;

  &:first-of-type {
    border-radius: ${radii[1]}px 0 0 ${radii[1]}px;
    border-right-width: 0;
  }

  &:last-of-type {
    border-left-width: 0;
    border-radius: 0 ${radii[1]}px ${radii[1]}px 0;
  }

  &:focus,
  &:hover {
    background: ${colors.gray1};
    border-color: ${colors.blue8};
    color: ${colors.blue8};
  }

  @media ${mediaQueries.xs} {
    padding: 0.3rem ${space[3]};
  }
`;

const Input = styled.input`
  clip: rect(0, 0, 0, 0);
  position: absolute;

  &:checked + ${Label} {
    background: ${colors.blue8};
    border-color: ${colors.blue8};
    color: ${colors.white};
  }

  &:focus-visible + ${Label} {
    outline: 2px dotted ${colors.magenta3};
  }
`;
