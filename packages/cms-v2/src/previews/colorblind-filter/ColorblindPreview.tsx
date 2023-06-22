/* eslint-disable react/no-multi-comp, react/no-did-mount-set-state */
import DefaultSelect from 'part:@sanity/components/selects/default';
import PropTypes from 'prop-types';
import React from 'react';
import { assemblePreviewUrl } from '../assemble-preview-url';
import styles from './ColorblindPreview.css';
import filters from './filters.svg';

const FILTER_ITEMS = [
  { title: 'Protanopia', value: 'protanopia' },
  { title: 'Deuteranopia', value: 'deuteranopia' },
  { title: 'Tritanopia', value: 'tritanopia' },
  { title: 'Achromatopsia', value: 'achromatopsia' },
  { title: 'Protanomaly', value: 'protanomaly' },
  { title: 'Deuteranomaly', value: 'deuteranomaly' },
  { title: 'Tritanomaly', value: 'tritanomaly' },
  { title: 'Achromatomaly', value: 'achromatomaly' },
  { title: 'No filter', value: null },
];

class ColorblindPreview extends React.PureComponent<any> {
  static propTypes = {
    document: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    document: null,
  };

  state = {
    activeFilter: FILTER_ITEMS[0],
  };

  handleFilterChange = (filter: string) => {
    this.setState({ activeFilter: filter });
  };

  render() {
    const { options } = this.props;
    const { displayed } = this.props.document;
    if (!displayed) {
      return (
        <div className={styles.componentWrapper}>
          <p>There is no document to preview</p>
        </div>
      );
    }

    const { activeFilter } = this.state;
    const filterStyle = {
      filter: activeFilter.value ? `url('${filters}#${activeFilter.value}')` : 'none',
    };

    const url = assemblePreviewUrl({ options });

    if (!url) {
      return (
        <div className={styles.componentWrapper}>
          <p>Hmm. Having problems constructing the web front-end URL.</p>
        </div>
      );
    }

    return (
      <div className={styles.componentWrapper}>
        <div className={styles.filterDropdown}>
          <label className={styles.dropdownLabel} htmlFor={'select-filter'}>
            Select a filter:
          </label>
          <DefaultSelect items={FILTER_ITEMS} value={activeFilter} onChange={(value: any) => this.handleFilterChange(value)} />
        </div>
        <div className={styles.iframeContainer} style={filterStyle}>
          <iframe src={url} frameBorder={'0'} />
        </div>
      </div>
    );
  }
}

export default ColorblindPreview;
