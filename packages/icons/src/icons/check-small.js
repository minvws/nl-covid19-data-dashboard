import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const CheckSmall = forwardRef(
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
          d="M7.30273 10.8671L11.0734 14.6946L17.1626 6.74219"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  }
);

CheckSmall.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

CheckSmall.displayName = 'CheckSmall';

export default CheckSmall;
