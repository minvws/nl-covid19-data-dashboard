import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Recreatie = forwardRef(
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
          d="M14.4198 25.1096C13.2788 25.1096 12.7084 25.8227 12.7084 26.5358C12.7084 25.6801 12.1379 24.967 10.997 24.967C10.8299 24.967 10.6628 25.0159 10.5244 25.0565C10.4266 25.0852 10.343 25.1096 10.2839 25.1096C11.2786 23.8498 12.8281 23.1757 14.3163 22.5283C16.0288 21.7833 17.6599 21.0738 18.2704 19.5476C19.2709 16.9907 20.3582 13.3937 21.1267 10.8511C21.344 10.132 21.5359 9.49721 21.6931 8.99415C21.1227 8.85154 19.6965 8.13847 20.1244 7.42539C20.267 7.14016 20.5522 7.14016 20.98 7.14016C21.4079 7.14016 21.9783 7.14016 22.4062 7.28278C22.4062 7.14016 22.5488 7.14016 22.6914 7.14016L22.4062 6.28447C22.121 6.14186 21.9783 5.99924 21.9783 5.71401C21.9783 5.42878 22.2636 5.14355 22.5488 5.14355C22.834 5.14355 23.1193 5.42878 23.1193 5.71401C23.1193 5.78532 23.0836 5.82097 23.048 5.85663C23.0123 5.89228 22.9767 5.92794 22.9767 5.99924L23.5471 6.85493C23.6165 6.87808 23.6897 6.90122 23.7648 6.92497C24.1526 7.04759 24.5917 7.18645 24.8306 7.42539C25.2585 7.71062 26.6846 9.27938 27.5403 10.2777C28.6812 11.7038 27.6829 12.5595 26.6846 12.2743C25.8289 11.9891 24.4028 11.5612 24.4028 11.5612C24.4028 11.5612 22.6914 20.2607 21.4079 25.1096H21.2653C20.1244 25.1096 19.5539 25.8227 19.5539 26.5358C19.5539 25.8227 18.9834 25.1096 17.8425 25.1096C16.7016 25.1096 16.1311 25.8227 16.1311 26.5358C16.1311 25.8227 15.5607 25.1096 14.4198 25.1096ZM25.1159 9.13677C25.1159 8.99415 24.9733 8.70892 24.688 8.70892C24.4028 8.70892 24.2602 8.85154 24.2602 9.13677C24.2602 9.27938 24.4028 9.56461 24.688 9.56461C24.8306 9.56461 25.1159 9.422 25.1159 9.13677Z"
        />
        <path d="M26.9701 26.3932C26.9701 25.9654 27.3979 25.8228 27.8257 25.8228C28.3962 25.8228 28.6814 25.9654 28.9667 26.5358V30.9569H27.2553V29.2455H25.5439V30.9569H23.8325V29.2455H22.1211V30.9569H20.4098V29.2455H18.6984V30.9569H16.987V29.2455H15.2756V30.9569H13.5643V29.2455H11.8529V30.9569H10.1415V29.2455H8.43013V30.9569H6.71875V26.5358C6.71875 25.9654 7.14659 25.8228 7.57444 25.9654C8.00228 25.9654 8.43013 26.108 8.43013 26.5358V27.5341H10.1415V26.5358C10.1415 26.108 10.5693 25.9654 10.9972 25.9654C11.425 25.9654 11.8529 26.108 11.8529 26.5358V27.5341H13.4216V26.5358C13.4216 25.9654 13.8495 25.9654 14.2773 25.9654C14.7052 25.9654 15.133 26.108 15.133 26.5358V27.5341H16.8444V26.5358C16.8444 26.108 17.2722 25.9654 17.7001 25.9654C18.1279 25.9654 18.5558 26.108 18.5558 26.5358V27.5341H20.2672V26.5358C20.2672 25.9654 20.5524 25.9654 20.9802 25.9654C21.4081 25.9654 21.8359 26.108 21.8359 26.5358V27.5341H23.5473V26.5358C23.5473 26.108 23.9751 25.9654 24.403 25.9654C24.8308 25.9654 25.2587 26.108 25.2587 26.5358V27.3915H26.9701V26.3932Z" />
      </svg>
    );
  }
);

Recreatie.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Recreatie.displayName = 'Recreatie';

export default Recreatie;
