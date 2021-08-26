import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Gelijk = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      {...rest}
    >
      <circle cx="12" cy="12" r="6" fill="currentColor" />
    </svg>
  );
});

Gelijk.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

Gelijk.displayName = 'Gelijk';

export default Gelijk;
