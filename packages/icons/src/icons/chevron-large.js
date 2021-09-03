import React, { forwardRef } from 'react';

const ChevronLarge = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      width={36}
      height={36}
      viewBox="0 0 36 36"
      fill="none"
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.225 10.2441C14.525 9.91864 15.0114 9.91864 15.3114 10.2441L22 17.5L15.3114 24.7559C15.0114 25.0814 14.525 25.0814 14.225 24.7559C13.925 24.4305 13.925 23.9028 14.225 23.5774L19.8273 17.5L14.225 11.4226C13.925 11.0972 13.925 10.5695 14.225 10.2441Z"
        fill="currentColor"
      />
    </svg>
  );
});

ChevronLarge.displayName = 'ChevronLarge';

export default ChevronLarge;
