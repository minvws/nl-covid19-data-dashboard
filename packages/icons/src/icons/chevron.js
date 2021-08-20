import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Chevron = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 11 18"
        fill="currentColor"
        stroke="none"
        {...rest}
      >
        <path
          d="M1 17L9 9L1 1"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
);

Chevron.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Chevron.displayName = 'Chevron';

export default Chevron;
