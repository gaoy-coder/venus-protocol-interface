// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'styl... Remove this comment to see the full error message
import styled from 'styled-components';

export const Card = styled.div`
  height: 100%;
  display: flex;
  border-radius: 24px;
  margin: 8px;
  padding: 0px;
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
  flex-direction: ${({ direction }: $TSFixMe) => direction};
  justify-content: center;
`;
