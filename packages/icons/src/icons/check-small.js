import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const CheckSmall = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      width={23}
      height={23}
      viewBox="0 0 23 23"
      fill="none"
      {...rest}
    >
      <path
        d="M7.30273 10.8671L11.0734 14.6946L17.1626 6.74219"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
});

CheckSmall.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

CheckSmall.displayName = 'CheckSmall';

export default CheckSmall;
