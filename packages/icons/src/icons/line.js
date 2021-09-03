import React, { forwardRef } from 'react';

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

Line.displayName = 'Line';

export default Line;
