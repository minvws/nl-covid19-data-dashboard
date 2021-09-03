import React, { forwardRef } from 'react';

const CloseThick = forwardRef(({ ...rest }, ref) => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.1213 18L28.1213 10L26 7.87868L18 15.8787L10 7.87868L7.87868 10L15.8787 18L7.87868 26L10 28.1213L18 20.1213L26 28.1213L28.1213 26L20.1213 18Z"
        fill="currentColor"
      />
    </svg>
  );
});

CloseThick.displayName = 'CloseThick';

export default CloseThick;
