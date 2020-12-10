import HighchartsLibrary from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

if (typeof HighchartsLibrary === 'object') {
  require('highcharts/highcharts-more')(HighchartsLibrary);
}

export function Highcharts({ options }: { options: Highcharts.Options }) {
  return <HighchartsReact highcharts={HighchartsLibrary} options={options} />;
}
