# `@rehooks/local-storage`

> React hook for local-storage

## Install

### With Yarn

```sh
yarn add @rehooks/local-storage
```

### With NPM

```sh
npm i @rehooks/local-storage
```

## Usage

### Write to Storage

This can be anywhere from within your application.

```js
import { writeStorage } from '@rehooks/local-storage';

let counter = 0;

const MyButton = () => (
  <button
    onClick={_ => writeStorage('i', ++counter)}
  >Click Me</button>
);

```

### Read From Storage

This component will receive updates to itself from local storage.

```js
import { useLocalStorage } from '@rehooks/local-storage';

function MyComponent() {
  const [counterValue] = useLocalStorage('i'); // send the key to be tracked.
  return (
    <div>
      <h1>{counterValue}</h1>
    </div>
  );
}
```
