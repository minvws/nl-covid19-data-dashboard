import React, { forwardRef } from 'react';

const WhiteArrow = forwardRef(({ ...rest }, ref) => {
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
        d="M11.042 1l-5 5-5-5"
        stroke="#FFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
});

WhiteArrow.displayName = 'WhiteArrow';

export default WhiteArrow;
