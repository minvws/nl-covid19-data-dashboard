import { act, cleanup, render, fireEvent } from '@testing-library/preact';
import data from 'data/index';

import SelectRegio from '..';
import { getInitialState } from '..';

const regioData = getInitialState();

afterEach(() => {
  cleanup();
}); // Default on import: runs it after each test.

describe('SelectRegio', () => {
  it('should have a correct initial state', () => {
    const initialState = getInitialState();

    // It shouldn't contain the first element in the seed data, which is NL
    expect(initialState).toEqual(expect.not.arrayContaining([data[0]]));

    // It should be sorted alphabetically
    expect(initialState[0].name).toBe('Amsterdam-Amstelland');
    expect(initialState[initialState.length - 1].name).toBe(
      'Zuid-Holland Zuid'
    );
  });

  it('should render without errors', () => {
    const container = document.createElement('div');
    act(() => {
      render(<SelectRegio selected={regioData[1]} />, { container });
    });
  });

  it('should open when the dropdown button is clicked', () => {
    const { getByRole, getAllByRole } = render(
      <SelectRegio selected={regioData[1]} />
    );

    const combobox = getByRole('combobox');
    const listbox = getByRole('listbox');

    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(listbox).toBeEmptyDOMElement();

    fireEvent.click(getByRole('button'));

    const options = getAllByRole('option');

    expect(combobox).toHaveAttribute('aria-expanded', 'true');
    expect(listbox).not.toBeEmptyDOMElement();
    expect(options.length).toEqual(regioData.length);
  });
});
