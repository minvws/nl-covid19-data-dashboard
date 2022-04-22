import css from '@styled-system/css';
import { Dispatch, RefObject, SetStateAction } from 'react';
import styled from 'styled-components';
import { Chevron } from '@corona-dashboard/icons';
import { Close } from '@corona-dashboard/icons';
import { Search } from '@corona-dashboard/icons';
import { Box } from '~/components/base';
import { VisuallyHidden } from '~/components/visually-hidden';
import { useIntl } from '~/intl';
import { Option } from './select-country';

interface SelectCountryInputType {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  currentOption: Option;
  isOpen: boolean;
  prefixId: string;
  inputRef: RefObject<HTMLInputElement>;
  handleOnClose: () => void;
  handleOnFocus: () => void;
  isMouseDown: boolean;
}

export function SelectCountryInput({
  inputValue,
  setInputValue,
  currentOption,
  isOpen,
  handleOnClose,
  prefixId,
  handleOnFocus,
  inputRef,
  isMouseDown,
}: SelectCountryInputType) {
  const { commonTexts } = useIntl();

  /**
   * A small timeout due the fact that otherwise the onClick event fires later than the onBlur.
   * Resulting that the click won't work without the timeout.
   */
  const handleOnBlur = () => {
    if (isMouseDown) return;
    setTimeout(() => {
      handleOnClose();
    }, 100);
  };

  return (
    <Box position="relative" minWidth="14rem">
      <IconContainer align="left">
        {isOpen ? (
          <Search />
        ) : (
          <img
            aria-hidden
            src={`/icons/flags/${currentOption.value.toLowerCase()}.svg`}
            width="17"
            height="13"
            alt=""
          />
        )}
      </IconContainer>

      <IconContainer align="right">
        {isOpen ? (
          inputValue.length > 0 && (
            <Box
              onClick={handleOnClose}
              css={css({
                display: 'flex',

                svg: {
                  width: 20,
                  height: 20,
                },
              })}
            >
              <VisuallyHidden>
                {commonTexts.select_countries.clear}
              </VisuallyHidden>
              <Close />
            </Box>
          )
        ) : (
          <Box
            as="span"
            transform="rotate(90deg)"
            transformOrigin="center"
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              event.stopPropagation();
              if (inputRef.current) inputRef.current.focus();
              setInputValue('');
            }}
            css={css({
              display: 'flex',

              svg: {
                width: 15,
                height: 15,
              },
            })}
          >
            <Chevron />
          </Box>
        )}
      </IconContainer>

      <Input
        placeholder={currentOption.label}
        value={isOpen ? inputValue : currentOption.label}
        onChange={(event) => setInputValue(event.target.value)}
        ref={inputRef}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        autoComplete="off"
        aria-haspopup="listbox"
        aria-labelledby={`${prefixId} ${prefixId}_button`}
        id={prefixId + '_button'}
      />
    </Box>
  );
}
const IconContainer = styled.span<{ align: 'left' | 'right' }>((x) =>
  css({
    position: 'absolute',
    top: 0,
    right: x.align === 'right' ? '10px' : undefined,
    bottom: 0,
    left: x.align === 'left' ? '10px' : undefined,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    m: 0,
    p: 0,
    height: '100%',
    border: 'none',

    background: 'none',
    color: x.align === 'left' ? 'labelGray' : 'icon',

    cursor: x.align === 'right' ? 'default' : undefined,
    pointerEvents: x.align === 'left' ? 'none' : undefined,
  })
);

const Input = styled.input(
  css({
    appearance: 'none',
    boxShadow: 'none',
    display: 'inline-block',

    width: '100%',
    border: `1px solid silver`,
    py: 2,
    pl: '2.25rem',
    m: 0,

    fontFamily: 'body',
    fontSize: 1,

    cursor: 'default',

    '&::-webkit-search-cancel-button': {
      display: 'none',
    },

    '&::-ms-clear': {
      display: 'none',
    },

    '&:focus': {
      borderColor: 'lightGray',
      outline: '2px dotted',
      outlineColor: 'body',
      cursor: 'text',
    },
  })
);
