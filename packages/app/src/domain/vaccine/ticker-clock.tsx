import { useState, useRef, useEffect, useMemo } from 'react';
import css from '@styled-system/css';
// import styled from '@styled-components/styled';
import { Box } from '~/components-styled/base';
import { Heading, Text, InlineText } from '~/components-styled/typography';
import siteText from '~/locale';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { formatNumber } from '~/utils/formatNumber';
// import styled from 'styled-components';

// const ITEMS_AMOUNT = 75;
const ITEM_WIDTH = 2;
const ITEM_HEIGHT = 15;
const RADIUS = 70;

// const STEP_RADIUS = (2 * Math.PI) / ITEMS_AMOUNT;
// const STEP_DEGREES = 360 / ITEMS_AMOUNT;

// const SVG_MORPH_DURATION = 300;
const MINUTE_IN_MS = 60000;

const CONTAINER_WIDTH = 150;
const CONTAINER_HEIGHT = 150;

function modulo(current: number, max: number) {
  return ((current % max) + max) % max;
}

function useInterval(callback: any, delay: number) {
  const savedCallback = useRef(callback);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const id = setInterval(() => {
      savedCallback.current();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}

// const useWindowFocus = () => {
//   const [isWindowFocus, setIsWindowFocus] = useState(true)

//   useEffect(() => {
//     const setActive = (event: FocusEvent) => {
//       if (event.type === 'focus') setIsWindowFocus(true)
//       if (event.type === 'blur') setIsWindowFocus(false)
//     }

//     window.addEventListener('focus', setActive);
//     window.addEventListener('blur', setActive);

//     return () => {
//       window.removeEventListener('focus', setActive);
//       window.removeEventListener('blur', setActive);
//     };
//   });

//   return isWindowFocus;
// };

// CLOCK
interface TickerClockProps {
  tickSpeed: number;
}

export function TickerClock(props: TickerClockProps) {
  const { tickSpeed } = props;

  // const isWindowFocus = useWindowFocus()

  // useEffect(() => {
  //   console.log(isWindowFocus)
  // }, [isWindowFocus])

  const itemsAmount = MINUTE_IN_MS / tickSpeed;
  const stepRadius = (2 * Math.PI) / itemsAmount;
  const stepDegrees = 360 / itemsAmount;

  const [counter, setCounter] = useState(0);
  // const animateToCheck = useRef<any>(null);
  // const animateToStar = useRef<any>(null);

  const angleArray = useMemo(() => {
    const tempAngleArray = [];
    let tempAngle = Math.PI / 2;

    for (let i = 0; i < itemsAmount; i++) {
      tempAngleArray.push((tempAngle += stepRadius));
    }

    return tempAngleArray;
  }, []);

  useInterval(() => {
    setCounter(modulo(counter + 1, itemsAmount));

    // console.log(counter - 45)

    // const current = modulo(counter, 2);

    // if (current === 0) {
    //   if (animateToCheck.current !== null) {
    //     animateToCheck.current.beginElement();
    //   }
    // }

    // if (current === 1) {
    //   animateToStar.current.beginElement();
    // }
  }, tickSpeed);

  return (
    <Box display="flex" alignItems="center">
      <div
        css={css({
          width: CONTAINER_WIDTH,
          height: CONTAINER_HEIGHT,
          position: 'relative',
        })}
      >
        <div
          css={css({
            transform: `rotate(180deg)`,
            display: 'inline-flex',
            position: 'relative',
            width: '100%',
            height: '100%',
            minWidth: CONTAINER_WIDTH,
          })}
        >
          {[...Array(itemsAmount)].map((x, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                transform: `translate(
                  ${
                    RADIUS * Math.cos(angleArray[index]) -
                    ITEM_WIDTH / 2 +
                    CONTAINER_WIDTH / 2
                  }px,
                  ${
                    RADIUS * Math.sin(angleArray[index]) -
                    ITEM_HEIGHT / 2 +
                    CONTAINER_HEIGHT / 2
                  }px
                )
                rotate(${index * stepDegrees + 360 / itemsAmount}deg)`,
                width: ITEM_WIDTH,
                height: ITEM_HEIGHT,
                backgroundColor: index ? '#007BC7' : '#d3d3d3',
                // transition:
                //   index === counter ? '0s'  : '45s cubic-bezier(1,0,1,0.35)',
              }}
            />
          ))}
        </div>
        <Box position="absolute" top="calc(50% - 20px)" left="calc(50% - 20px)">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 35.8982C4 35.8982 5 29.0982 6.8 27.1982C7.6 26.3982 9.3 25.5982 11 24.8982C12.6 24.1982 14.3 23.6982 15.2 23.3982C15.3 23.1982 15.3 22.8982 15.4 22.6982C15.5 22.2982 15.6 21.8982 15.6 21.4982C15.1 20.9982 14.7 20.3982 14.3 19.7982C13.8 18.9982 13.5 18.0982 13.4 17.0982C12.3 16.7982 12.2 14.5982 12 13.7982C11.7 12.2982 12.7 12.2982 12.7 12.2982C12.5 10.9982 12.1 6.69818 13.3 5.29818C14.3 4.09818 16.1 3.39818 17.8 2.89818C20.2 2.29818 21.1 2.69818 22.5 3.39818C24.6 2.89818 25.7 3.59818 26.6 5.19818C27.6 6.79818 27.1 10.9982 26.9 12.2982C27 12.2982 27.9 12.2982 27.6 13.6982C27.4 14.4982 27.4 16.6982 26.2 16.9982C26.1 17.7982 25.8 18.4982 25.5 19.1982C25.1 19.9982 24.6 20.7982 23.9 21.4982C24 21.8982 24 22.2982 24.1 22.6982C24.2 22.8982 24.2 23.0982 24.3 23.3982C25.2 23.6982 26.9 24.2982 28.5 24.9982C30.3 25.6982 32 26.5982 32.7 27.2982C34.5 29.0982 35.5 35.9982 35.5 35.9982H4V35.8982Z"
              fill="#007BC7"
            />
          </svg>

          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.55 29.3981C30.95 28.7981 29.85 28.0981 28.65 27.3981C27.05 26.4981 25.25 25.7981 24.35 25.3981C23.95 25.2981 23.75 24.8981 23.65 24.4981C23.55 23.9981 23.45 23.1981 23.45 22.5981C25.85 22.4981 27.85 22.1981 28.65 21.8981C28.75 21.7981 27.75 18.4981 27.25 16.1981C27.15 15.6981 27.05 15.2981 27.05 14.9981C27.05 14.5981 26.95 14.0981 26.95 13.5981C26.75 11.0981 26.55 8.19812 25.65 6.19812C24.85 4.49812 23.45 3.49812 21.05 4.39812C21.05 4.39812 18.95 2.89812 16.65 4.09812C15.95 4.49812 15.25 5.09812 14.55 6.09812C12.85 8.49812 12.85 11.4981 12.95 13.6981C12.95 14.2981 12.95 14.7981 12.95 15.1981C12.95 15.4981 12.85 15.8981 12.75 16.3981C12.25 18.3981 11.25 21.6981 11.35 21.6981C12.25 21.9981 14.25 22.2981 16.55 22.4981C16.55 22.9981 16.35 24.3981 16.25 24.4981C16.15 24.8981 15.95 25.2981 15.55 25.3981C15.15 25.5981 12.15 26.8981 11.25 27.3981C10.05 27.9981 8.95 28.6981 8.35 29.3981C6.85 31.2981 6.75 36.9981 6.75 36.9981C9.35 36.9981 30.25 36.9981 33.25 36.9981C33.25 36.9981 33.15 31.2981 31.55 29.3981Z"
              fill="#007BC7"
            />
          </svg>

          {/* <svg
            viewBox="0 0 194.6 185.1"
            css={css({ width: '40px', height: '40px' })}
          > */}
          {/* <polygon
              fill="#FFD41D"
              points="97.3,0 127.4,60.9 194.6,70.7 145.9,118.1 157.4,185.1 97.3,153.5 37.2,185.1 48.6,118.1 0,70.7 67.2,60.9"
            >
              <animate
                ref={animateToCheck}
                begin="indefinite"
                fill="freeze"
                attributeName="points"
                dur={`${SVG_MORPH_DURATION}ms`}
                to="110,58.2 147.3,0 192.1,29 141.7,105.1 118.7,139.8 88.8,185.1 46.1,156.5 0,125 23.5,86.6  71.1,116.7"
              />
              <animate
                ref={animateToStar}
                begin="indefinite"
                fill="freeze"
                attributeName="points"
                dur={`${SVG_MORPH_DURATION}ms`}
                to="97.3,0 127.4,60.9 194.6,70.7 145.9,118.1 157.4,185.1 97.3,153.5 37.2,185.1 48.6,118.1 0,70.7 67.2,60.9"
              />
            </polygon> */}
          {/* </svg> */}
        </Box>
      </div>
      <Box pl={4}>
        <Heading level={3}>
          {replaceComponentsInText(siteText.vaccinaties.clock.title, {
            seconds: (
              <InlineText color="blue" fontWeight="bold">
                0.8
              </InlineText>
            ),
          })}
        </Heading>
        <Text m={0}>
          {replaceComponentsInText(siteText.vaccinaties.clock.description, {
            amount: (
              <InlineText color="blue" fontWeight="bold">
                {formatNumber(84373)}
              </InlineText>
            ),
          })}
        </Text>
      </Box>
    </Box>
  );
}
