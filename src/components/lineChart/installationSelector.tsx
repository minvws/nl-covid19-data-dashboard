import React, { useState } from 'react';

import styles from './installationselector.module.scss';

type TProps = {
  onChange: (value?: string) => void;
  stationNames: string[];
  placeholderText: string;
};

export function InstallationSelector(props: TProps) {
  const { onChange, stationNames, placeholderText } = props;
  const [selected, setSelected] = useState<string | undefined>();

  if (selected) {
    return (
      <button
        className={styles.installationButton}
        onClick={() => {
          setSelected(undefined);
          onChange(undefined);
        }}
      >
        {selected}
      </button>
    );
  }

  return (
    <select
      defaultValue=""
      onChange={(event) => {
        setSelected(event.target.value);
        onChange(event.target.value);
      }}
      className={styles.installationSelector}
    >
      <option value="" disabled>
        {placeholderText}
      </option>
      {stationNames.map((name) => (
        <option value={name} key={name}>
          {name}
        </option>
      ))}
    </select>
  );
}
