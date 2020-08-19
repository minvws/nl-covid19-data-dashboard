import { useRouter } from 'next/router';

import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';

const Metric: FCWithLayout = () => {
  const router = useRouter();
  const { metric } = router.query;

  return <p>Lots of data yo. {metric}</p>;
};

Metric.getLayout = getNationalLayout();

export default Metric;
