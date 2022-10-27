import { colors } from "@corona-dashboard/common";
import { ICON_COLOR_GREEN, ICON_COLOR_RED } from "~/domain/topical/common";

/**
 * Match strings from Sanity to certain color codes
 */

export const mapStringToColors = (color: string | undefined) => {
    switch (color) {
      case ICON_COLOR_RED:
        return colors.red2;
      case ICON_COLOR_GREEN:
        return colors.green3;
    }
  };