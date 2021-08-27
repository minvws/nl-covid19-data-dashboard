import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Dot = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      width={6}
      height={6}
      fill="currentColor"
      {...rest}
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
});

Dot.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

Dot.displayName = 'Dot';

export default Dot;
