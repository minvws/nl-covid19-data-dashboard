import { useRouter } from 'next/router';
import { ComboBox } from '~/components/combo-box/combo-box';
import { gmData } from '~/data/gm';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';

interface GmComboBoxProps {
  getLink?: (gmcode: string) => string;
}

export function GmComboBox(props: GmComboBoxProps) {
  const { getLink } = props;

  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();
  const router = useRouter();

  return (
    <ComboBox
      placeholder={siteText.common.zoekveld_placeholder_gemeente}
      options={gmData}
      onSelect={({ gemcode }) => {
        router.push(
          typeof getLink === 'function'
            ? getLink(gemcode)
            : reverseRouter.gm.index(gemcode)
        );
      }}
    />
  );
}
