import IconKeepDistance from '~/assets/afstand.svg';
import IconMaxVisitorsHome from '~/assets/bezoekers.svg';
import IconSneezeCoughElbow from '~/assets/elleboog.svg';
import IconWashHands from '~/assets/handenwassen.svg';
import IconWearMaskPublicIndoors from '~/assets/mondkapje.svg';
import IconSymptomsGetTested from '~/assets/testen.svg';
import IconSymptomsStayHome from '~/assets/thuisblijven.svg';
import IconWorkFromHome from '~/assets/thuiswerken.svg';
import IconAvoidCrowds from '~/assets/vermijd.svg';
const IconWearMaskPublicTransport = IconWearMaskPublicIndoors;

export type BehaviorSubject =
  | 'wash_hands'
  | 'keep_distance'
  | 'work_from_home'
  | 'avoid_crowds'
  | 'symptoms_stay_home'
  | 'symptoms_get_tested'
  | 'wear_mask_public_indoors'
  | 'wear_mask_public_transport'
  | 'sneeze_cough_elbow'
  | 'max_visitors';

export interface BehaviorIconProps {
  subject: BehaviorSubject;
}

export function BehaviorIcon({
  subject,
}: BehaviorIconProps): React.FunctionComponent {
  switch (subject) {
    case 'wash_hands':
      return IconWashHands;
    case 'keep_distance':
      return IconKeepDistance;
    case 'work_from_home':
      return IconWorkFromHome;
    case 'avoid_crowds':
      return IconAvoidCrowds;
    case 'symptoms_stay_home':
      return IconSymptomsStayHome;
    case 'symptoms_get_tested':
      return IconSymptomsGetTested;
    case 'wear_mask_public_indoors':
      return IconWearMaskPublicIndoors;
    case 'wear_mask_public_transport':
      return IconWearMaskPublicTransport;
    case 'sneeze_cough_elbow':
      return IconSneezeCoughElbow;
    case 'max_visitors':
      return IconMaxVisitorsHome;
    default:
      throw new Error(`Invalid behavior subject: ${subject}`);
  }
}
