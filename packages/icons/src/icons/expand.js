import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Expand = forwardRef(
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
          d="M19.4028 11H25.0028M25.0028 11V16.6M25.0028 11L19.4028 16.6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M16.6 24.9999H11M11 24.9999V19.3999M11 24.9999L16.6 19.3999"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
);

Expand.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Expand.displayName = 'Expand';

export default Expand;
