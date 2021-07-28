import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const BasisregelsAfstand = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        stroke={color}
        {...rest}
      >
        <path
          d="M10.2482 10.8259C10.2482 11.6926 9.76668 12.2704 8.90002 12.2704C8.03335 12.2704 7.55187 11.7889 7.55187 10.8259C7.55187 9.86297 8.03335 9.28519 8.90002 9.28519C9.76668 9.28519 10.2482 9.86297 10.2482 10.8259Z"
          fill="currentColor"
        />
        <path
          d="M7.35927 13.0407C8.22593 12.8481 9.47779 12.8481 10.4407 13.0407C12.184 13.4077 12.1789 16.135 12.1745 18.4739C12.1743 18.5899 12.1741 18.7048 12.1741 18.8185C12.0778 19.6852 11.5 19.8778 11.1148 19.8778V17.663C11.1148 16.6037 10.9222 15.5444 10.8259 15.1593C10.8259 15.063 10.7296 15.063 10.7296 15.063V26.6185C10.7296 26.6185 9.38149 26.6185 9.28519 25.1741C9.28519 25.1741 9.0926 19.8778 9.0926 19.7815C9.0926 19.6852 9.0926 19.5889 8.90001 19.5889C8.70742 19.5889 8.70742 19.6852 8.70742 19.7815C8.70742 19.8778 8.51482 25.2704 8.51482 25.2704C8.41853 26.7148 7.16668 26.7148 7.16668 26.7148V15.063H6.97408C6.87779 15.4481 6.68519 16.6037 6.68519 17.663V19.8778C6.30001 19.8778 5.72223 19.6852 5.62593 18.8185C5.62593 18.7048 5.62572 18.5899 5.6255 18.4739C5.62113 16.135 5.61604 13.4077 7.35927 13.0407Z"
          fill="currentColor"
        />
        <path
          d="M27.1 12.2704C27.9666 12.2704 28.4481 11.6926 28.4481 10.8259C28.4481 9.86297 27.9666 9.28519 27.1 9.28519C26.2333 9.28519 25.7518 9.86297 25.7518 10.8259C25.7518 11.7889 26.2333 12.2704 27.1 12.2704Z"
          fill="currentColor"
        />
        <path
          d="M25.5593 13.0407C26.426 12.8481 27.6778 12.8481 28.6408 13.0407C30.384 13.4077 30.3789 16.135 30.3745 18.4739L30.3741 18.8185C30.2778 19.6852 29.7 19.8778 29.3148 19.8778V17.663C29.3148 16.6037 29.1222 15.5444 29.026 15.1593C29.026 15.063 28.9297 15.063 28.9297 15.063V26.6185C28.9297 26.6185 27.6778 26.6185 27.5815 25.1741C27.5815 25.1741 27.3889 19.8778 27.3889 19.7815C27.3889 19.6852 27.2926 19.5889 27.1963 19.5889C27.0037 19.5889 27.0037 19.6852 27.0037 19.7815C27.0037 19.8778 26.8111 25.2704 26.8111 25.2704C26.6185 26.7148 25.3667 26.7148 25.3667 26.7148V15.063H25.1741C25.0778 15.4481 24.8852 16.6037 24.8852 17.663V19.9741C24.5 19.9741 23.9222 19.7815 23.826 18.9148C23.826 18.7963 23.8257 18.6768 23.8255 18.5565C23.8212 16.1344 23.8162 13.4077 25.5593 13.0407Z"
          fill="currentColor"
        />
        <path
          d="M15.1592 16.2185C15.2555 16.1222 15.2555 15.9296 15.1592 15.8333C15.063 15.737 14.9667 15.737 14.7741 15.8333L12.8481 17.3741C12.6555 17.4704 12.6555 17.7593 12.8481 17.8556L14.7741 19.3963C14.8412 19.4634 14.9552 19.437 15.0506 19.4148C15.0921 19.4051 15.1301 19.3963 15.1592 19.3963C15.1592 19.3963 15.2555 19.3 15.2555 19.2037C15.2555 19.2037 15.2555 19.1074 15.1592 19.0111L14.5815 18.1444H16.0259V17.0852H14.5815L15.1592 16.2185Z"
          fill="currentColor"
        />
        <path
          d="M16.7963 17.0852H19.2037V18.1444H16.7963V17.0852Z"
          fill="currentColor"
        />
        <path
          d="M21.2259 15.8333C21.1296 15.737 20.937 15.737 20.8407 15.8333C20.7444 15.9296 20.7444 16.1222 20.8407 16.2185L21.4185 16.9889H19.9741V18.1444H21.4185L20.8407 18.9148C20.7444 19.0111 20.7444 19.1074 20.7444 19.1074C20.7444 19.2037 20.7444 19.3 20.8407 19.3C20.937 19.3963 21.1296 19.3963 21.2259 19.3L23.1518 17.7593C23.3444 17.663 23.3444 17.3741 23.1518 17.2778L21.2259 15.8333Z"
          fill="currentColor"
        />
        <path
          d="M14.6778 22.0926C14.3889 22.0926 14.1963 22.0926 13.9074 22.1889V22.4778H14.3889V24.2111H14.8704V22.0926H14.6778Z"
          fill="currentColor"
        />
        <path
          d="M16.1222 23.9222C16.1222 23.6333 16.0259 23.537 15.8333 23.537C15.6862 23.537 15.5953 23.6494 15.5176 23.7454C15.4936 23.7751 15.4708 23.8032 15.4481 23.8259C15.4481 24.0185 15.5444 24.1148 15.6407 24.1148L15.4481 24.6926H15.6407C15.737 24.6926 16.1222 24.2111 16.1222 23.9222Z"
          fill="currentColor"
        />
        <path
          d="M17.1815 22.4778H18.0481V21.9963H16.7963V23.1518H17.1815C17.4704 23.1518 17.663 23.2481 17.663 23.4407C17.663 23.7296 17.4704 23.8259 16.9889 23.8259H16.7V24.2111H16.9889C17.7592 24.2111 18.1444 23.9222 18.1444 23.4407C18.1444 23.0556 17.9518 22.863 17.3741 22.863H17.1815V22.4778Z"
          fill="currentColor"
        />
        <path
          d="M19.6852 22.5741V24.2111H19.2037L19.3 22.0926H20.0704L20.4555 23.3444L20.8407 22.0926H21.6111L21.7074 24.2111H21.2259L21.1296 22.5741L20.7444 23.8259H20.1667L19.6852 22.5741Z"
          fill="currentColor"
        />
        <path
          d="M22.4637 23.4744C22.4249 23.5187 22.4055 23.5741 22.4055 23.6406C22.4055 23.7044 22.4249 23.7577 22.4637 23.8006C22.5039 23.8436 22.5635 23.8651 22.6424 23.8651C22.7214 23.8651 22.781 23.8436 22.8212 23.8006C22.8627 23.7577 22.8835 23.7044 22.8835 23.6406C22.8835 23.5741 22.8627 23.5187 22.8212 23.4744C22.781 23.43 22.7214 23.4079 22.6424 23.4079C22.5635 23.4079 22.5039 23.43 22.4637 23.4744Z"
          fill="currentColor"
        />
      </svg>
    );
  }
);

BasisregelsAfstand.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

BasisregelsAfstand.displayName = 'BasisregelsAfstand';

export default BasisregelsAfstand;
