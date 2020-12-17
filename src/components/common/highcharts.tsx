import HighchartsLibrary from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

if (typeof HighchartsLibrary === 'object') {
  require('highcharts/highcharts-more')(HighchartsLibrary);
}

interface HighchartsWrapperProps {
  options: Highcharts.Options;
}

export function HighchartsWrapper({ options }: HighchartsWrapperProps) {
  return <HighchartsReact highcharts={HighchartsLibrary} options={options} />;
}
