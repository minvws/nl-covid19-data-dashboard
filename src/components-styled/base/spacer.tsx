import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';

/**
 * A generic spacer element.
 *
 * See: https://styled-system.com/guides/spacing/
 *
 * This could also be done with Box, but it helps to have some more specific
 * components with clear semantics, so that the final markup is more readable.
 * It is clear what a Spacer does, but a Box can have any function.
 */
type SpacerProps = SpaceProps;

export const Spacer = styled.div<SpacerProps>(space);
