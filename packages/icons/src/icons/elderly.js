import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Elderly = forwardRef(
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
        <path d="M22.6206 17.5004L11.7687 7.12358C11.5932 6.95881 11.3234 6.95881 11.1479 7.12358L0.296083 17.5004C0.107403 17.6778 0 17.9276 0 18.1893V18.8828C0 19.1413 0.205257 19.3509 0.458333 19.3509H2.29167V29H20.625V19.3509H22.4583C22.7114 19.3509 22.9167 19.1413 22.9167 18.8828V18.1893C22.9167 17.9276 22.8092 17.6778 22.6206 17.5004ZM5.11806 26.6842C5.11806 26.6842 5.50195 23.9185 6.23051 23.1841C6.8148 22.5953 8.82563 21.8824 9.61343 21.6185C9.68363 21.3448 9.73488 21.0812 9.77021 20.8522C9.31704 20.3495 8.97772 19.7466 8.88464 19.0533C8.42543 18.9223 8.33326 18.0432 8.33326 17.7125C8.33326 17.3815 8.39617 17.2026 8.52481 17.1469C8.55479 17.134 8.58325 17.1347 8.61212 17.1322C8.54773 16.6202 8.37081 14.8829 8.84927 14.2825C9.23515 13.7985 9.96787 13.5086 10.637 13.331C11.6001 13.0753 11.9743 13.253 12.524 13.537C13.3623 13.3313 13.8019 13.638 14.1634 14.2674C14.544 14.9293 14.3523 16.6198 14.2837 17.1287C14.3188 17.1292 14.3547 17.131 14.3919 17.147C14.5205 17.2026 14.5834 17.3815 14.5834 17.7125C14.5834 18.0432 14.4913 18.9224 14.032 19.0533C13.9163 19.7725 13.5837 20.3684 13.1348 20.8648C13.1688 21.0903 13.2217 21.3489 13.2976 21.6166C14.0816 21.879 16.1006 22.5939 16.6862 23.1841C17.4148 23.9185 17.7986 26.6842 17.7986 26.6842H5.11806Z" />
      </svg>
    );
  }
);

Elderly.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Elderly.displayName = 'Elderly';

export default Elderly;
