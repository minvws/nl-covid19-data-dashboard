import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const ChevronDownMagenta = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 18 11"
        fill="currentColor"
        stroke="none"
        {...rest}
      >
        <path
          transform="rotate(90, 9, 9)"
          d="M1 17L9 9L1 1"
          stroke="#cd005a"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    );
  }
);

ChevronDownMagenta.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ChevronDownMagenta.displayName = 'ChevronDownMagenta';

export default ChevronDownMagenta;
