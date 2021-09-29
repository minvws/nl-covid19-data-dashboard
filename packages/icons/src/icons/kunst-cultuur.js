import React, { forwardRef } from 'react';

const KunstCultuur = forwardRef(({ ...rest }, ref) => {
  return (
    <svg ref={ref} width={36} height={36} fill="none" {...rest}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.467 13.562s.852-1.058 1.905-1.058c1.052 0 1.905 1.058 1.905 1.058s-.853 1.059-1.905 1.059c-1.053 0-1.905-1.059-1.905-1.059Zm-1.27 5.436c-.967 0-1.847.292-2.519.775.155-1.017 1.223-1.805 2.519-1.805s2.364.788 2.519 1.805c-.672-.483-1.552-.775-2.52-.775Zm-5.08-5.436s.853-1.058 1.905-1.058 1.905 1.058 1.905 1.058-.853 1.059-1.905 1.059-1.905-1.059-1.905-1.059ZM19.393 9.54S15.605 9.117 12.196 7C8.789 9.117 5 9.54 5 9.54c0 7.62 1.136 11.853 7.197 13.97 6.06-2.117 7.196-6.35 7.196-13.97Zm5.751 12.059c-.996-.338-1.464-1.613-1.464-1.613s1.147-.728 2.143-.39c.997.337 1.465 1.613 1.465 1.613s-1.148.728-2.144.39Zm-4.673 3.897c-1.227-.415-1.986-1.505-1.806-2.516.482.67 1.221 1.232 2.137 1.542.915.311 1.843.315 2.634.074-.473.914-1.737 1.315-2.965.9Zm4.113-12.132c-1.59.37-3.143.453-4.433.422-.131 1.355-.347 2.585-.682 3.696.114.013.228.037.34.074.997.338 1.465 1.615 1.465 1.615s-1.147.728-2.144.39a1.666 1.666 0 0 1-.402-.204c-.749 1.483-1.824 2.697-3.347 3.667.373 2.24 1.568 4.153 3.902 5.976 6.42-.06 8.855-3.703 11.3-10.92 0 0-3.45-1.616-6-4.716Z"
        fill="#000"
      />
    </svg>
  );
});

KunstCultuur.displayName = 'KunstCultuur';

export default KunstCultuur;
