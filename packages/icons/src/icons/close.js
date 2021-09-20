import React, { forwardRef } from 'react';

const Close = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      width={36}
      height={36}
      viewBox="0 0 36 36"
      fill="currentColor"
      {...rest}
    >
      <path
        d="M11 11L18 18M25 11L18 18M25 25L18 18M11 25L18 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
});

Close.displayName = 'Close';

export default Close;
