import Chevron from '~/assets/chevron.svg';
import { Link } from '~/utils/link';

type ReadMoreLinkProps = {
  text: string;
  route: string;
};

export function ReadMoreLink({ text, route }: ReadMoreLinkProps) {
  return (
    <Link href={route}>
      <a>{text}</a> <Chevron width="14px" height="14px" />
    </Link>
  );
}
