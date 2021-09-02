import React, { forwardRef } from 'react';

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

Gelijk.displayName = 'Gelijk';

export default Gelijk;
