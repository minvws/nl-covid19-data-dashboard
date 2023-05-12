import { Unpack } from '@corona-dashboard/common';
import { Arrow as ArrowIcon } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import { isPresent } from 'ts-is-present';
import { Box } from '../base';
import { InlineText, Text } from '../typography';
import { VisuallyHidden } from '../visually-hidden';
import { ListBox, ListBoxOption, SelectBox, SelectBoxRoot } from './components';
import { useRichContentSelect } from './logic/use-select';
import { Option } from './types';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';

type RichContentSelectProps<T extends string> = {
  initialValue?: Unpack<T>;
  label: string;
  onChange: (option: Option<T>) => void;
  options: Option<T>[];
  visuallyHiddenLabel?: boolean;
  useContentForSelectedOption?: boolean;
};

/**
 * The RichContentSelect component works just like a native <select /> element.
 * However, you can optionally render rich content for the selected option.
 *
 * Implementation adapted from:
 * https://w3c.github.io/aria-practices/examples/combobox/combobox-select-only.html
 */
export const RichContentSelect = <T extends string>(props: RichContentSelectProps<T>) => {
  const { label, options, onChange, initialValue, visuallyHiddenLabel, useContentForSelectedOption: richContentForSelectedValue, ...rest } = props;

  const { labelId, selectedOption, getComboboxProps, getListBoxProps, getListBoxOptionsProps } = useRichContentSelect(options, onChange, initialValue);

  const { commonTexts } = useIntl();

  const { containerRef, ...selectBoxProps } = getComboboxProps();

  const selectedOptionView = isPresent(selectedOption) && (richContentForSelectedValue ? selectedOption?.content : <Text>{selectedOption.label}</Text>);

  return (
    <Box ref={containerRef} {...rest}>
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
            marginBottom: space[2],
          })}
        >
          <InlineText>{label}</InlineText>
        </label>
      )}

      <SelectBoxRoot>
        <SelectBox {...selectBoxProps}>
          {selectedOptionView}
          <ArrowIcon
            css={css({
              color: 'blue8',
              width: '1rem',
              '&[aria-expanded="true"]': {
                transform: 'rotate(180deg)',
              },
              marginLeft: space[2],
            })}
            aria-hidden={true}
            aria-expanded={getComboboxProps()['aria-expanded']}
          />
        </SelectBox>

        <ListBox {...getListBoxProps()}>
          {options &&
            options.map((option, index) => (
              <ListBoxOption key={option.value} {...getListBoxOptionsProps(index)}>
                <VisuallyHidden>
                  {
                    <InlineText>
                      {replaceVariablesInText(commonTexts.aria_labels.map_select_label, {
                        label: option.label,
                      })}
                    </InlineText>
                  }
                </VisuallyHidden>
                <Box aria-hidden={true}>{option.content}</Box>
              </ListBoxOption>
            ))}
        </ListBox>
      </SelectBoxRoot>
    </Box>
  );
};
