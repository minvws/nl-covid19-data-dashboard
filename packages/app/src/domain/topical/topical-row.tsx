import css from "@styled-system/css";
import styled from "styled-components";
import { Box } from "~/components-styled/base";
import { asResponsiveArray } from "~/style/utils";

export const TopicalRow = styled(Box)(
  css({
    display: 'flex',
    flexDirection: asResponsiveArray({ _: 'column', md: 'row' })
  })
);
