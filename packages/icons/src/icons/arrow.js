import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Arrow = forwardRef(
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
        <path
          d="M11 1L6 6 1 1"
          stroke="currentcolor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
);

Arrow.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Arrow.displayName = 'Arrow';

export default Arrow;
