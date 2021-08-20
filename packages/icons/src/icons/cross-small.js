import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const CrossSmall = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 23 23"
        fill="currentColor"
        stroke="none"
        {...rest}
      >
        <path
          d="M15.1826 6.96094L6.64941 15.4934"
          stroke="currentColor"
          stroke-width="2"
        />
        <path
          d="M6.64941 6.96094L15.1819 15.4941"
          stroke="currentColor"
          stroke-width="2"
        />
      </svg>
    );
  }
);

CrossSmall.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

CrossSmall.displayName = 'CrossSmall';

export default CrossSmall;
