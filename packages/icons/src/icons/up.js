import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Up = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      {...rest}
    >
      <path
        d="M19.889 11.95l-6.8-8.5c-.5-.6-1.5-.6-2 0l-6.8 8.5c-.4.5-.4 1.2.1 1.6.4.5 1.1.5 1.6.2l3.6-2.4v8c0 1.3 1.4 1.7 2.6 1.7 1.2 0 2.4-.4 2.4-1.7v-8l3.6 2.4c.2.1.5.2.7.2.3 0 .7-.1.9-.4.4-.4.5-1.1.1-1.6z"
        fill="currentColor"
      />
    </svg>
  );
});

Up.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

Up.displayName = 'Up';

export default Up;
