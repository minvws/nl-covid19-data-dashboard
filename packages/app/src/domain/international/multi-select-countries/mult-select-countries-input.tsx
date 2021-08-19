import css from '@styled-system/css';
import { MouseEvent, useRef } from 'react';
import styled from 'styled-components';
import { ReactComponent as CloseIcon } from '~/assets/close.svg';
import { ReactComponent as SearchIcon } from '~/assets/search-icon-bold.svg';
import { Box } from '~/components/base';
import { VisuallyHidden } from '~/components/visually-hidden';
import { useIntl } from '~/intl';
import { useSearchContext } from './context';

export function MultiSelectCountriesInput() {
  const { siteText } = useIntl();
  const { id, inputProps, setTerm } = useSearchContext();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Box position="relative">
      <IconContainer align="left">
        <SearchIcon />
      </IconContainer>

      {inputProps.value && (
        <IconContainer
          as="button"
          align="right"
          onClick={(evt: MouseEvent) => {
            evt.stopPropagation();
            inputRef.current?.focus();
            setTerm('');
          }}
          css={css({
            svg: {
              width: 20,
              height: 20,
            },
          })}
        >
          <VisuallyHidden>{siteText.select_countries.clear}</VisuallyHidden>
          <CloseIcon />
        </IconContainer>
      )}

      <VisuallyHidden>
        <label htmlFor={`${id}-input`}>
          {siteText.select_countries.placeholder}
        </label>
      </VisuallyHidden>

      <StyledSearchInput
        ref={inputRef}
        type="search"
        id={`${id}-input`}
        placeholder={siteText.select_countries.placeholder}
        autoComplete="off"
        {...inputProps}
      />
    </Box>
  );
}

const StyledSearchInput = styled.input(
  css({
    display: 'inline-block',

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

    border: 'none',
  })
);
