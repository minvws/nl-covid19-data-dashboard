import React, { FunctionComponent } from 'react';

import styles from './graphHeader.module.scss';

type GraphHeaderTypes = {
  Icon?: React.ComponentType;
  title: string;
  regio?: string;
  headingRef?: React.RefObject<HTMLHeadingElement>;
};

const GraphHeader: FunctionComponent<GraphHeaderTypes> = ({
  Icon,
  title,
  regio,
  headingRef,
}) => {
  return (
    <div className={styles.graphHeader}>
      {Icon && (
        <div className={styles.graphHeaderIcon}>
          <Icon />
        </div>
      )}
      {/*
      An optional ref and the tabIndex makes it focussable via JS,
      this is used on the region page to focus the first graph header
      after the region is changed.
      */}
      <h3 ref={headingRef} tabIndex={headingRef ? -1 : undefined}>
        {title}
        {regio && ` in ${regio}`}
      </h3>
    </div>
  );
};

export default GraphHeader;
