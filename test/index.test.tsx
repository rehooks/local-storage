import React, { useEffect, useState } from 'react';
import { useLocalStorage, writeStorage, deleteFromStorage } from '../src';
import { renderHook } from '@testing-library/react-hooks';
import { render, fireEvent, act, cleanup } from '@testing-library/react';

import { storage } from '../src/storage'


afterEach(() => {
  cleanup();
})

describe('Integration Tests', () => {

  it('Component can access localStorage value', () => {
    const expectedValue = 'THIS IS SPARTA!';
    const key = 'sparta';

    localStorage.setItem(key, expectedValue);
    const { result } = renderHook(() => useLocalStorage(key));

    expect(localStorage.getItem(key)).toBe(expectedValue);
    expect(result.current[0]).toBe(expectedValue);
  });


  it('Component should rerender from change to local storage', () => {
    const defaultValue = 'No, this is Patrick!';
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

    writeStorage(key, defaultValue);

    const testComponent = render(<Component />);
    const testButton = render(<TestButton />);

    expect(testComponent
      .getByTestId(testComponentId)
      .textContent
    ).toBe(defaultValue);

    fireEvent.click(testButton.getByTestId(testButtonId));

    expect(localStorage.getItem(key)).toBe(newValue);
    expect(testComponent
      .getByTestId(testComponentId)
      .textContent
    ).toBe(newValue);
  });

  it('Hooks use valid types', () => {
    class Foo {
      constructor(public name: string) { }
    }
    const fooId = 'fooP';
    const fooStorageId = 'foo';
    const buttonId = 'btn';
    const buttonDelId = 'btnDel';
    const fooName = 'floofaloof';
    const newFooName = 'gloopalop';

    localStorage.setItem(fooStorageId, JSON.stringify(new Foo(fooName)));

    const TestComponent = () => {
      const [foo, setFoo, deleteFoo] = useLocalStorage<Foo>(fooStorageId);

      return (
        <>
          <p data-testid={fooId}>{foo?.name}</p>
          <button data-testid={buttonId} onClick={e => setFoo(new Foo(newFooName))}>Clicky Click</button>
          <button data-testid={buttonDelId} onClick={e => deleteFoo()}>Delete Delete</button>
        </>
      );
    }

    const testComponent = render(<TestComponent />);

    expect(testComponent.getByTestId(fooId).textContent).toBe(fooName);

    fireEvent.click(testComponent.getByTestId(buttonId));

    expect(testComponent.getByTestId(fooId).textContent).toBe(newFooName);

    fireEvent.click(testComponent.getByTestId(buttonDelId));

    expect(testComponent.getByTestId(fooId).textContent).toBe("");
  });


  it('deleteFromStorage removes item from localStorage', () => {
    const key = 'glarp';
    const value = 'glorp';
    localStorage.setItem(key, value);
    deleteFromStorage(key);

    expect(localStorage.getItem(key)).toBe(null);
  });


  it('deleteFromStorage to trigger update on component', () => {
    const key = 'floot';
    const defaultValue = 'larg';
    const testComponentId = 'someId';

    writeStorage(key, defaultValue);
    const TestComponent = () => {
      const [value] = useLocalStorage(key);
      return (
        <p data-testid={testComponentId}>{value}</p>
      );
    }
    const testComponent = render(<TestComponent />);
    act(() => deleteFromStorage(key));

    expect(testComponent.getByTestId(testComponentId).textContent).toBe("");
    expect(localStorage.getItem(key)).toBe(null);
  });

  it('Works with an initial object value with no previous value found in the local storage', () => {
    const key = 'user';
    const defaultValue = { name: 'John Cena' };
    const testComponentId = 'id';

    localStorage.removeItem(key);
    expect(localStorage.getItem(key)).toBe(null);

    const TestComponent = () => {
      const [value] = useLocalStorage(key, defaultValue);
      return (
        <p data-testid={testComponentId}>{value!.name}</p>
      );
    };

    const testComponent = render(<TestComponent />);
    expect(testComponent.getByTestId(testComponentId).textContent).toBe(defaultValue.name);
    expect(JSON.parse(localStorage.getItem(key)!)).toEqual(defaultValue);
  });

  it('useLocalStorage with a default value renders a component with a default value', () => {
    const key = 'yogl';
    const defaultValue = 'thanos did nothing wrong';
    const testComponentId = 'Hello, my name is';

    const TestComponent = () => {
      const [value] = useLocalStorage(key, defaultValue);
      return (
        <p data-testid={testComponentId}>{value}</p>
      );
    };

    const testComponent = render(<TestComponent />);

    expect(testComponent.getByTestId(testComponentId).textContent).toBe(defaultValue);
    expect(localStorage.getItem(key)).toBe(defaultValue);
  });

  it('useLocalStorage with a default value rerenders successfully when updating with writeStorage', () => {
    const key = 'crazy frog';
    const defaultValue = '✅✅✅';
    const secondValue = '❌❌❌';
    const testComponentId = 'ringdingdingding';

    const TestComponent = () => {
      const [value] = useLocalStorage(key, defaultValue);
      return (
        <p data-testid={testComponentId}>{value}</p>
      );
    };

    const testComponent = render(<TestComponent />);
    act(() => writeStorage(key, secondValue));


    expect(testComponent.getByTestId(testComponentId).textContent).toBe(secondValue);
    expect(localStorage.getItem(key)).toBe(secondValue);
  });

  it('https://github.com/rehooks/local-storage/issues/38', async () => {
    const allPeople = ['Tim', 'Bob', 'Gemma'];
    const EditAge = ({ name }: { name?: string }) => {
      if (!name)
        return <></>;

      const [age, setAge] = useLocalStorage(name, 0);

      return (
        <div>
          <h1>{name}'s Age</h1>
          <input data-testid={`${name}:input`} type={'number'} value={age!} onChange={event => setAge(parseInt(event.target.value) || age!)} />
        </div>
      );
    };

    const TestComponent = () => {
      const [editPerson, setEditPerson] = useState<string | undefined>(undefined);
      return (
        <div>
          <EditAge data-testid={'editAge'} name={editPerson} />
          {allPeople.map(name =>
            <button data-testid={name} onClick={() => setEditPerson(name)} key={name}>{name}</button>
          )}
        </div>
      );
    };
    const { findAllByTestId } = render(<TestComponent />);

    // In the beginning there is nothing there
    expect(localStorage.getItem(allPeople[0])).toBe(null);

    const [timEditAgeButton] = await findAllByTestId(allPeople[0]);

    fireEvent.click(timEditAgeButton);

    // This will render the hook with Tim's name, and should use the local storage hook with the default value 0
    expect(localStorage.getItem(allPeople[0])).toBe('0');

    const [editAgeInput] = await findAllByTestId(`${allPeople[0]}:input`);
    fireEvent.change(editAgeInput, { target: { value: 24 } });

    // The event listener that is registered from the hook should use the event above to update the storage
    expect(localStorage.getItem(allPeople[0])).toBe('24');
  });

  it('should update localState when the key changes externally', async () => {
    const TestComponent = () => {
      const [key, set] = React.useState('key1');
      const [name, setName] = useLocalStorage(key, 'default value');
      useEffect(() => {
        setName('The First Value');
      }, [])
      return (
        <div>
          <h1 data-testid={'header'}>{name}</h1>
          <button data-testid={'btn'} onClick={() => set('key2')}>Change State</button>
        </div>
      );
    };

    const { findByTestId } = render(<TestComponent />);
    const h1 = await findByTestId('header');
    const btn = await findByTestId('btn');

    expect(localStorage.getItem('key1')).toBe('The First Value');
    expect(h1.textContent).toBe('The First Value');

    fireEvent.click(btn);
    expect(h1.textContent).toBe('default value');
  });
});
