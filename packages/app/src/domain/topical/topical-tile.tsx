import css from "@styled-system/css"
import styled from "styled-components"
import { Box } from "~/components-styled/base";
import { TopicalRow } from "./topical-row";

export const TopicalTile = styled(Box).attrs({ as: 'article' })(
  css({
    pl: '3em',
    [`${TopicalRow} &`]: {
      flex: '1 0 30%'
    }
  })
);
