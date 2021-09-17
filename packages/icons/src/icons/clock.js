import React, { forwardRef } from 'react';

const Clock = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      width={15}
      height={15}
      viewBox="0 0 16 16"
      fill="none"
      {...rest}
    >
      <circle cx="8" cy="8" r="7.5" stroke="#595959" />
      <rect
        x="12"
        y="8"
        width="1"
        height="5"
        rx="0.5"
        transform="rotate(90 12 8)"
        fill="#595959"
      />
      <path
        d="M7 3.5C7 3.22386 7.22386 3 7.5 3V3V3C7.77614 3 8 3.22386 8 3.5V8.5C8 8.77614 7.77614 9 7.5 9V9C7.22386 9 7 8.77614 7 8.5L7 3.5Z"
        fill="#595959"
      />
    </svg>
  );
});

Clock.displayName = 'Clock';

export default Clock;
