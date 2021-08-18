import { colors } from '~/style/theme';

const GREEN = colors.data.gradient.green;
const YELLOW = colors.data.gradient.yellow;
const RED = colors.data.gradient.red;

export const positiveTestedBarScale = {
  min: 0,
  max: 10,
  signaalwaarde: 7,
  gradient: [
    {
      color: GREEN,
      value: 0,
    },
    {
      color: YELLOW,
      value: 7,
    },
    {
      color: RED,
      value: 10,
    },
  ],
};

export const reproductionBarScale = {
  min: 0,
  max: 2,
  signaalwaarde: 1,
  gradient: [
    {
      color: GREEN,
      value: 0,
    },
    {
      color: GREEN,
      value: 1,
    },
    {
      color: YELLOW,
      value: 1.0104,
    },
    {
      color: RED,
      value: 1.125,
    },
  ],
};

export const hospitalAdmissionsBarScale = {
  min: 0,
  max: 100,
  signaalwaarde: 40,
  gradient: [
    {
      color: GREEN,
      value: 0,
    },
    {
      color: YELLOW,
      value: 40,
    },
    {
      color: RED,
      value: 90,
    },
  ],
};

export const intensiveCareBarScale = {
  min: 0,
  max: 30,
  signaalwaarde: 10,
  gradient: [
    {
      color: GREEN,
      value: 0,
    },
    {
      color: YELLOW,
      value: 10,
    },
    {
      color: RED,
      value: 20,
    },
  ],
};
