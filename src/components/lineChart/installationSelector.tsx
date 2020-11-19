import css from '@styled-system/css';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';

type InstallationSelectorProps = {
  onChange: (value?: string) => void;
  stationNames: string[];
  placeholderText: string;
};

export const InstallationSelectorBox = styled(Box)(
  css({
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  })
);

const InstallationSelect = styled.select(
  css({
    minWidth: '15em',
    border: '1px solid lightGray',
    appearance: 'none',
    padding: 2,
    background: `url('/images/chevron-down.svg')`,
    backgroundSize: '14px 14px',
    backgroundRepeat: 'no-repeat, repeat',
    backgroundPosition: 'right 0.5em top 60%, 0 0',
    '&:focus': {
      borderColor: 'lightGray',
      outline: 0,
    },
    '&::-ms-expand': {
      display: 'none',
    },
  })
);

const InstallationButton = styled.button(
  css({
    minWidth: '15em',
    border: '1px solid lightGray',
    padding: 2,
    textAlign: 'left',
    backgroundColor: 'white',
    background: `url('/images/close.svg')`,
    backgroundSize: '24px 24px',
    backgroundRepeat: 'no-repeat, repeat',
    backgroundPosition: 'right 0.2em top 50%, 0 0',
  })
);

export function InstallationSelector(props: InstallationSelectorProps) {
  const { onChange, stationNames, placeholderText } = props;
  const [selected, setSelected] = useState<string | undefined>();

  if (selected) {
    return (
      <InstallationButton
        onClick={() => {
          setSelected(undefined);
          onChange(undefined);
        }}
      >
        {selected}
      </InstallationButton>
    );
  }

  return (
    <InstallationSelect
      defaultValue=""
      onChange={(event) => {
        setSelected(event.target.value);
        onChange(event.target.value);
      }}
    >
      <option value="" disabled>
        {placeholderText}
      </option>
      {stationNames.map((name) => (
        <option value={name} key={name}>
          {name}
        </option>
      ))}
    </InstallationSelect>
  );
}
