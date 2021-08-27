import css from '@styled-system/css';
import { isPresent } from 'ts-is-present';
import { Arrow as ArrowIcon } from '@corona-dashboard/icons';
import { Box } from '../base';
import { InlineText, Text } from '../typography';
import { VisuallyHidden } from '../visually-hidden';
import { ListBox, ListBoxOption, SelectBox, SelectBoxRoot } from './components';
import { useRichContentSelect } from './logic/use-select';
import { Option } from './types';
import { Unpack } from '@corona-dashboard/common';

type RichContentSelectProps<T extends string> = {
  initialValue?: Unpack<T>;
  label: string;
  onChange: (option: Option<T>) => void;
  options: Option<T>[];
  visuallyHiddenLabel?: boolean;
};

/**
 * The RichContentSelect component works just like a native <select /> element.
 * However, you can optionally render rich content for the selected option.
 *
 * Implementation adapted from:
 * https://w3c.github.io/aria-practices/examples/combobox/combobox-select-only.html
 */
export function RichContentSelect<T extends string>(
  props: RichContentSelectProps<T>
) {
  const { label, options, onChange, initialValue, visuallyHiddenLabel } = props;

  const {
    labelId,
    selectedOption,
    getComboboxProps,
    getListBoxProps,
    getListBoxOptionsProps,
  } = useRichContentSelect(options, onChange, initialValue);

  return (
    <Box css={css({ pb: 3 })}>
      {visuallyHiddenLabel ? (
        <VisuallyHidden as="label" id={labelId}>
          {typeof label === 'string' ? <InlineText>{label}</InlineText> : label}
        </VisuallyHidden>
      ) : (
        <label
          id={labelId}
          css={css({
            display: 'block',
            fontWeight: 'bold',
            mb: 2,
          })}
        >
          <InlineText>{label}</InlineText>
        </label>
      )}

      <SelectBoxRoot>
        <SelectBox {...getComboboxProps()}>
          {isPresent(selectedOption) && (
            <>
              {selectedOption?.content ? (
                selectedOption.content
              ) : (
                <Text>{selectedOption?.label}</Text>
              )}
            </>
          )}
          <ArrowIcon
            css={css({ color: 'blue', width: '1.5rem' })}
            aria-hidden="true"
          />
        </SelectBox>

        <ListBox {...getListBoxProps()}>
          {options &&
            options.map((option, index) => (
              <ListBoxOption
                key={option.value}
                {...getListBoxOptionsProps(index)}
              >
                {option.label}
              </ListBoxOption>
            ))}
        </ListBox>
      </SelectBoxRoot>
    </Box>
  );
}
