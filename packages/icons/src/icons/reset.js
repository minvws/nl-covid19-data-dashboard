import React, { forwardRef } from 'react';

const Reset = forwardRef(({ ...rest }, ref) => {
  return (
    <svg ref={ref} role="img" focusable="false" viewBox="0 0 10 10" {...rest}>
      <rect
        x="4.21"
        y="-1.29"
        width="1.57"
        height="12.57"
        transform="translate(-2.07 5) rotate(-45)"
        fill="#fff"
      />
      <polygon
        points="1.11 0 0 1.11 8.89 10 10 8.89 1.11 0 1.11 0"
        fill="#595959"
      />
      <rect
        x="-1.29"
        y="4.21"
        width="12.57"
        height="1.57"
        transform="translate(-2.07 5) rotate(-45)"
        fill="#fff"
      />
      <polygon
        points="8.89 0 0 8.89 1.11 10 10 1.11 8.89 0 8.89 0"
        fill="#595959"
      />
    </svg>
  );
});

Reset.displayName = 'Reset';

export default Reset;
