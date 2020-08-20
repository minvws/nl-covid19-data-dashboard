import React, { FunctionComponent } from 'react';

import styles from './graphHeader.module.scss';

type GraphHeaderTypes = {
  Icon?: React.ComponentType;
  title: string;
  regio?: string;
  headingRef?: React.RefObject<HTMLHeadingElement>;
  as?: 'h2' | 'h3';
};

const GraphHeader: FunctionComponent<GraphHeaderTypes> = ({
  Icon,
  title,
  regio,
  headingRef,
  as = 'h3',
}) => {
  return (
    <div className={styles.graphHeader}>
      {Icon && (
        <div
          className={`${styles.graphHeaderIcon} ${
            as === 'h2' ? styles['icon-large'] : styles['icon-small']
          }`}
        >
          <Icon />
        </div>
      )}
      {/*
      An optional ref and the tabIndex makes it focussable via JS,
      this is used on the region page to focus the first graph header
      after the region is changed.
      */}
      {as === 'h3' && (
        <h3 ref={headingRef} tabIndex={headingRef ? -1 : undefined}>
          {title}
          {regio && ` in ${regio}`}
        </h3>
      )}

      {as === 'h2' && (
        <h2 ref={headingRef} tabIndex={headingRef ? -1 : undefined}>
          {title}
          {regio && ` in ${regio}`}
        </h2>
      )}
    </div>
  );
};

export default GraphHeader;
