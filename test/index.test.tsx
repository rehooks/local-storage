import React from 'react';
import { useLocalStorage } from '../src';
import { renderHook, cleanup, act } from 'react-hooks-testing-library';
import { render, fireEvent } from 'react-testing-library';


afterEach(() => {
  cleanup();
})


test('Component can access localStorage value', () => {
  const expectedValue = 'THIS IS SPARTA!';
  const key = 'sparta';
  
  localStorage.setItem(key, expectedValue);
  const { result } = renderHook(() => useLocalStorage(key));
  
  expect(localStorage.getItem(key)).toBe(expectedValue);
  expect(result.current).toBe(expectedValue);
});


test('Component should rerender from change to local storage', () => {
  const initialValue = 'No, this is Patrick!';
  const key = 'star';
  const newValue = 'Punch it, Chewie!';
  const testComponentId = 'tcid';
  const testButtonId = 'tbid';

  const Component = () => {
    const actualValue = useLocalStorage(key);
    return (
      <span data-testid={testComponentId}>{actualValue}</span>
    );
  };  
  const TestButton = () => (
    <button 
      onClick={_ => localStorage.setItem(key, newValue)}
      data-testid={testButtonId}
    >Test Button</button>
  );

  localStorage.setItem(key, initialValue);

  const testComponent = render(<Component />);
  const testButton = render(<TestButton />);

  expect(testComponent
    .getByTestId(testComponentId)
    .textContent
  ).toBe(initialValue);

  fireEvent.click(testButton.getByTestId(testButtonId));

  expect(localStorage.getItem(key)).toBe(newValue);
  expect(testComponent
    .getByTestId(testComponentId)
    .textContent
  ).toBe(newValue);
});


