import React from 'react';
import { useLocalStorage, writeStorage } from '../src';
import { renderHook, cleanup } from 'react-hooks-testing-library';
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
  expect(result.current[0]).toBe(expectedValue);
});


test('Component should rerender from change to local storage', () => {
  const initialValue = 'No, this is Patrick!';
  const key = 'star';
  const newValue = 'Punch it, Chewie!';
  const testComponentId = 'tcid';
  const testButtonId = 'tbid';

  const Component = () => {
    const [actualValue] = useLocalStorage(key);
    return (
      <span data-testid={testComponentId}>{actualValue}</span>
    );
  };
  const TestButton = () => (
    <button
      onClick={_ => writeStorage(key, newValue)}
      data-testid={testButtonId}
    >Test Button</button>
  );

  writeStorage(key, initialValue);

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

test('Hooks use valid types', () => {
  class Foo {
    constructor(public name: string) { }
  }
  const fooId = 'fooP';
  const fooStorageId = 'foo';
  const buttonId = 'btn';
  const fooName = 'floofaloof';
  const newFooName = 'gloopalop';

  localStorage.setItem(fooStorageId, JSON.stringify(new Foo(fooName)));

  const TestComponent = () => {
    const [fooString, setFoo] = useLocalStorage(fooStorageId);

    expect(typeof(fooString) === 'string').toBe(true);

    const foo: Foo = JSON.parse(fooString!);
    return (
      <>
        <p data-testid={fooId}>{foo.name}</p>
        <button data-testid={buttonId} onClick={e => setFoo(JSON.stringify(new Foo(newFooName)))}>Clicky Click</button>
      </>
    );
  }

  const testComponent = render(<TestComponent />);

  expect(testComponent.getByTestId(fooId).textContent).toBe(fooName);

  fireEvent.click(testComponent.getByTestId(buttonId));

  expect(testComponent.getByTestId(fooId).textContent).toBe(newFooName);
});
