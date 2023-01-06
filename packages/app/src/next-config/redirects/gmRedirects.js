/**
 * When municipal reorganizations happened we want to redirect to the new municipality when
 * using the former municipality code. `from` contains the old municipality codes and `to` is
 * the new municipality code to link to.
 */
const gmRedirects = [
  {
    from: ['0370'],
    to: '0439',
  },
  {
    from: ['0398', '0416'],
    to: '1980',
  },
  {
    from: ['1685', '0856'],
    to: '1991',
  },
  {
    from: ['0756', '1684', '0786', '0815', '1702'],
    to: '1982',
  },
  {
    from: ['0457'],
    to: '0363',
  },
  {
    from: ['0501', '0530', '0614'],
    to: '1992',
  },
];

module.exports = {
  gmRedirects,
};
