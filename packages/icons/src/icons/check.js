import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Check = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.249 5.77521L10.2011 20.2033L2.7511 12.6409L5.06981 10.3566L9.89271 15.2523L18.6647 3.79639L21.249 5.77521Z"
      />
    </svg>
  );
});

Check.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

Check.displayName = 'Check';

export default Check;
