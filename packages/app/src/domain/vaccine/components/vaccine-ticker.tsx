import { NlVaccineAdministeredRateMovingAverageValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { shuffle } from 'lodash';
import { useEffect, useState } from 'react';
import { Box } from '~/components-styled/base';
import { InlineText, Text } from '~/components-styled/typography';
import siteText from '~/locale';
import { colors } from '~/style/theme';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { useIsMountedRef } from '~/utils/use-is-mounted-ref';

const RADIUS = 55;
const CONTAINER_WIDTH = RADIUS * 2 + 12;
const CONTAINER_HEIGHT = RADIUS * 2 + 12;

interface VaccineTickerProps {
  data: NlVaccineAdministeredRateMovingAverageValue;
}

export function VaccineTicker({ data }: VaccineTickerProps) {
  const isMountedRef = useIsMountedRef();
  const tickDuration = data.seconds_per_dose * 1000;
  const tickCount = Math.floor(data.doses_per_second * 60);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    let timeoutId: number;
    function tick() {
      if (!isMountedRef.current) return;

      setCounter((x) => x + 1);

      timeoutId = window.setTimeout(
        () => requestAnimationFrame(tick),
        tickDuration
      );
    }
    tick();
    return () => window.clearTimeout(timeoutId);
  }, [isMountedRef, tickDuration]);

  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection={{ _: 'column', xs: 'row' }}
      borderTop="1px solid"
      borderTopColor="border"
      pt={{ _: 3, md: 4 }}
    >
      <div css={css({ my: 2 })}>
        <Box
          width={CONTAINER_WIDTH}
          height={CONTAINER_HEIGHT}
          position="relative"
        >
          <TickCircle
            numTicks={tickCount}
            currentTick={counter % tickCount}
            tickDuration={tickDuration}
            tickWidth={2}
            tickLength={10}
          />

          <Box
            position="absolute"
            top="calc(50% - 35px)"
            left="calc(50% - 35px)"
          >
            <Shapes counter={counter} tickDuration={tickDuration} />
          </Box>
        </Box>
      </div>

      <Box my={2} pl={{ xs: 3, md: 4 }}>
        <Text fontSize="1.625rem" m={0}>
          {replaceComponentsInText(siteText.vaccinaties.clock.title, {
            seconds: (
              <InlineText color={colors.data.primary} fontWeight="bold">
                {formatPercentage(data.seconds_per_dose)}
              </InlineText>
            ),
          })}
        </Text>
        <Text m={0}>
          {replaceComponentsInText(siteText.vaccinaties.clock.description, {
            amount: (
              <InlineText color={colors.data.primary} fontWeight="bold">
                {formatNumber(data.doses_per_day)}
              </InlineText>
            ),
          })}
        </Text>
      </Box>
    </Box>
  );
}

function TickCircle({
  numTicks,
  currentTick,
  tickDuration,
  tickWidth,
  tickLength,
}: {
  numTicks: number;
  currentTick: number;
  tickDuration: number;
  tickWidth: number;
  tickLength: number;
}) {
  const stepRadius = (2 * Math.PI) / numTicks;
  const stepDegree = 360 / numTicks;

  return (
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
      {Array(numTicks)
        .fill(null)
        .map((_, index) => (
          <Tick
            rotation={index * stepDegree + 360 / numTicks}
            angle={Math.PI / 2 + stepRadius * (index + 1)}
            index={index}
            key={index}
            tickDuration={tickDuration}
            isLast={index === numTicks - 1}
            tickWidth={tickWidth}
            tickLength={tickLength}
            isSelected={
              currentTick === numTicks - 1 && index !== numTicks - 1
                ? false
                : index <= currentTick
            }
          />
        ))}
    </div>
  );
}

function Tick({
  index,
  angle,
  rotation,
  isSelected,
  isLast,
  tickDuration,
  tickWidth,
  tickLength,
}: {
  index: number;
  angle: number;
  rotation: number;
  isSelected: boolean;
  isLast: boolean;
  tickDuration: number;
  tickWidth: number;
  tickLength: number;
}) {
  const translateX =
    RADIUS * Math.cos(angle) - tickWidth / 2 + CONTAINER_WIDTH / 2;
  const translateY =
    RADIUS * Math.sin(angle) - tickLength / 2 + CONTAINER_HEIGHT / 2;

  return (
    <div
      style={{
        position: 'absolute',
        transform: `
          translate(${translateX}px, ${translateY}px)
          rotate(${rotation}deg)
        `,
        width: tickWidth,
        height: tickLength,
        backgroundColor: isSelected ? colors.data.primary : '#e7e7e7',
        transitionProperty: 'background-color',
        transitionDuration: isSelected ? `${tickDuration / 2}ms` : '600ms',
        transitionDelay: isSelected
          ? '0ms'
          : `${index * 25 - (isLast ? tickDuration : 0)}ms`,
      }}
    />
  );
}

function Shapes({
  counter,
  tickDuration,
}: {
  counter: number;
  tickDuration: number;
}) {
  const shapes = useShapes();
  const currentShapeIndex = counter % shapes.length;

  return (
    <svg width="70" height="70" viewBox="0 0 40 40">
      {shapes.map((path, index) => (
        <path
          key={index}
          d={path}
          fill={colors.data.primary}
          style={{
            opacity: currentShapeIndex === index ? 1 : 0,
            transitionProperty: 'opacity',
            transitionDuration: `${tickDuration / 2}ms`,
          }}
        />
      ))}
    </svg>
  );
}

function useShapes() {
  /**
   * Shapes is initially an empty array to prevent a server-side rendered
   * particular shape. On mount we'll populate the array with a randomized order.
   */
  const [shapes, setShapes] = useState<string[]>([]);

  useEffect(
    () =>
      setShapes(
        shuffle([
          // id: 1
          'M31.8 29.7653C31.2 29.1653 30.1 28.4653 28.9 27.7653C27.3 26.8653 25.5 26.1653 24.6 25.7653C24.2 25.6653 24 25.2653 23.9 24.8653C23.8 24.3653 23.7 23.5653 23.7 22.9653C26.1 22.8653 28.1 22.5653 28.9 22.2653C29 22.1653 28 18.8653 27.5 16.5653C27.4 16.0653 27.3 15.6653 27.3 15.3653C27.3 14.9653 27.2 14.4653 27.2 13.9653C27 11.4653 26.8 8.56531 25.9 6.56531C25.1 4.86531 23.7 3.86531 21.3 4.76531C21.3 4.76531 19.2 3.26531 16.9 4.46531C16.2 4.86531 15.5 5.46531 14.8 6.46531C13.2 8.86531 13.1 11.7653 13.2 13.9653C13.2 14.5653 13.2 15.0653 13.2 15.4653C13.2 15.7653 13.1 16.1653 13 16.6653C12.5 18.6653 11.5 21.9653 11.6 21.9653C12.5 22.2653 14.5 22.5653 16.8 22.7653C16.8 23.2653 16.6 24.6653 16.5 24.7653C16.4 25.1653 16.2 25.5653 15.8 25.6653C15.4 25.8653 12.4 27.1653 11.5 27.6653C10.3 28.2653 9.2 28.9653 8.6 29.6653C7.1 31.5653 7 37.3653 7 37.3653C9.6 37.3653 30.5 37.3653 33.5 37.3653C33.5 37.3653 33.4 31.5653 31.8 29.7653Z',

          // id: 2
          'M4 37.1927C4 37.1927 5 30.3927 6.8 28.4927C7.6 27.6927 9.3 26.8927 11 26.1927C12.6 25.4927 14.3 24.9927 15.2 24.6927C15.3 24.4927 15.3 24.1927 15.4 23.9927C15.5 23.5927 15.6 23.1927 15.6 22.7927C15.1 22.2927 14.7 21.6927 14.3 21.0927C13.8 20.2927 13.5 19.3927 13.4 18.3927C12.3 18.0927 12.2 15.8927 12 15.0927C11.7 13.5927 12.6 13.6927 12.7 13.6927C12.5 12.3927 12.1 8.09271 13.3 6.69271C14.3 5.49271 16.1 4.79271 17.8 4.29271C20.2 3.69271 21.1 4.09271 22.5 4.79271C24.6 4.29271 25.7 4.99271 26.6 6.59271C27.6 8.19271 27.1 12.3927 26.9 13.6927C27 13.6927 27.9 13.6927 27.6 15.0927C27.4 15.8927 27.4 18.0927 26.2 18.3927C26.1 19.1927 25.8 19.8927 25.5 20.5927C25.1 21.3927 24.6 22.1927 23.9 22.8927C24 23.2927 24 23.6927 24.1 24.0927C24.2 24.2927 24.2 24.4927 24.3 24.7927C25.2 25.0927 26.9 25.6927 28.5 26.3927C30.3 27.0927 32 27.9927 32.7 28.6927C34.5 30.4927 35.5 37.3927 35.5 37.3927H4V37.1927Z',

          // id: 3
          'M12.5625 8.60188C12.3516 10.3792 12.5664 12.5433 12.6992 13.4027C12.6367 13.4027 12.2227 13.3597 12.0352 13.7581C11.9375 13.9652 11.8984 14.2894 12 14.8011C12.1914 15.5784 12.293 17.6644 13.2969 18.0667C13.1094 19.1761 12.7227 20.2034 12.5234 20.7269C12.4336 20.9613 12.3828 21.098 12.4023 21.098C12.875 21.2542 13.7227 21.4144 14.793 21.5238C15.043 21.8714 15.3047 22.2034 15.6016 22.5003C15.6016 22.7113 15.5742 22.9222 15.5312 23.1331L15.3984 23.7034C15.3672 23.7698 15.3438 23.848 15.3242 23.93C15.2891 24.0941 15.2656 24.2698 15.1992 24.4027C14.3008 24.7034 12.6016 25.2034 11 25.9027C9.78516 26.4027 8.57031 26.9573 7.67969 27.5238L7.30469 27.7816L7.00781 28.0159L6.80078 28.2034C6.17578 28.8597 5.64844 30.1058 5.22656 31.4534C4.42578 33.9964 4 36.9027 4 36.9027V37.1019H35.5C35.5 37.1019 34.5 30.2034 32.6992 28.4027C32 27.7034 30.3008 26.8011 28.5 26.1019C27.2969 25.5745 26.0352 25.1058 25.1055 24.7777L24.3008 24.5003C24.2539 24.3675 24.2305 24.2542 24.207 24.1488C24.1797 24.0238 24.1562 23.9105 24.1016 23.8011L24.043 23.5198L24 23.2034C23.9766 23.0003 23.9492 22.8011 23.8984 22.6019C24.2344 22.2659 24.5195 21.9105 24.7773 21.5394C25.9336 21.43 26.8906 21.262 27.3008 21.098C27.3203 21.098 27.2695 20.9613 27.1797 20.7269C26.9766 20.1956 26.5859 19.1605 26.4023 18.0316C26.8438 17.8206 27.0898 17.3089 27.2461 16.7425C27.3633 16.3206 27.4297 15.8675 27.4844 15.4808C27.5234 15.2113 27.5586 14.973 27.6016 14.8011C27.8984 13.4027 27 13.4027 26.8984 13.4027C27.0195 12.6331 27.2422 10.848 27.1992 9.18781C27.2266 8.20344 27.0156 7.20344 26.6016 6.30109C25.6406 4.20344 23.6094 2.68 21.0859 3.40656C19.9727 2.60969 18.7109 2.24641 17.5977 2.09406C15.9297 1.8675 14.5977 2.12141 14.5977 2.12141C14.7227 2.24641 14.8359 2.37531 14.9375 2.50031C15.043 2.63313 15.1367 2.76594 15.2188 2.89094C15.5 3.30891 15.6406 3.64094 15.6406 3.64094C14.6406 4.08625 13.8555 4.57844 13.2422 5.07844C12.3398 5.81672 11.7969 6.57453 11.4727 7.23859C10.9141 8.38313 11.0039 9.24641 11.0039 9.24641C11.0039 9.24641 11.6992 8.66438 12.1641 8.54719L12.5625 8.60188Z',

          // id: 4
          'M32.2801 27.9409C31.5357 27.1264 29.0837 25.6493 27.5729 24.5122C26.2812 26.5729 25.9583 26.8958 25.3125 27.2188C25.6354 26.6492 25.9583 26.5729 26.6042 24.7787C28.1773 21.9426 28.5417 18.0509 28.5417 14.2378C28.5417 7.63876 24.4935 3 19.5 3C14.5065 3 10.4583 7.63876 10.4583 14.2378C10.1354 23.9896 11.1042 24.7787 10.8415 24.5122C9.21698 25.7229 7.52289 27.0623 6.71986 27.9409C4.93846 29.8897 4 37.2292 4 37.2292H35C35 37.2292 34.0615 29.8897 32.2801 27.9409Z',

          // id: 5
          'M22.7031 7.91406C22.8945 7.48047 23 7 23 6.5C23 4.56641 21.4336 3 19.5 3C18.3477 3 17.3242 3.55469 16.6875 4.41406C16.2539 4.99609 16 5.71875 16 6.5C16 7.19531 16.2031 7.84375 16.5508 8.38672C15.4922 8.78516 14.5039 9.28125 14 9.88672C12.8008 11.3867 12.5 14.1875 12.6992 15.4844H12.5C12.3047 15.5508 12.1523 15.7852 12.0664 16.1641C12.0234 16.3672 12 16.6094 12 16.8867C12 17.6875 12.1016 21.6875 13.5 20.7852C13.7344 21.7266 13.7344 22.5312 13.9648 23.3906C14.1953 24.2422 14.6562 25.1484 15.8008 26.2852C15.8008 26.5859 15.6094 26.7656 15.3984 26.7852L14.5469 26.8672C12.168 27.0859 8.125 27.4609 6.80078 28.7852C5 30.5859 4 37.0859 4 37.0859H35.6992C35.6992 37.0859 33.6992 29.6875 31.8984 27.8867C31.0234 27.0117 29.1289 26.7148 27.3242 26.6211C26.0352 26.5508 24.793 26.5859 24 26.5859C23.793 26.5859 23.8008 26.5039 23.8008 26.2852C25.4062 24.4805 25.75 22.9375 26.1992 20.6875C27.5 20.6875 27.6016 17.6875 27.6016 16.8867C27.6016 16.4062 27.5273 16.0352 27.4062 15.793C27.3242 15.6289 27.2188 15.5234 27.1016 15.4844H26.8008C26.9062 14.8047 26.8164 13.6367 26.5664 12.4453C26.3398 11.3633 25.9766 10.2617 25.5 9.5C25.1797 8.96484 23.9883 8.33594 22.7031 7.91406Z',

          //id: 6
          'M13.3055 11.0993C11.4826 10.9748 9.17971 10.6884 9.10216 9.68021C9.00216 7.68021 21.5022 2.28021 24.6022 3.08021C26.5022 3.68021 27.3022 6.58021 27.6022 8.68021C27.6486 8.89672 27.3721 9.11324 26.8715 9.32346C27.3481 11.2478 26.9681 14.3886 26.8 15.4812H27.1C27.4 15.5812 27.6 16.0812 27.6 16.8812C27.6 17.6812 27.5 20.6812 26.2 20.6812C26.1652 20.8552 26.1546 21.0534 26.143 21.2717C26.1212 21.6805 26.0956 22.1596 25.9 22.6812C25.8292 22.9646 25.7708 23.248 25.7162 23.5136C25.6166 23.9978 25.5292 24.4229 25.4 24.6812C25.2596 24.8684 25.141 25.0447 25.0316 25.2075C24.6735 25.7401 24.4128 26.128 23.8 26.2812C23.8 26.2909 23.8001 26.3003 23.8001 26.3095C23.8004 26.507 23.8005 26.5812 24 26.5812C24.1816 26.5812 24.387 26.5793 24.6113 26.5773C26.7329 26.5585 30.5434 26.5246 31.9 27.8812C33.7 29.6812 35.7 37.0812 35.7 37.0812H4C4 37.0812 5 30.5812 6.8 28.7812C8.12298 27.4582 12.1692 27.0833 14.5461 26.8631C14.8641 26.8337 15.1523 26.807 15.4 26.7812C15.6102 26.7592 15.8 26.5812 15.8 26.2812C15.1963 26.0548 14.8773 25.6575 14.6282 25.3473C14.5472 25.2464 14.4736 25.1548 14.4 25.0812C14.1382 24.7539 14.0478 24.341 13.9324 23.8144C13.8715 23.5364 13.8037 23.2267 13.7 22.8812C13.651 22.6364 13.6261 22.2238 13.6016 21.8194C13.576 21.3979 13.551 20.9853 13.5 20.7812C12.1 21.6812 12 17.6812 12 16.8812C12 16.0812 12.2 15.5812 12.5 15.4812H12.7C12.5464 14.4826 12.6878 12.5989 13.3055 11.0993Z',
        ])
      ),
    []
  );

  return shapes;
}
