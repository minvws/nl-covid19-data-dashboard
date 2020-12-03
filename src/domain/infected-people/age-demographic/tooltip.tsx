import { ReactChildren } from "react";


interface TooltipProps {
  children: Element;
}



// @TODO move this tooltip logic elsewhere
// And combine with keyboard logic

export function getTooltipEventHandlers(coordinates) {
  const timer = -1;

  const debounceSetTooltip = useCallback(
    (options: TooltipOptions | undefined) => {
      if (timer > -1) {
        window.clearTimeout(timer);
      }

      timer = window.setTimeout(() => setTooltip(options), 100);
    },
    []
  );

  const openTooltip = useCallback(
    (
      event: MouseEvent<SVGGElement>,
      value: NationalInfectedAgeGroupsValue
    ) => {
      const { x, y } = coordinates.getTooltipCoordinates(event, value);
      const options: TooltipOptions = { left: x, top: y, value };
      debounceSetTooltip(options);
    },
    [debounceSetTooltip, coordinates]
  );

  const closeTooltip = useCallback(() => {
    debounceSetTooltip(undefined);
  }, [debounceSetTooltip]);

  return { openTooltip, closeTooltip }
}





export function Tooltip({ children }: TooltipProps) {

  return <div>{children}</div>
}