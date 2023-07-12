# Theming:
The theme file contains various constants that define styles, colors, and layout properties for a website or application. Here's what each of the constants means in a human-readable format:

## 1. **space**:
Defines a set of space values, which can be used for padding, margins, and positioning. The values range from 0 to 512 pixels in ascending order.

| Index | Pixel | Rem |
| --- | --- | --- |
| 0 | 0px | - |
| 1 | 4px | 0.25rem |
| 2 | 8px | 0.5rem |
| 3 | 16px | 1rem |
| 4 | 32px | 2rem |
| 5 | 64px | 4rem |
| 6 | 128px | 8rem |
| 7 | 256px | 16rem |
| 8 | 512px | 32rem |

## 2. **fonts**:
Contains two font family definitions: one for general body text and one for displaying code.

| Use Case | Font |
| --- | --- |
| Body | 'RO Sans', Calibri, sans-serif |
| Code | source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace |

## 3. **fontSizes**:
Specifies a list of font sizes ranging from 12px to 36px. These sizes can be used throughout the site to maintain consistency.

| Index | Pixel | Rem |
| --- | --- | --- |
| 0 | 12px | 0.75rem |
| 1 | 14px | 0.875rem |
| 2 | 16px | 1rem |
| 3 | 18px | 1.125rem |
| 4 | 19px | 1.1875rem |
| 5 | 20px | 1.25rem |
| 6 | 22px | 1.375rem |
| 7 | 28px | 1.75rem |
| 8 | 32px | 2rem |
| 9 | 36px | 2.25rem |

## 4. **fontWeights**: 
Defines three font weights (normal, bold, and heavy) using their numerical representations.

| Weight | Value |
| --- | --- |
| Normal | 400 |
| Bold | 600 |
| Heavy | 700 |

## 5. **lineHeights**: 
Sets three different line heights (1.2, 1.3, and 1.5). Line height is the vertical space between lines of text.

| Index | Line Height |
| --- | --- |
| 0 | 1.2 |
| 1 | 1.3 |
| 2 | 1.5 |

## 6. **breakpoints**: 
These are the screen widths at which the layout and design of the site will change to accommodate different screen sizes. The values are also labelled as xs, sm, md, lg, and xl for convenience.

| Label | Em | Approximate Pixel |
| --- | --- | --- |
| XS | 26em | ~420px |
| SM | 48em | ~768px |
| MD | 60em | ~960px |
| LG | 75em | ~1200px |
| XL | 100em | ~1600px |

## 7. **mediaQueries**: 
Specifies the media queries associated with the defined breakpoints for responsive design.

| Label | Media Query |
| --- | --- |
| XS | screen and (min-width: 26em) |
| SM | screen and (min-width: 48em) |
| MD | screen and (min-width: 60em) |
| LG | screen and (min-width: 75em) |
| XL | screen and (min-width: 100em) |

## 8. **radii**: 
Defines three values that can be used for setting border radius (i.e., how rounded corners are).

| Index | Radius |
| --- | --- |
| 0 | 0 |
| 1 | 5 |
| 2 | 10 |

## 9. **shadows**: 
Specifies two types of box-shadows (tile and tooltip) to be used in different UI elements.

| Shadow Type | CSS Value |
| --- | --- |
| Tile | 0px 4px 8px rgba(0, 0, 0, 0.1) |
| Tooltip | 0px 2px 12px rgba(0, 0, 0, 0.1) |

## 10. **sizes**: 
Contains various values defining widths for different sections or elements on the site, such as maximum width, content width, etc.

| Element | Pixel |
| --- | --- |
| Max Width | 1400px |
| Info Width | 1000px |
| Max Width Site Warning | 930px |
| Content Width | 700px |
| Max Width Text | 600px |
| Wide Navigation Width | 1024px |

## 11. **Colors**: 
This is a large color palette defining various colors by name. The colors are categorized by shades (gray, red, orange, etc.), with some extra individual colors like neutral, primary, secondary, etc.

### **11.1 Color Definitions**:

| Color Name | Hex Value | Examples |
| --- | --- | --- |
| white | #ffffff | ![#ffffff](https://placehold.co/15x15/ffffff/ffffff.png) |
| gray1 | #f3f3f3 | ![#f3f3f3](https://placehold.co/15x15/f3f3f3/f3f3f3.png) |
| gray2 | #e6e6e6 | ![#e6e6e6](https://placehold.co/15x15/e6e6e6/e6e6e6.png) |
| gray3 | #cccccc | ![#cccccc](https://placehold.co/15x15/cccccc/cccccc.png) |
| gray4 | #b4b4b4 | ![#b4b4b4](https://placehold.co/15x15/b4b4b4/b4b4b4.png) |
| gray5 | #999999 | ![#999999](https://placehold.co/15x15/999999/999999.png) |
| gray6 | #696969 | ![#696969](https://placehold.co/15x15/696969/696969.png) |
| gray7 | #535353 | ![#535353](https://placehold.co/15x15/535353/535353.png) |
| gray8 | #4f5458 | ![#4f5458](https://placehold.co/15x15/4f5458/4f5458.png) |
| black | #000000 | ![#000000](https://placehold.co/15x15/000000/000000.png) |
| neutral | #C6C8CA | ![#C6C8CA](https://placehold.co/15x15/C6C8CA/C6C8CA.png) |
| blackOpacity | #0000000d | ![#0000000d](https://placehold.co/15x15/0000000d/0000000d.png) |
| red1 | #f7e8e7 | ![#f7e8e7](https://placehold.co/15x15/f7e8e7/f7e8e7.png) |
| red2 | #F35065 | ![#F35065](https://placehold.co/15x15/F35065/F35065.png) |
| red3 | #9f3430 | ![#9f3430](https://placehold.co/15x15/9f3430/9f3430.png) |
| orange1 | #E37321 | ![#E37321](https://placehold.co/15x15/E37321/E37321.png) |
| orange2 | #A14E00 | ![#A14E00](https://placehold.co/15x15/A14E00/A14E00.png) |
| yellow1 | #FFF4C1 | ![#FFF4C1](https://placehold.co/15x15/FFF4C1/FFF4C1.png) |
| yellow2 | #fee670 | ![#fee670](https://placehold.co/15x15/fee670/fee670.png) |
| yellow3 | #FFC000 | ![#FFC000](https://placehold.co/15x15/FFC000/FFC000.png) |
| yellow4 | #D3A500 | ![#D3A500](https://placehold.co/15x15/D3A500/D3A500.png) |
| yellow5 | #CF9C00 | ![#CF9C00](https://placehold.co/15x15/CF9C00/CF9C00.png) |
| green1 | #69c253 | ![#69c253](https://placehold.co/15x15/69c253/69c253.png) |
| green2 | #69c253 | ![#69c253](https://placehold.co/15x15/69c253/69c253.png) |
| green3 | #00BB95 | ![#00BB95](https://placehold.co/15x15/00BB95/00BB95.png) |
| green4 | #008372 | ![#008372](https://placehold.co/15x15/008372/008372.png) |
| primary | #007BC7 | ![#007BC7](https://placehold.co/15x15/007BC7/007BC7.png) |
| secondary | #154273 | ![#154273](https://placehold.co/15x15/154273/154273.png) |
| primaryOpacity | #007bc70d | ![#007bc70d](https://placehold.co/15x15/007bc70d/007bc70d.png) |
| blue1 | #e5eff8 | ![#e5eff8](https://placehold.co/15x15/e5eff8/e5eff8.png) |
| blue2 | #D0EDFF | ![#D0EDFF](https://placehold.co/15x15/D0EDFF/D0EDFF.png) |
| blue3 | #aeddf3 | ![#aeddf3](https://placehold.co/15x15/aeddf3/aeddf3.png) |
| blue4 | #8bc7e8 | ![#8bc7e8](https://placehold.co/15x15/8bc7e8/8bc7e8.png) |
| blue5 | #67b1dc | ![#67b1dc](https://placehold.co/15x15/67b1dc/67b1dc.png) |
| blue6 | #219BE5 | ![#219BE5](https://placehold.co/15x15/219BE5/219BE5.png) |
| blue7 | #0053FD | ![#0053FD](https://placehold.co/15x15/0053FD/0053FD.png) |
| blue8 | #01689b | ![#01689b](https://placehold.co/15x15/01689b/01689b.png) |
| blue9 | #005082 | ![#005082](https://placehold.co/15x15/005082/005082.png) |
| blue10 | #003580 | ![#003580](https://placehold.co/15x15/003580/003580.png) |
| magenta1 | #D360E5 | ![#D360E5](https://placehold.co/15x15/D360E5/D360E5.png) |
| magenta2 | #9515AA | ![#9515AA](https://placehold.co/15x15/9515AA/9515AA.png) |
| magenta3 | #cd005a | ![#cd005a](https://placehold.co/15x15/cd005a/cd005a.png) |
| magenta4 | #aa004b | ![#aa004b](https://placehold.co/15x15/aa004b/aa004b.png) |
| transparent | transparent | |

### **11.2 Scale Colors**:

#### 11.2.1 Blue scale:
| Colors | Examples |
| --- | --- |
| #8FCAE7 | ![#8FCAE7](https://placehold.co/15x15/8FCAE7/8FCAE7.png) |
| #5BADDB | ![#5BADDB](https://placehold.co/15x15/5BADDB/5BADDB.png) |
| #248FCF | ![#248FCF](https://placehold.co/15x15/248FCF/248FCF.png) |
| #0070BB | ![#0070BB](https://placehold.co/15x15/0070BB/0070BB.png) |
| #00529D | ![#00529D](https://placehold.co/15x15/00529D/00529D.png) |
| #003580 | ![#003580](https://placehold.co/15x15/003580/003580.png) |
| #001D45 | ![#001D45](https://placehold.co/15x15/001D45/001D45.png) |

#### 11.2.2 Blue detailed scale:
| Colors | Examples |
| --- | --- |
| #aeddf3 | ![#aeddf3](https://placehold.co/15x15/aeddf3/aeddf3.png) |
| #8bc7e8 | ![#8bc7e8](https://placehold.co/15x15/8bc7e8/8bc7e8.png) |
| #67b1dc | ![#67b1dc](https://placehold.co/15x15/67b1dc/67b1dc.png) |
| #449ad1 | ![#449ad1](https://placehold.co/15x15/449ad1/449ad1.png) |
| #1f83c5 | ![#1f83c5](https://placehold.co/15x15/1f83c5/1f83c5.png) |
| #006cb5 | ![#006cb5](https://placehold.co/15x15/006cb5/006cb5.png) |
| #005797 | ![#005797](https://placehold.co/15x15/005797/005797.png) |
| #00437b | ![#00437b](https://placehold.co/15x15/00437b/00437b.png) |
| #002f5f | ![#002f5f](https://placehold.co/15x15/002f5f/002f5f.png) |
| #001d45 | ![#001d45](https://placehold.co/15x15/001d45/001d45.png) |

#### 11.2.3 Magenta scale:
| Colors | Examples |
| --- | --- |
| #F291BC | ![#F291BC](https://placehold.co/15x15/F291BC/F291BC.png) |
| #D95790 | ![#D95790](https://placehold.co/15x15/D95790/D95790.png) |
| #A11050 | ![#A11050](https://placehold.co/15x15/A11050/A11050.png) |
| #68032F | ![#68032F](https://placehold.co/15x15/68032F/68032F.png) |
| #000000 | ![#000000](https://placehold.co/15x15/000000/000000.png) |

#### 11.2.4 Yellow scale:
| Colors | Examples |
| --- | --- |
| #FFF2CC | ![#FFF2CC](https://placehold.co/15x15/FFF2CC/FFF2CC.png) |
| #FFE699 | ![#FFE699](https://placehold.co/15x15/FFE699/FFE699.png) |
| #FFD34D | ![#FFD34D](https://placehold.co/15x15/FFD34D/FFD34D.png) |
| #FABC00 | ![#FABC00](https://placehold.co/15x15/FABC00/FABC00.png) |
| #E5A400 | ![#E5A400](https://placehold.co/15x15/E5A400/E5A400.png) |
| #C98600 | ![#C98600](https://placehold.co/15x15/C98600/C98600.png) |
| #9E6900 | ![#9E6900](https://placehold.co/15x15/9E6900/9E6900.png) |

### **11.3 Variants Colors**:

| Variants | Examples |
| --- | --- |
| #D360E5 | ![#D360E5](https://placehold.co/15x15/D360E5/D360E5.png) |
| #00BB95 | ![#00BB95](https://placehold.co/15x15/00BB95/00BB95.png) |
| #FFC000 | ![#FFC000](https://placehold.co/15x15/FFC000/FFC000.png) |
| #219BE5 | ![#219BE5](https://placehold.co/15x15/219BE5/219BE5.png) |
| #E37321 | ![#E37321](https://placehold.co/15x15/E37321/E37321.png) |
| #6200AF | ![#6200AF](https://placehold.co/15x15/6200AF/6200AF.png) |
| #008372 | ![#008372](https://placehold.co/15x15/008372/008372.png) |
| #CF9C00 | ![#CF9C00](https://placehold.co/15x15/CF9C00/CF9C00.png) |
| #005082 | ![#005082](https://placehold.co/15x15/005082/005082.png) |
| #A14E00 | ![#A14E00](https://placehold.co/15x15/A14E00/A14E00.png) |
| #D7019B | ![#D7019B](https://placehold.co/15x15/D7019B/D7019B.png) |
| #00AE31 | ![#00AE31](https://placehold.co/15x15/00AE31/00AE31.png) |
| #FFE500 | ![#FFE500](https://placehold.co/15x15/FFE500/FFE500.png) |
| #0053FD | ![#0053FD](https://placehold.co/15x15/0053FD/0053FD.png) |
| #F65234 | ![#F65234](https://placehold.co/15x15/F65234/F65234.png) |
| #9515AA | ![#9515AA](https://placehold.co/15x15/9515AA/9515AA.png) |
| #001100 | ![#001100](https://placehold.co/15x15/001100/001100.png) |
| #FF9900 | ![#FF9900](https://placehold.co/15x15/FF9900/FF9900.png) |
| #0011A9 | ![#0011A9](https://placehold.co/15x15/0011A9/0011A9.png) |
| #C80000 | ![#C80000](https://placehold.co/15x15/C80000/C80000.png) |

### **11.4 Vaccine Colors**:

| Vaccine | Color name | hex value | Examples |
| --- | --- | --- | --- | 
| bio_n_tech_pfizer | blue6 | #219BE5 | ![#219BE5](https://placehold.co/15x15/219BE5/219BE5.png) |
| moderna | yellow3 | #FFC000 | ![#FFC000](https://placehold.co/15x15/FFC000/FFC000.png) |
| astra_zeneca | green2 | #69c253 | ![#69c253](https://placehold.co/15x15/69c253/69c253.png) |
| cure_vac | magenta1 | #D360E5 | ![#D360E5](https://placehold.co/15x15/D360E5/D360E5.png) |
| janssen | orange1 | #E37321 | ![#E37321](https://placehold.co/15x15/E37321/E37321.png) |
| sanofi | blue9 | #005082 | ![#005082](https://placehold.co/15x15/005082/005082.png) |
| novavax | magenta2 | #9515AA | ![#9515AA](https://placehold.co/15x15/9515AA/9515AA.png) |
| pfizer | blue6 | #219BE5 | ![#219BE5](https://placehold.co/15x15/219BE5/219BE5.png) |
| BioNTech/Pfizer | blue6 | #219BE5 | ![#219BE5](https://placehold.co/15x15/219BE5/219BE5.png) |
| Moderna | yellow3 | #FFC000 | ![#FFC000](https://placehold.co/15x15/FFC000/FFC000.png) |
| AstraZeneca | green2 | #69c253 | ![#69c253](https://placehold.co/15x15/69c253/69c253.png) |
| Janssen | orange1 | #E37321 | ![#E37321](https://placehold.co/15x15/E37321/E37321.png) |
| Novavax | magenta2 | #9515AA | ![#9515AA](https://placehold.co/15x15/9515AA/9515AA.png) |

By having this theme file, a designer can understand the available space units, font styles, breakpoints, color palette, and other styling parameters defined in the code. This will ensure that the design remains consistent with the current theme and layout restrictions.