import css from '@styled-system/css';

interface InternationalFlagProps {
  country_code: string;
  width?: number;
  height?: number;
}

export function InternationalFlag({
  country_code,
  width = 17,
  height = 13,
}: InternationalFlagProps) {
  return (
    <img
      aria-hidden
      src={`/icons/flags/${country_code.toLowerCase()}.svg`}
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
