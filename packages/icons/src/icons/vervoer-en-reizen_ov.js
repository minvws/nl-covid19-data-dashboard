import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const VervoerEnReizenOv = forwardRef(
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
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M27.371 5.9063C27.8096 6.20215 29.2715 8.86488 29.8563 10.0483C30.0025 10.4921 30.1487 10.9359 30.1487 11.3797L29.8563 21.143C29.5639 26.6164 25.0318 27.356 21.8154 27.356C18.599 27.356 13.9207 26.6164 13.7745 21.143L13.3359 11.3797C13.3359 10.9359 13.4821 10.4921 13.6283 10.0483C14.2131 8.86488 15.5289 6.20215 16.1137 5.9063C16.8446 5.61044 19.6224 5.46251 21.8154 5.46251C23.8622 5.46251 26.64 5.61044 27.371 5.9063ZM23.1312 8.86488C23.1312 8.12523 22.5464 7.53351 21.8154 7.53351C21.0844 7.53351 20.4996 8.12523 20.4996 8.86488C20.4996 9.60452 21.0844 10.1962 21.8154 10.1962C22.5464 10.1962 23.1312 9.60452 23.1312 8.86488ZM16.6985 21.5868C16.6985 22.3264 17.2832 22.9181 18.0142 22.9181C18.7452 22.9181 19.33 22.3264 19.33 21.5868C19.33 20.8471 18.7452 20.2554 18.0142 20.2554C17.2832 20.2554 16.6985 20.8471 16.6985 21.5868ZM24.1546 21.5868C24.1546 22.3264 24.7394 22.9181 25.4704 22.9181C26.2014 22.9181 26.7862 22.3264 26.7862 21.5868C26.7862 20.8471 26.2014 20.2554 25.4704 20.2554C24.7394 20.2554 24.1546 20.8471 24.1546 21.5868ZM26.3476 16.5572L27.8096 11.9714C27.9558 11.6755 27.6634 11.3797 27.5172 11.3797H16.1137C15.8213 11.3797 15.5289 11.6755 15.5289 11.9714L16.9908 16.5572C17.137 16.7051 17.2832 16.853 17.4294 16.853H25.909C26.2014 16.853 26.3476 16.7051 26.3476 16.5572Z"
        />
        <path d="M9.38853 14.3383C10.1195 14.4862 10.7043 14.0424 10.7043 13.3028C10.8505 12.4152 10.4119 11.8235 9.68093 11.8235C9.09614 11.5276 8.65754 12.1193 8.51134 12.859C8.36514 13.5986 8.65754 14.1903 9.38853 14.3383Z" />
        <path d="M11.1429 19.9596C11.6281 20.4505 12.214 20.3304 12.4829 20.2753C12.5381 20.264 12.58 20.2554 12.6049 20.2554C12.1966 19.6875 11.8953 19.3538 11.6635 19.0971C11.2312 18.6185 11.0408 18.4077 10.8505 17.4448C10.7774 17.3708 10.6677 16.964 10.5581 16.5572C10.4485 16.1504 10.3388 15.7436 10.2657 15.6696C10.1195 15.2258 8.65751 14.4862 7.63412 15.0779C7.19553 15.3738 6.17213 16.1134 5.73354 16.5572C5.58734 16.8531 5.44114 17.1489 5.29494 17.7406C5.14874 18.1844 5.14874 18.7761 5.14874 19.2199C5.14874 19.6637 5.44114 20.1075 5.87974 20.2554C5.90346 20.1114 5.92719 19.9596 5.95154 19.8037C6.07723 18.9993 6.21958 18.0884 6.46453 17.5927C6.61073 17.4448 7.04933 17.001 7.34173 16.8531C7.31676 16.9793 7.28328 17.1444 7.2449 17.3336C7.05853 18.2525 6.75693 19.7395 6.75693 20.1075C6.75693 20.6992 7.04933 20.9951 7.34173 21.2909L8.21892 22.3264C8.21892 22.3264 8.21892 22.4744 8.07272 22.3264L7.19553 21.7347C7.04933 22.4744 6.75693 23.3619 6.46453 23.9536C6.31833 24.2495 6.13558 24.5084 5.95284 24.7673C5.77009 25.0261 5.58734 25.285 5.44114 25.5809C4.98296 26.3922 5.33248 26.9311 5.50531 27.1975C5.55307 27.2712 5.58734 27.324 5.58734 27.356C5.87974 26.9862 6.24523 26.5054 6.61072 26.0247C6.97622 25.5439 7.34172 25.0631 7.63412 24.6933C8.07272 24.1016 8.36512 23.3619 8.65751 22.6223L9.68091 23.6578L10.9967 26.6164C11.2891 27.356 12.1663 27.5039 12.4587 27.356C12.4206 27.2404 12.3329 26.9038 12.2162 26.4562C11.8851 25.1859 11.321 23.0212 10.9967 22.4744C10.8505 22.1785 10.5581 21.8087 10.2657 21.4389C9.9733 21.069 9.68091 20.6992 9.53471 20.4034C9.42023 19.8242 9.57466 19.1544 9.71726 18.5358C9.75677 18.3644 9.79538 18.197 9.82711 18.0365C10.1612 18.8253 10.3257 19.0132 10.7082 19.4504C10.8278 19.5871 10.9688 19.7481 11.1429 19.9596Z" />
        <path d="M25.0318 30.4625L24.5932 28.2436C25.1676 28.1467 25.6793 27.9864 26.1283 27.8458C26.365 27.7716 26.5843 27.7029 26.7862 27.6519L27.5172 30.4625H25.0318Z" />
        <path d="M15.9675 30.4625H18.4528L18.8914 28.2436C18.4566 28.1556 18.0217 28.0152 17.6177 27.8848C17.3425 27.796 17.0816 27.7118 16.8447 27.6519L15.9675 30.4625Z" />
      </svg>
    );
  }
);

VervoerEnReizenOv.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

VervoerEnReizenOv.displayName = 'VervoerEnReizenOv';

export default VervoerEnReizenOv;
