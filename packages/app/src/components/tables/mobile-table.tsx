// import { AgeGroup } from '~/domain/vaccine/components/age-group';
// import { Bar } from '~/domain/vaccine/components/bar';
// import { BoldText, InlineText } from '~/components/typography';
// import { Box, Spacer } from '~/components/base';
// import { COLOR_FULLY_VACCINATED, COLOR_AUTUMN_2022_SHOT } from '~/domain/vaccine/common';
// import { fontSizes, space } from '~/style/theme';
// import { formatAgeGroupString } from '~/utils/format-age-group-string';
// import { formatBirthyearRangeString } from '~/utils/format-birthyear-range-string';
// import { NarrowPercentage } from '~/domain/vaccine/components/narrow-percentage';
// import { NlBehaviorValue, VrBehaviorArchived_20221019Value } from '@corona-dashboard/common';
// import { SiteText } from '~/locale';
// import { useIntl } from '~/intl';
// import styled from 'styled-components';
// import { BehaviorIcon } from '~/domain/behavior/components/behavior-icon';

// interface MobileTableProps {
//   text: SiteText['pages']['vaccinations_page']['nl']['vaccination_coverage'] | string;
//   values: NlBehaviorValue | VrBehaviorArchived_20221019Value;
//   hasAgeGroups?: boolean;
//   isBehaviourTable?: boolean;
// }

// export const MobileTable = ({ values, text, hasAgeGroups, isBehaviourTable }: MobileTableProps) => {
//   const { commonTexts, formatPercentage } = useIntl();

//   return (
//     <Box>
//       <StyledTable>
//           <thead>
//             <Row>
//               <HeaderCell width={{_: '100%', md: 'auto', lg: '300px', xl: '400px'}}>
//                 {text.header}
//               </HeaderCell>
//             </Row>
//           </thead>

//           <tbody>
//             {values.map((item, _index) => (
//               <>
//                 {/* Mobile/narrow screens */}
//                 <Row key={item.id} display={{ _: 'flex', md: 'none' }}>
//                   <Cell minWidth={{ _: '100%' }}>
//                     <Box display="flex" margin={`0 ${space[2]} ${space[2]}`}>
//                       { isBehaviourTable &&
//                         <>
//                           <Box minWidth="32px" color="black" paddingRight={space[2]} display="flex">
//                             <BehaviorIcon name={item.id} size={25} />
//                           </Box>

//                           <StyledAnchor as="button" underline="hover" color="black" onClick={() => anchorButtonClickHandler(item.id, scrollRef)}>
//                             <Box as="span" display="flex" alignItems="center" textAlign="left" flexWrap="wrap">
//                               <InlineText>{item.description}</InlineText>
//                             </Box>
//                           </StyledAnchor>
//                         </>
//                       }

//                       { hasAgeGroups &&
//                         <AgeGroup
//                           range={formatAgeGroupString(item.age_group_range, commonTexts.common.agegroup)}
//                           ageGroupTotal={'age_group_total' in item ? item.age_group_total : undefined}
//                           birthyear_range={formatBirthyearRangeString(item.birthyear_range, commonTexts.common.birthyears)}
//                           text={commonTexts.common.agegroup.total_people}
//                         />
//                       }
//                     </Box>

//                     <Box display="flex" flexDirection="column">
//                       <Box display="flex" flexDirection="column" marginBottom={space[2]}>
//                         <Box display="flex" marginBottom={space[1]}>
//                           <Box marginRight={space[3]}>Coronaregel volgen:</Box>
//                           <WidePercentage
//                             value={<BehaviorTrend trend={behavior.complianceTrend} color={colors.black} text={`${behavior.supportPercentage}%`} />}
//                             color={colors.yellow3}
//                             justifyContent="flex-start"
//                           />
//                         </Box>
//                         <PercentageBarWithoutNumber percentage={behavior.compliancePercentage} color={colors.blue6} />
//                       </Box>

//                       <Box display="flex" flexDirection="column">
//                         <Box display="flex" marginBottom={space[1]}>
//                           <Box marginRight={space[3]}>Coronaregel steunen:</Box>
//                           <WidePercentage
//                             value={<BehaviorTrend trend={behavior.supportTrend} color={colors.black} text={`${behavior.supportPercentage}%`} />}
//                             color={colors.blue6}
//                             justifyContent="flex-start"
//                           />
//                         </Box>
//                         <PercentageBarWithoutNumber percentage={behavior.supportPercentage} color={colors.yellow3} />
//                       </Box>
//                     </Box>
//                   </Cell>
//                 </Row>

//                 {/* Old */}
//                 {/* <Box key={index} pt={2} pb={3} spacing={3} borderBottom="1px solid" borderColor="silver">
//                   <AgeGroup
//                     range={formatAgeGroupString(item.age_group_range, commonTexts.common.agegroup)}
//                     ageGroupTotal={'age_group_total' in item ? item.age_group_total : undefined}
//                     birthyear_range={formatBirthyearRangeString(item.birthyear_range, commonTexts.common.birthyears)}
//                     text={commonTexts.common.agegroup.total_people}
//                   />
//                   <Box spacing={1}>
//                     <NarrowPercentage
//                       value={item.autumn_2022_vaccinated_percentage !== null ? `${formatPercentage(item.autumn_2022_vaccinated_percentage)}%` : text.no_data}
//                       color={COLOR_AUTUMN_2022_SHOT}
//                       textLabel={text.headers.autumn_2022_shot}
//                     />
//                     <Bar value={item.autumn_2022_vaccinated_percentage} color={COLOR_AUTUMN_2022_SHOT} />
//                   </Box>
//                   <Spacer mb={3} />
//                   <Box spacing={1}>
//                     <NarrowPercentage value={`${formatPercentage(item.fully_vaccinated_percentage)}%`} color={COLOR_FULLY_VACCINATED} textLabel={text.headers.fully_vaccinated} />
//                     <Bar value={item.fully_vaccinated_percentage} color={COLOR_FULLY_VACCINATED} />
//                   </Box>
//                 </Box> */}
//               </>
//             ))}
//           </tbody>
//         </StyledTable>
//     </Box>
//   );
// };

// const StyledBoldText = styled(BoldText)`
//   font-size: ${fontSizes[2]};
// `;

// interface PercentageBarWithoutNumberProps {
//   percentage: number;
//   color: string;
//   marginBottom?: string;
// }

// function PercentageBarWithoutNumber({ percentage, color, marginBottom }: PercentageBarWithoutNumberProps) {
//   return (
//     <Box display="flex" alignItems="center" spacingHorizontal={2} marginBottom={marginBottom}>
//       <Box color={color} flexGrow={1}>
//         <PercentageBar percentage={percentage} height="8px" />
//       </Box>
//     </Box>
//   );
// }

// const StyledTable = styled.table`
//   border-collapse: collapse;
//   width: 100%;
// `;

// type RowProps = DisplayProps;

// const Row = styled.tr<RowProps>`
//   flex-wrap: wrap;
//   justify-content: space-between;
//   ${compose(display)};
// `;

// type HeaderCellProps = WidthProps & DisplayProps;

// const HeaderCell = styled.th<HeaderCellProps>`
//   border-bottom: 1px solid ${colors.gray2};
//   text-align: left;
//   font-weight: ${fontWeights.bold};
//   vertical-align: middle;
//   padding-bottom: ${space[2]};
//   ${compose(width)};
//   ${compose(display)};
// `

// type CellProps = MinWidthProps & BorderProps;

// const Cell = styled.td<CellProps>`
//   border-bottom: 1px solid ${colors.gray2};
//   padding: ${space[3]} ${space[0]};
//   vertical-align: middle;
//   ${compose(minWidth)};
//   ${compose(border)};
// `

// const StyledAnchor = styled(Anchor)`
//   &:hover {
//     color: ${colors.blue8};
//   }
// `
