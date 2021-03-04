import { NlVaccineAdministeredRateMovingAverageValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { useEffect, useState } from 'react';
import { Box } from '~/components-styled/base';
import { Heading, InlineText, Text } from '~/components-styled/typography';
import siteText from '~/locale';
import { colors } from '~/style/theme';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';

const ITEM_WIDTH = 2;
const ITEM_HEIGHT = 10;
const RADIUS = 55;

const CONTAINER_WIDTH = RADIUS * 2 + 12;
const CONTAINER_HEIGHT = RADIUS * 2 + 12;

interface VaccineTickerProps {
  data: NlVaccineAdministeredRateMovingAverageValue;
}

export function VaccineTicker({ data }: VaccineTickerProps) {
  const tickDuration = data.seconds_per_dose * 1000;
  const tickCount = Math.floor(data.doses_per_second * 60);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setCounter((x) => x + 1), tickDuration);
    return () => window.clearInterval(id);
  }, [tickDuration]);

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
          />

          <Box
            position="absolute"
            top="calc(50% - 20px)"
            left="calc(50% - 20px)"
          >
            <Shapes counter={counter} tickDuration={tickDuration} />
          </Box>
        </Box>
      </div>

      <Box my={2} pl={{ xs: 3, md: 4 }}>
        <Heading level={3}>
          {replaceComponentsInText(siteText.vaccinaties.clock.title, {
            seconds: (
              <InlineText color={colors.data.primary} fontWeight="bold">
                {formatPercentage(data.seconds_per_dose)}
              </InlineText>
            ),
          })}
        </Heading>
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
}: {
  numTicks: number;
  currentTick: number;
  tickDuration: number;
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
            deg={index * stepDegree + 360 / numTicks}
            angle={Math.PI / 2 + stepRadius * (index + 1)}
            index={index}
            key={index}
            tickDuration={tickDuration}
            isLast={index === numTicks - 1}
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
  deg,
  isSelected,
  isLast,
  tickDuration,
}: {
  index: number;
  angle: number;
  deg: number;
  isSelected: boolean;
  isLast: boolean;
  tickDuration: number;
}) {
  const translateX =
    RADIUS * Math.cos(angle) - ITEM_WIDTH / 2 + CONTAINER_WIDTH / 2;
  const translateY =
    RADIUS * Math.sin(angle) - ITEM_HEIGHT / 2 + CONTAINER_HEIGHT / 2;

  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate(
                    ${translateX}px,
                    ${translateY}px
                  )
                  rotate(${deg}deg)`,
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        backgroundColor: isSelected ? colors.data.primary : colors.data.neutral,
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
  const currentShapeIndex = counter % shapes.length;
  return (
    <svg width="40" height="40" viewBox="0 0 40 40">
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

const shapes = [
  'M31.8 29.7653C31.2 29.1653 30.1 28.4653 28.9 27.7653C27.3 26.8653 25.5 26.1653 24.6 25.7653C24.2 25.6653 24 25.2653 23.9 24.8653C23.8 24.3653 23.7 23.5653 23.7 22.9653C26.1 22.8653 28.1 22.5653 28.9 22.2653C29 22.1653 28 18.8653 27.5 16.5653C27.4 16.0653 27.3 15.6653 27.3 15.3653C27.3 14.9653 27.2 14.4653 27.2 13.9653C27 11.4653 26.8 8.56531 25.9 6.56531C25.1 4.86531 23.7 3.86531 21.3 4.76531C21.3 4.76531 19.2 3.26531 16.9 4.46531C16.2 4.86531 15.5 5.46531 14.8 6.46531C13.2 8.86531 13.1 11.7653 13.2 13.9653C13.2 14.5653 13.2 15.0653 13.2 15.4653C13.2 15.7653 13.1 16.1653 13 16.6653C12.5 18.6653 11.5 21.9653 11.6 21.9653C12.5 22.2653 14.5 22.5653 16.8 22.7653C16.8 23.2653 16.6 24.6653 16.5 24.7653C16.4 25.1653 16.2 25.5653 15.8 25.6653C15.4 25.8653 12.4 27.1653 11.5 27.6653C10.3 28.2653 9.2 28.9653 8.6 29.6653C7.1 31.5653 7 37.3653 7 37.3653C9.6 37.3653 30.5 37.3653 33.5 37.3653C33.5 37.3653 33.4 31.5653 31.8 29.7653Z',
  'M4 37.1927C4 37.1927 5 30.3927 6.8 28.4927C7.6 27.6927 9.3 26.8927 11 26.1927C12.6 25.4927 14.3 24.9927 15.2 24.6927C15.3 24.4927 15.3 24.1927 15.4 23.9927C15.5 23.5927 15.6 23.1927 15.6 22.7927C15.1 22.2927 14.7 21.6927 14.3 21.0927C13.8 20.2927 13.5 19.3927 13.4 18.3927C12.3 18.0927 12.2 15.8927 12 15.0927C11.7 13.5927 12.6 13.6927 12.7 13.6927C12.5 12.3927 12.1 8.09271 13.3 6.69271C14.3 5.49271 16.1 4.79271 17.8 4.29271C20.2 3.69271 21.1 4.09271 22.5 4.79271C24.6 4.29271 25.7 4.99271 26.6 6.59271C27.6 8.19271 27.1 12.3927 26.9 13.6927C27 13.6927 27.9 13.6927 27.6 15.0927C27.4 15.8927 27.4 18.0927 26.2 18.3927C26.1 19.1927 25.8 19.8927 25.5 20.5927C25.1 21.3927 24.6 22.1927 23.9 22.8927C24 23.2927 24 23.6927 24.1 24.0927C24.2 24.2927 24.2 24.4927 24.3 24.7927C25.2 25.0927 26.9 25.6927 28.5 26.3927C30.3 27.0927 32 27.9927 32.7 28.6927C34.5 30.4927 35.5 37.3927 35.5 37.3927H4V37.1927Z',
];
