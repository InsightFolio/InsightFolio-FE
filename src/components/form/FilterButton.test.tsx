import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterButton from './FilterButton';

describe('FilterButton Price Validation', () => {
  test('min price should not be greater than max price', () => {
    const mockOnFiltersChange = jest.fn();
    render(<FilterButton onFiltersChange={mockOnFiltersChange} />);

    const filterButton = screen.getByRole('button');
    fireEvent.click(filterButton);

    const priceCheckbox = screen.getByLabelText('Price');
    fireEvent.click(priceCheckbox);

    const minInput = screen.getByPlaceholderText('0');
    const maxInput = screen.getByPlaceholderText('No max');

    fireEvent.change(maxInput, { target: { value: '50' } });
    fireEvent.change(minInput, { target: { value: '100' } });

    const lastCall = mockOnFiltersChange.mock.calls[mockOnFiltersChange.mock.calls.length - 1][0];
    
    expect(lastCall.min_price).toBeLessThanOrEqual(lastCall.max_price);
    expect(lastCall.min_price).toBe(50);
    expect(lastCall.max_price).toBe(50);
  });

  test('max price should not be less than min price', () => {
    const mockOnFiltersChange = jest.fn();
    render(<FilterButton onFiltersChange={mockOnFiltersChange} />);

    const filterButton = screen.getByRole('button');
    fireEvent.click(filterButton);

    const priceCheckbox = screen.getByLabelText('Price');
    fireEvent.click(priceCheckbox);

    const minInput = screen.getByPlaceholderText('0');
    const maxInput = screen.getByPlaceholderText('No max');

    fireEvent.change(minInput, { target: { value: '100' } });
    fireEvent.change(maxInput, { target: { value: '50' } });

    const lastCall = mockOnFiltersChange.mock.calls[mockOnFiltersChange.mock.calls.length - 1][0];
    
    expect(lastCall.max_price).toBeGreaterThanOrEqual(lastCall.min_price);
    expect(lastCall.min_price).toBe(100);
    expect(lastCall.max_price).toBe(100);
  });

  test('allows valid price range (min < max)', () => {
    const mockOnFiltersChange = jest.fn();
    render(<FilterButton onFiltersChange={mockOnFiltersChange} />);

    const filterButton = screen.getByRole('button');
    fireEvent.click(filterButton);

    const priceCheckbox = screen.getByLabelText('Price');
    fireEvent.click(priceCheckbox);

    const minInput = screen.getByPlaceholderText('0');
    const maxInput = screen.getByPlaceholderText('No max');

    fireEvent.change(minInput, { target: { value: '10' } });
    fireEvent.change(maxInput, { target: { value: '100' } });

    const lastCall = mockOnFiltersChange.mock.calls[mockOnFiltersChange.mock.calls.length - 1][0];
    
    expect(lastCall.min_price).toBe(10);
    expect(lastCall.max_price).toBe(100);
    expect(lastCall.min_price).toBeLessThan(lastCall.max_price);
  });
});
