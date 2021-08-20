import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Ziekenhuis = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="currentColor"
        stroke="none"
        {...rest}
      >
        <path d="M6.41116 7.61421H4.8068C4.5862 7.61421 4.40571 7.42544 4.40571 7.19473V5.51684C4.40571 5.28613 4.5862 5.09737 4.8068 5.09737H6.41116V3.41947C6.41116 3.18876 6.59165 3 6.81225 3H8.4166C8.6372 3 8.81769 3.18876 8.81769 3.41947V5.09737H10.422C10.6426 5.09737 10.8231 5.28613 10.8231 5.51684V7.19473C10.8231 7.42544 10.6426 7.61421 10.422 7.61421H8.81769V9.2921C8.81769 9.52281 8.6372 9.71157 8.4166 9.71157H6.81225C6.59165 9.71157 6.41116 9.52281 6.41116 9.2921V7.61421Z" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0.401089 10.5432H14.8403C15.0609 10.5432 15.2414 10.7319 15.2414 10.9627V29H11.2305V25.2247L9.62613 25.6442V29H5.61525V25.2247L4.01089 25.6442V29H0V10.9627C0 10.7319 0.18049 10.5432 0.401089 10.5432ZM8.82396 13.4795H6.41742V15.9963H8.82396V13.4795ZM8.82396 17.6742H6.41742V20.1911H8.82396V17.6742ZM4.81307 13.4795H2.40653V15.9963H4.81307V13.4795ZM4.81307 17.6742H2.40653V20.1911H4.81307V17.6742ZM3.20871 24.3858H12.0327V22.7079H3.20871V24.3858ZM10.4283 20.1911H12.8348V17.6742H10.4283V20.1911ZM10.4283 15.9963H12.8348V13.4795H10.4283V15.9963Z"
        />
      </svg>
    );
  }
);

Ziekenhuis.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Ziekenhuis.displayName = 'Ziekenhuis';

export default Ziekenhuis;
