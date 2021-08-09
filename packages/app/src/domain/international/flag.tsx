import css from '@styled-system/css';

interface FlagProps {
  countryCode: string;
  width?: number;
  height?: number;
}

export function Flag({ countryCode, width = 17, height = 13 }: FlagProps) {
  return (
    <img
      aria-hidden
      src={`/icons/flags/${countryCode.toLowerCase()}.svg`}
      width={width}
      height={height}
      alt=""
      css={css({
        border: '1px solid',
        borderColor: 'lightGray',
      })}
    />
  );
}
