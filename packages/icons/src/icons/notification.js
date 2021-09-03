import React, { forwardRef } from 'react';

const Notification = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      width={48}
      height={48}
      viewBox="0 0 48 48"
      fill="none"
      {...rest}
    >
      <path
        d="M22.468 27.217l5.166-5.236c.591-.436 1.33-.582 1.92-.145.59.436.738 1.309.295 1.89l-5.905 8.728c-.295.29-.738.582-1.18.582-.444 0-.887-.291-1.182-.582l-4.28-5.673c-.444-.582-.444-1.309 0-1.745.442-.437 1.18-.582 1.77-.146l3.396 2.327z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.095 11.364h3.69c1.182 0 2.215 1.018 2.215 2.181v23.273C39 37.982 37.967 39 36.786 39H10.214C9.034 39 8 37.982 8 36.818V13.546c0-1.164 1.033-2.182 2.214-2.182h3.69v-2.91C13.905 7.292 14.939 7 16.12 7c1.181 0 2.214.29 2.214 1.455v2.909h10.334v-2.91C28.667 7.292 29.7 7 30.88 7c1.18 0 2.214.29 2.214 1.455v2.909zm-22.143 7.272v17.455h25.096V18.636H10.951z"
        fill="currentColor"
      />
    </svg>
  );
});

Notification.displayName = 'Notification';

export default Notification;
