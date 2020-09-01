import { FCWithLayout } from 'components/layout';
import {
  getNationalLayout,
  NationalLayoutProps,
} from 'components/layout/NationalLayout';

const National: FCWithLayout<NationalLayoutProps> = () => {
  return null;
};

National.getLayout = getNationalLayout();

export default National;
