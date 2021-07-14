import css from '@styled-system/css';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import { useIntl } from '~/intl';
import { VisuallyHidden } from './visually-hidden';

interface Option<T extends string> {
  value: T;
  label: string;
}

export type SelectProps<T extends string> = {
  options: Option<T>[];
  value: string | undefined;
  onChange: (value: T) => void;
  onClear?: () => void;
  placeholder?: string;
  icon?: React.ReactNode;
};

export function Select<T extends string>({
  value,
  onChange,
  onClear,
  options,
  placeholder,
  icon,
}: SelectProps<T>) {
  const { siteText } = useIntl();

  const hasIcon = isDefined(icon);

  return (
    <Container>
      <StyledSelect
        value={value || ''}
        onChange={(event) => onChange((event.target.value || undefined) as T)}
        isClearable={!!onClear}
        hasIcon={hasIcon}
      >
        {placeholder && (
          <option value="" disabled={!value}>
            {placeholder}
          </option>
        )}
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </StyledSelect>

      {onClear && value && (
        <ClearButton
          onClick={() => onClear && onClear()}
          title={siteText.common.clear_select_input}
        >
          <VisuallyHidden>{siteText.common.clear_select_input}</VisuallyHidden>
        </ClearButton>
      )}

      {isDefined(icon) && <Icon>{icon}</Icon>}
    </Container>
  );
}

const Container = styled.div(css({ position: 'relative', maxWidth: '100%' }));

const Icon = styled.span(
  css({
    pointerEvents: 'none',
    position: 'absolute',
    left: 0,
    top: 0,
    svg: {
      width: 25,
      height: 25,
      my: 1,
      ml: 2,
    },
  })
);

const ClearButton = styled.button(
  css({
    width: 32,
    height: '100%',
    border: '1px solid lightGray',
    padding: 2,
    textAlign: 'left',
    backgroundColor: 'white',
    backgroundImage: `url('/images/close.svg')`,
    backgroundSize: '24px 24px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    position: 'absolute',
    right: 0,
    top: 0,
    cursor: 'pointer',
  })
);

const StyledSelect = styled.select<{ isClearable: boolean; hasIcon: boolean }>(
  (x) =>
    css({
      display: 'block',
      minWidth: '15em',
      maxWidth: '100%',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'lightGray',
      fontFamily: 'body',
      fontSize: 2,
      appearance: 'none',
      p: 2,
      pr: x.isClearable ? '2.4rem' : '2rem',
      pl: x.hasIcon ? '2.4rem' : '0.5rem',
      background: `url('/images/chevron-down.svg')`,
      backgroundSize: '14px 14px',
      backgroundRepeat: 'no-repeat, repeat',
      backgroundPosition: 'right 0.5em top 60%, 0 0',
      '&:focus': {
        borderColor: 'lightGray',
        outline: '2px dotted',
        outlineColor: 'blue',
      },
      '&::-ms-expand': {
        display: 'none',
      },
    })
);
