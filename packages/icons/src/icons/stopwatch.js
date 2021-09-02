import React, { forwardRef } from 'react';

const Stopwatch = forwardRef(({ ...rest }, ref) => {
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
      <rect width="48" height="48" fill="none" />
      <path
        d="M27.8402 29.9922H19.1602V32.4722H27.8402V29.9922Z"
        fill="black"
      />
      <path
        d="M23.5 8.29297C14.9532 8.29297 8 15.2461 8 23.793C8 32.3398 14.9532 39.293 23.5 39.293C32.0468 39.293 39 32.3398 39 23.793C39 15.2461 32.0468 8.29297 23.5 8.29297ZM32.3253 31.7414L30.5145 29.9306L29.6377 30.8074L31.4475 32.6171C29.3411 34.5217 26.5588 35.6908 23.5 35.6908C20.4412 35.6908 17.6589 34.5217 15.5525 32.6172L17.3623 30.8075L16.4855 29.9307L14.6747 31.7416C12.9079 29.7757 11.7795 27.2239 11.6336 24.413H14.2V23.173H11.6336C11.7796 20.3608 12.9128 17.8141 14.6817 15.8515L16.4855 17.6553L17.3623 16.7785L15.5585 14.9748C17.5211 13.2058 20.0677 12.0727 22.8799 11.9267C22.8799 12.9053 22.8799 13.6584 22.8799 14.493C24.7139 14.493 22.2863 14.493 24.1199 14.493C24.1199 13.5902 24.1199 12.8147 24.1199 11.9267C26.9321 12.0727 29.4788 13.2058 31.4414 14.9748L29.6376 16.7785L30.5144 17.6553L32.3181 15.8515C34.0871 17.8141 35.2202 20.3608 35.3662 23.173H32.8V24.4068H35.3664C35.2205 27.2177 34.0921 29.7757 32.3253 31.7414Z"
        fill="black"
      />
      <path
        d="M23.3477 27.8603C24.3388 27.8122 25.1419 27.0922 25.3455 26.1519C25.4786 25.5375 27.1258 16.9439 27.1258 16.9439C27.2678 16.1775 26.4365 15.8881 26.0447 16.5677L22.5115 22.5821C23.7825 22.6177 24.3209 23.1969 24.5007 23.4531C24.7317 23.7822 24.6198 23.8989 24.5658 23.9046C24.5613 23.9042 24.5561 23.9052 24.5516 23.9049C24.1582 23.5977 23.6664 23.4174 23.1332 23.4433C21.9361 23.5014 21.0137 24.5373 21.073 25.7571C21.1322 26.9768 22.1506 27.9185 23.3477 27.8603Z"
        fill="black"
      />
    </svg>
  );
});

Stopwatch.displayName = 'Stopwatch';

export default Stopwatch;
