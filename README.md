[![npm version](https://badge.fury.io/js/%40rehooks%2Flocal-storage.svg)](https://www.npmjs.com/package/@rehooks/local-storage)


# `@rehooks/local-storage`

> React hook for local-storage

## Table of Contents

- [`@rehooks/local-storage`](#rehookslocal-storage)
  - [Table of Contents](#table-of-contents)
  - [Install](#install)
    - [With Yarn](#with-yarn)
    - [With NPM](#with-npm)
  - [Usage](#usage)
    - [Write to Storage](#write-to-storage)
    - [Read From Storage](#read-from-storage)
    - [Delete From Storage](#delete-from-storage)
  - [Full Example](#full-example)

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
import React from 'react';
import { writeStorage } from '@rehooks/local-storage';

let counter = 0;

const MyButton = () => (
  <button onClick={_ => writeStorage('i', ++counter)}>
    Click Me
  </button>
);

```

### Read From Storage

This component will receive updates to itself from local storage.

```js
import React from 'react';
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

### Delete From Storage

You may also delete items from the local storage as well.

```js
import { writeStorage, deleteFromStorage } from '@rehooks/local-storage';

writeStorage('name', 'Homer Simpson'); // Add an item first

deleteFromStorage('name'); // Deletes the item

const thisIsNull = localStorage.getItem('name'); // This is indeed null
```

## Full Example

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { writeStorage, deleteFromStorage, useLocalStorage } from '@rehooks/local-storage';

const startingNum = 0;

const App = () => {
  const [getNum, setNum] = useLocalStorage('num');

  return (
    <>
      <p>{getNum}</p>
      <button onClick={_ => setNum(getNum ? getNum + 1 : 0)}>Increment</button>
      <button onClick={_ => deleteFromStorage('num')}>Delete</button>
    </>
  );
};

// Assuming there is a div in index.html with an ID of 'root'
ReactDOM.render(<App />, document.getElementById('root'));
```

