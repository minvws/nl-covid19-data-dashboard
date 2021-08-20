import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Lopend = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="currentColor"
        stroke={color}
        {...rest}
      >
        <path d="M20.9656 8.34905C20.78 9.52329 20.0023 10.228 18.881 10.0368C17.7599 9.84572 17.2242 9.01768 17.4253 7.74575C17.616 6.53884 18.3698 5.79656 19.5202 5.99257C20.6122 6.17887 21.1771 7.01166 20.9656 8.34905Z" />
        <path d="M21.0284 22.5406C21.1948 22.8193 21.2629 22.9333 21.5634 23.8838C22.0389 25.3883 22.892 28.4858 23.2613 30.0016C22.8859 30.1198 21.5476 30.0028 21.0658 28.8094C20.9594 28.5459 20.8245 28.2455 20.6653 27.891C20.345 27.1778 19.9263 26.2452 19.4428 24.9517C19.3242 24.6345 19.2065 24.383 19.15 24.2724C19.0072 23.9927 18.8024 23.786 18.5022 23.483C18.4095 23.3894 18.3076 23.2867 18.1957 23.1697C18.1414 23.113 18.0876 23.0558 18.034 22.9989C17.8973 22.8537 17.7621 22.7101 17.6236 22.5787C17.184 23.7096 16.878 24.3877 16.6531 24.86C16.3806 25.4033 16.3344 25.4743 16.1234 25.7986C16.1053 25.8265 16.0859 25.8563 16.0651 25.8884C15.6131 26.5943 14.96 27.471 14.3329 28.3129C13.8697 28.9348 13.4206 29.5377 13.0772 30.0387C12.9376 29.8985 11.9428 28.801 12.7654 27.3067C13.0335 26.8196 13.3251 26.3612 13.6073 25.9175C13.8517 25.5332 14.0892 25.1598 14.2984 24.7883C14.3952 24.6165 14.435 24.5519 14.4679 24.4839C14.5107 24.3954 14.5418 24.3013 14.6719 23.9571C14.9606 23.1929 15.2894 21.908 15.4908 21.1193C15.4908 21.1193 16.2983 21.6032 16.9113 21.9717C17.0307 22.0435 17.0827 21.9508 17.0827 21.9508L15.6813 20.4261C15.6398 20.381 15.5957 20.3349 15.55 20.2872C15.2004 19.9219 14.7612 19.463 14.7612 18.6647C14.7612 18.0064 15.318 15.3489 15.5727 14.1327C15.6004 14.0005 15.6246 13.8853 15.644 13.7915C15.3319 14.0022 14.5849 14.5199 14.4199 14.8665C14.0148 15.7178 13.7506 17.6803 13.5836 18.9936C12.8079 18.8258 12.4162 18.0985 12.4311 17.3298C12.4444 16.6381 12.5167 15.843 12.6294 15.1555C12.8143 14.0653 12.9885 13.7662 13.4198 13.2693C14.1296 12.4616 15.5301 11.3801 16.2747 10.9193C17.6282 10.0818 19.915 11.1779 20.2186 11.9641C20.2836 12.0622 20.6188 13.4555 20.8039 14.2245C20.8644 14.4762 20.9089 14.661 20.9225 14.7116C21.0409 15.1511 21.1762 15.6378 21.3425 16.0103C21.4504 16.258 21.8142 16.7188 22.0255 16.9864C22.0524 17.0205 22.0769 17.0515 22.098 17.0784C22.1737 17.1751 22.3134 17.3464 22.4804 17.5509C22.8403 17.9918 23.3264 18.5873 23.5694 18.9247C23.3685 19.034 22.3853 19.4796 21.4516 18.4577C21.3617 18.3593 21.2469 18.2406 21.1204 18.1098C20.7033 17.6786 20.159 17.1158 19.9628 16.7179C19.752 16.2774 19.614 15.8692 19.4927 15.477C19.2086 16.7276 18.9051 18.127 18.6973 19.2592C19.2213 19.9401 19.7365 20.6248 20.2326 21.3249C20.2653 21.372 20.2981 21.4189 20.331 21.4659C20.5361 21.7595 20.7454 22.0589 20.9646 22.433C20.9876 22.4723 21.0087 22.5076 21.0284 22.5406Z" />
      </svg>
    );
  }
);

Lopend.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Lopend.displayName = 'Lopend';

export default Lopend;
