import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const RioolwaterMonitoring = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="currentColor"
        stroke="none"
        {...rest}
      >
        <path d="M19.5737 10.0521C20.0716 10.4453 21.0875 11.2476 22.1061 11.2476C22.5322 11.2476 22.997 11.0815 23.3868 10.8912V12.798C22.9884 12.9296 22.5532 13.0215 22.1061 13.0215C21.068 13.0215 20.0866 12.5333 19.5076 12.1762C18.9286 12.5333 17.9472 13.0215 16.9091 13.0215C15.871 13.0215 14.8895 12.5333 14.3105 12.1762C13.7315 12.5333 12.7501 13.0215 11.712 13.0215C10.6739 13.0215 9.69247 12.5333 9.11348 12.1762C8.53448 12.5333 7.55306 13.0215 6.51495 13.0215C5.47684 13.0215 4.49541 12.5333 3.91642 12.1762C3.33742 12.5333 2.356 13.0215 1.31789 13.0215C0.857039 13.0215 0.408229 12.9242 0 12.7861V10.8723C0.397792 11.071 0.876874 11.2476 1.31789 11.2476C2.344 11.2476 3.35846 10.4426 3.83472 10.0646C3.86401 10.0414 3.89132 10.0197 3.91642 10L3.98248 10.0521C4.48041 10.4453 5.49628 11.2476 6.51495 11.2476C7.54105 11.2476 8.55552 10.4426 9.03178 10.0646C9.06109 10.0414 9.08837 10.0197 9.11348 10L9.17954 10.0521C9.67747 10.4453 10.6933 11.2476 11.712 11.2476C12.7381 11.2476 13.7526 10.4426 14.2288 10.0646C14.2582 10.0414 14.2854 10.0197 14.3105 10L14.3766 10.0521C14.8745 10.4453 15.8904 11.2476 16.9091 11.2476C17.9352 11.2476 18.9496 10.4426 19.4259 10.0646C19.4552 10.0414 19.4825 10.0197 19.5076 10L19.5737 10.0521Z" />
        <path d="M13.4513 18.7952L12.1417 21.1591C12 21.1764 11.8568 21.1877 11.712 21.1877C10.6739 21.1877 9.69247 20.6995 9.11348 20.3424C8.53448 20.6995 7.55306 21.1877 6.51495 21.1877C5.47684 21.1877 4.49541 20.6995 3.91642 20.3424C3.33742 20.6995 2.356 21.1877 1.31789 21.1877C0.857039 21.1877 0.408229 21.0905 0 20.9523V19.0385C0.397792 19.2372 0.876874 19.4139 1.31789 19.4139C2.344 19.4139 3.35846 18.6088 3.83472 18.2309C3.86403 18.2076 3.89131 18.186 3.91642 18.1662L3.98248 18.2183C4.48041 18.6116 5.49628 19.4139 6.51495 19.4139C7.54105 19.4139 8.55552 18.6088 9.03178 18.2309C9.06109 18.2076 9.08837 18.186 9.11348 18.1662L9.17954 18.2183C9.67747 18.6116 10.6933 19.4139 11.712 19.4139C12.3372 19.4139 12.9538 19.1142 13.4513 18.7952Z" />
        <path d="M20.3536 18.7624L21.697 21.1462C21.8363 21.1629 21.977 21.1737 22.1194 21.1737C22.5664 21.1737 23.0016 21.0818 23.4 20.9502V19.0433C23.0103 19.2336 22.5454 19.3997 22.1194 19.3997C21.4877 19.3998 20.8602 19.0906 20.3536 18.7624Z" />
        <path d="M19.4125 14.1346L19.4777 14.0831L19.5438 14.1353C20.0417 14.5285 21.0575 15.3308 22.0762 15.3307C22.5023 15.3307 22.9671 15.1646 23.3569 14.9743V16.8812C22.9585 17.0128 22.5233 17.1047 22.0762 17.1047C21.0381 17.1047 20.0567 16.6164 19.4777 16.2593C19.349 16.3387 19.1978 16.4245 19.0332 16.5101L18.6677 15.8617C18.4842 15.5363 18.2244 15.2723 17.9208 15.0857C18.5545 14.8129 19.1043 14.3782 19.4125 14.1346Z" />
        <path d="M3.91642 16.2593C4.49541 16.6164 5.47684 17.1047 6.51495 17.1047C7.55306 17.1047 8.53448 16.6164 9.11348 16.2593C9.69247 16.6164 10.6739 17.1047 11.712 17.1047C12.7501 17.1047 13.7315 16.6164 14.3105 16.2593C14.4313 16.3338 14.5732 16.4142 14.7259 16.4945L15.0684 15.8761C15.2562 15.5374 15.5249 15.263 15.8399 15.0733C15.2195 14.7994 14.6774 14.3722 14.36 14.122L14.3105 14.0831C14.2854 14.1029 14.2582 14.1245 14.2288 14.1478C13.7526 14.5257 12.7381 15.3308 11.712 15.3308C10.6933 15.3308 9.67747 14.5285 9.17954 14.1352L9.11348 14.0831C9.08884 14.1025 9.06213 14.1237 9.03344 14.1465L9.03221 14.1474C8.55595 14.5254 7.54106 15.3308 6.51495 15.3308C5.49628 15.3308 4.48041 14.5285 3.98248 14.1352L3.91642 14.0831C3.89131 14.1029 3.86403 14.1245 3.83472 14.1478C3.35846 14.5257 2.34399 15.3308 1.31789 15.3308C0.876874 15.3308 0.397792 15.1541 0 14.9554V16.8692C0.408229 17.0074 0.857039 17.1047 1.31789 17.1047C2.35596 17.1047 3.33742 16.6164 3.91642 16.2593Z" />
        <path d="M16.8792 24.6599C16.5304 24.6599 16.3493 24.9228 16.3493 25.2589C16.3493 25.6387 16.5446 25.8431 16.8862 25.8431C17.2347 25.8431 17.4161 25.5875 17.4161 25.2589C17.4161 24.8716 17.2208 24.6599 16.8792 24.6599Z" />
        <path d="M17.3318 24.1462L16.5094 24.1692L16.2302 20.7469H17.4098L17.3318 24.1462Z" />
        <path
          d="M16.8501 16.2377C17.1037 16.2377 17.3384 16.378 17.4672 16.6068L23.2504 26.8674C23.3812 27.0996 23.3833 27.3873 23.2557 27.6214C23.1281 27.8555 22.8905 28 22.6332 28H11.166C10.9095 28 10.6728 27.8565 10.5449 27.6239C10.417 27.3912 10.4175 27.1045 10.5461 26.8724L16.2302 16.6117C16.3581 16.3812 16.5927 16.2387 16.8473 16.2377H16.8501ZM16.8578 18.7122L12.6761 26.2609H21.1123L16.8578 18.7122Z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    );
  }
);

RioolwaterMonitoring.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

RioolwaterMonitoring.displayName = 'RioolwaterMonitoring';

export default RioolwaterMonitoring;
