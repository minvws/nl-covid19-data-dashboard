import React, { forwardRef } from 'react';

const Down = forwardRef(({ ...rest }, ref) => {
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
        d="M19.714 10.5c-.4-.5-1.1-.5-1.6-.2l-3.6 2.4v-8c0-1.3-1.1-1.7-2.4-1.7-1.2 0-2.6.4-2.6 1.7v8l-3.6-2.4c-.5-.4-1.2-.3-1.6.2-.4.5-.4 1.1-.1 1.6l6.8 8.5c.2.3.6.5 1 .5s.7-.2 1-.5l6.8-8.5c.4-.5.3-1.2-.1-1.6z"
        fill="currentColor"
      />
    </svg>
  );
});

Down.displayName = 'Down';

export default Down;
