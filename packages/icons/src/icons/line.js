import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Line = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      width={12}
      height={6}
      stroke="currentColor"
      fill="currentColor"
      {...rest}
    >
      <path
        d="M0 0 l12 0"
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="6"
      />
    </svg>
  );
});

Line.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

Line.displayName = 'Line';

export default Line;
