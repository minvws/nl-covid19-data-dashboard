import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Unchecked = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="none"
      focusable="false"
      {...rest}
    >
      <rect x="0.5" y="0.5" width="13" height="13" stroke="#01689B" />
    </svg>
  );
});

Unchecked.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

Unchecked.displayName = 'Unchecked';

export default Unchecked;
