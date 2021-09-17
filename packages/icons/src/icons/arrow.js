import React, { forwardRef } from 'react';

const Arrow = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      viewBox="0 0 13 8"
      fill="none"
      {...rest}
    >
      <path
        d="M11 1L6 6 1 1"
        stroke="currentcolor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
});

Arrow.displayName = 'Arrow';

export default Arrow;
