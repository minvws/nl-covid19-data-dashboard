import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Stap1Avondklok = forwardRef(
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
        <svg
          focusable="false"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10.1767 7.20794C10.1742 7.41865 10.1716 7.62469 10.169 7.8237L10.1614 8.40731C10.1661 8.53068 10.3205 8.58819 10.4249 8.51167C10.7421 8.28533 11.0849 8.03396 11.371 7.74965C11.7448 7.90224 12.1581 8.00288 12.5375 8.08961C12.6632 8.12022 12.7837 8.00752 12.7406 7.89204C12.5945 7.55393 12.4336 7.18104 12.2652 6.79052C12.4962 6.44221 12.722 6.08323 12.9085 5.7711C12.9706 5.66628 12.8955 5.51462 12.7712 5.51045C12.4062 5.50117 11.9744 5.51787 11.576 5.55034L11.1801 5.03115C11.0807 4.90071 10.9825 4.77193 10.8831 4.6413C10.8455 4.59167 10.7931 4.57358 10.7389 4.58425C10.6837 4.59491 10.6429 4.63202 10.6271 4.69231C10.5843 4.85558 10.5421 5.0165 10.4991 5.17972L10.3367 5.798C9.95645 5.92091 9.55108 6.07164 9.21807 6.22006C9.10492 6.272 9.09377 6.44082 9.19118 6.51364C9.48337 6.73023 9.82935 6.97511 10.1767 7.20794Z" />
          <path d="M29.0217 5.61295C28.4837 5.48586 27.9545 5.48308 27.4545 5.5828C28.8227 6.4923 29.3501 8.29136 28.6191 9.81493C28.1581 10.7755 27.2987 11.4132 26.334 11.6307C26.6856 11.8626 27.0812 12.043 27.5176 12.146C29.4215 12.5954 31.3165 11.466 31.7335 9.65863C32.1505 7.85122 30.9256 6.06236 29.0217 5.61295Z" />
          <path d="M6.02022 12.2007C6.29246 12.2754 6.58372 12.3686 6.82351 12.4632C6.90467 12.4961 6.91812 12.6149 6.85179 12.6691C6.65236 12.831 6.41537 13.0151 6.1779 13.1904C6.19505 13.4905 6.21175 13.7771 6.22707 14.0369C6.228 14.1241 6.1204 14.17 6.04434 14.119C5.81335 13.9696 5.56291 13.8031 5.35187 13.6111C5.09308 13.7308 4.8046 13.8152 4.53933 13.8884C4.45121 13.914 4.3626 13.8384 4.38952 13.7553L4.46451 13.5579C4.5359 13.3697 4.61185 13.1696 4.69004 12.9627C4.51566 12.7243 4.34499 12.4776 4.20354 12.2633C4.15621 12.1914 4.20445 12.082 4.29212 12.075C4.54952 12.0569 4.8547 12.0546 5.13716 12.0653C5.29993 11.8306 5.44696 11.6196 5.5977 11.4016C5.62275 11.3654 5.65938 11.3506 5.69788 11.3566C5.73638 11.3626 5.76698 11.3872 5.77997 11.4294L6.02022 12.2007Z" />
          <path d="M18.5631 14.4343L18.5636 14.4413L19.025 20.5124L19.0274 20.5416C19.0714 21.1195 18.6387 21.6236 18.0608 21.6677C18.0149 21.6714 17.9639 21.6714 17.9194 21.6691L12.537 21.3514L12.5305 21.3509C12.198 21.3314 11.9447 21.0462 11.9642 20.7137C11.9814 20.4215 12.204 20.1905 12.4832 20.152L16.8322 19.5505L17.1722 14.4413C17.1977 14.0573 17.5298 13.7665 17.9142 13.792C18.2649 13.8152 18.5376 14.0939 18.5631 14.4343Z" />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M20.1029 10.3186C14.3421 9.08399 8.67173 12.7526 7.43708 18.5139C6.20247 24.2751 9.87156 29.945 15.6324 31.1797C21.3936 32.4143 27.0635 28.7457 28.2981 22.9844C29.5328 17.2231 25.8641 11.5528 20.1029 10.3186ZM25.8043 22.4496C24.8665 26.8256 20.5435 29.6232 16.1671 28.6854C11.7912 27.7476 8.99404 23.4245 9.9314 19.0486C10.8692 14.6727 15.1922 11.8756 19.5686 12.8129C23.9445 13.7502 26.7421 18.0737 25.8043 22.4496Z"
          />
        </svg>
      </svg>
    );
  }
);

Stap1Avondklok.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Stap1Avondklok.displayName = 'Stap1Avondklok';

export default Stap1Avondklok;
