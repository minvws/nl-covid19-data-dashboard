import css from '@styled-system/css';
import { useRef } from 'react';
import styled from 'styled-components';
import CloseIcon from '~/assets/close.svg';
import SearchIcon from '~/assets/search-icon-bold.svg';
import { Box } from '~/components/base';
import { VisuallyHidden } from '~/components/visually-hidden';
import { useIntl } from '~/intl';
import { useUniqueId } from '~/utils/use-unique-id';

interface searchInputProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeholderText: string;
}

export function SearchInput({
  value,
  setValue,
  placeholderText,
}: searchInputProps) {
  const { siteText } = useIntl();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchId = useUniqueId();

  return (
    <Box position="relative" width="15rem">
      <IconContainer align="left">
        <SearchIcon />
      </IconContainer>

      {value.length > 0 && (
        <IconContainer
          onClick={(evt: React.MouseEvent<HTMLElement>) => {
            evt.stopPropagation();
            inputRef.current?.blur();
            setValue('');
          }}
          as="button"
          align="right"
          css={css({
            borderWidth: 0,
            cursor: 'pointer',

            svg: {
              width: 20,
              height: 20,
            },
          })}
        >
          <VisuallyHidden>{siteText.search.clear}</VisuallyHidden>
          <CloseIcon />
        </IconContainer>
      )}

      <VisuallyHidden>
        <label htmlFor={`${searchId}-input`}>{placeholderText}</label>
      </VisuallyHidden>

      <StyledSearchInput
        ref={inputRef}
        type="search"
        id={`${searchId}-input`}
        placeholder={placeholderText}
        autoComplete="off"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Box>
  );
}

const StyledSearchInput = styled.input(
  css({
    display: 'block',

    width: '100%',
    border: `1px solid silver`,
    py: 2,
    pl: '36px',

    fontFamily: 'body',
    fontSize: 1,

    appearance: 'none',

    '&::-webkit-search-cancel-button': {
      display: 'none',
    },

    '&::-ms-clear': {
      display: 'none',
    },
  })
);

const IconContainer = styled.div<{ align: 'left' | 'right' }>((x) =>
  css({
    position: 'absolute',
    zIndex: 1,
    top: 0,
    right: x.align === 'right' ? '12px' : undefined,
    bottom: 0,
    left: x.align === 'left' ? '10px' : undefined,

    display: 'flex',
    alignItems: 'center',

    m: 0,
    p: 0,
    height: '100%',

    background: 'none',

    color: x.align === 'left' ? 'labelGray' : 'icon',
  })
);
