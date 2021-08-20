import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const MeerdaagseEvenementen = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 37 36"
        fill="currentColor"
        stroke="none"
        {...rest}
      >
        <path d="M17.0039 17.6162H20.0976V19.9299H17.0039V17.6162Z" />
        <path d="M24.7382 17.6162H21.6445V19.9299H24.7382V17.6162Z" />
        <path d="M12.3765 21.4771H15.4702V23.7907H12.3765V21.4771Z" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M24.7908 10.6623H27.501C27.6028 10.6605 27.704 10.6791 27.7985 10.7168C27.8931 10.7545 27.9792 10.8108 28.0518 10.8821C28.1245 10.9535 28.1821 11.0387 28.2215 11.1326C28.2608 11.2265 28.2811 11.3273 28.2811 11.4291V26.8843C28.2811 26.9862 28.2608 27.087 28.2215 27.1809C28.1821 27.2748 28.1245 27.3599 28.0518 27.4313C27.9792 27.5027 27.8931 27.5589 27.7985 27.5966C27.704 27.6344 27.6028 27.6529 27.501 27.6512H9.74536C9.64355 27.6529 9.54245 27.6344 9.44788 27.5966C9.35332 27.5589 9.2672 27.5027 9.19458 27.4313C9.12197 27.3599 9.06432 27.2748 9.02496 27.1809C8.9856 27.087 8.96532 26.9862 8.96533 26.8843V11.4291C8.96532 11.3273 8.9856 11.2265 9.02496 11.1326C9.06432 11.0387 9.12197 10.9535 9.19458 10.8821C9.2672 10.8108 9.35332 10.7545 9.44788 10.7168C9.54245 10.6791 9.64355 10.6605 9.74536 10.6623H12.4689C12.5085 10.1731 12.5878 9.32696 12.6275 9.07577C12.6672 8.82457 12.7465 8.34863 13.1167 8.34863H14.2273C14.5403 8.34863 14.6075 8.67946 14.6608 8.9415C14.6705 8.98934 14.6798 9.03494 14.69 9.07577C14.7561 9.34012 14.7561 10.1727 14.7561 10.6619V12.976C14.7717 12.9798 14.788 12.9805 14.8039 12.9779C14.8198 12.9753 14.8351 12.9695 14.8487 12.9609C14.8623 12.9522 14.8739 12.9408 14.883 12.9275C14.8921 12.9142 14.8984 12.8992 14.9015 12.8834L15.5626 10.6623H21.7367C21.7764 10.1731 21.8557 9.32696 21.8954 9.07577C21.935 8.82457 22.0144 8.34863 22.3978 8.34863H23.4554C23.8256 8.34863 23.9182 8.81135 23.9182 9.07577C23.971 9.60287 23.9931 10.1326 23.9843 10.6623V12.976C23.9999 12.9798 24.0162 12.9805 24.0321 12.9779C24.048 12.9753 24.0633 12.9695 24.0769 12.9609C24.0905 12.9522 24.1021 12.9408 24.1112 12.9275C24.1203 12.9142 24.1266 12.8992 24.1297 12.8834L24.7908 10.6623ZM10.8295 25.7209H26.3508L26.2847 15.6862H10.8295V25.7209Z"
        />
        <path
          d="M15.4702 17.6162H12.3765V19.9299H15.4702V17.6162Z"
          fill-opacity="0.5"
        />
        <path
          d="M20.0976 21.4771H17.0039V23.7907H20.0976V21.4771Z"
          fill-opacity="0.5"
        />
        <path
          d="M21.6445 21.4771H24.7382V23.7907H21.6445V21.4771Z"
          fill-opacity="0.5"
        />
      </svg>
    );
  }
);

MeerdaagseEvenementen.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

MeerdaagseEvenementen.displayName = 'MeerdaagseEvenementen';

export default MeerdaagseEvenementen;
