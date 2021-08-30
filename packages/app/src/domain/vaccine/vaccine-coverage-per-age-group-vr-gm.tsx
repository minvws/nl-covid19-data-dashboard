import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { Markdown } from '~/components/markdown';
import { InlineText } from '~/components/typography';
import { asResponsiveArray } from '~/style/utils';
export function VaccineCoveragePerAgeGroupVrGm() {
  return (
    <ChartTile title={'title'} description={'description'}>
      <Box overflow="auto" spacing={3}>
        <StyledTable>
          <thead>
            <Row>
              <HeaderCell>Leeftijdsgroep</HeaderCell>
              <HeaderCell
                css={css({
                  textAlign: 'right',
                })}
              >
                Vaccinatiegraad binnen groep
              </HeaderCell>
              <HeaderCell
                css={css({
                  textAlign: 'right',
                })}
              >
                Aantal mensen met tenminste 1 prik*
              </HeaderCell>
            </Row>
          </thead>
          <tbody>
            <Row>
              <Cell>
                <Box
                  display="flex"
                  flexDirection="column"
                  fontWeight="bold"
                  textAlign="left"
                >
                  18 jaar en ouder
                  <InlineText fontWeight="normal" variant="label2">
                    2003 en eerder
                  </InlineText>
                </Box>
              </Cell>
              <Cell>
                <InlineText fontWeight="bold">79%</InlineText>
              </Cell>

              <Cell>90% of meer</Cell>
            </Row>

            <Row>
              <Cell>
                <Box
                  display="flex"
                  flexDirection="column"
                  fontWeight="bold"
                  textAlign="left"
                >
                  18 jaar en ouder
                  <InlineText fontWeight="normal" variant="label2">
                    2003 en eerder
                  </InlineText>
                </Box>
              </Cell>
              <Cell>
                <InlineText fontWeight="bold">79%</InlineText>
              </Cell>

              <Cell>90% of meer</Cell>
            </Row>
          </tbody>
        </StyledTable>

        <Box maxWidth="maxWidthText" color="annotation">
          <Markdown
            content="&ast; Onder deze groep vallen alle mensen die minstens 1 prik hebben
            gehad. Dit kunnen ook mensen zijn die inmiddels een tweede prik
            hebben gehad of mensen die maar 1 prik hebben gehaald vanwege een
            doorgemaakte besmetting. Lees hier meer over in de
            [cijferverantwoording](https://www.google.com)"
          ></Markdown>
        </Box>
      </Box>
    </ChartTile>
  );
}

const StyledTable = styled.table(
  css({
    borderCollapse: 'collapse',
    width: '100%',
  })
);

const Row = styled.tr(
  css({
    borderTop: '1px solid',
    borderColor: 'border',
  })
);

const commonCellStyles = {
  pr: asResponsiveArray({ _: 3, sm: 4, lg: 5 }),

  '&:last-child': {
    pr: asResponsiveArray({ _: 0, sm: 4, lg: 5 }),
  },
} as React.CSSProperties;

const HeaderCell = styled.th(
  css({
    ...commonCellStyles,
    textAlign: 'left',
    fontWeight: 'normal',

    pb: 2,
  })
);

const Cell = styled.td(
  css({
    ...commonCellStyles,
    verticalAlign: 'middle',
    textAlign: 'right',
    width: 'auto',
    alignItems: 'center',
    py: 3,
  })
);
