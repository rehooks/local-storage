# `@rehooks/local-storage`
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-8-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

> React hook for enabling synchronization with local-storage.

[![npm version](https://badge.fury.io/js/%40rehooks%2Flocal-storage.svg)](https://www.npmjs.com/package/@rehooks/local-storage)
[![npm downloads](https://img.shields.io/npm/dw/@rehooks/local-storage)](https://www.npmjs.com/package/@rehooks/local-storage)

API Docs can be found [here](https://rehooks.github.io/local-storage).

## Table of Contents

- [`@rehooks/local-storage`](#rehookslocal-storage)
  - [Table of Contents](#Table-of-Contents)
  - [Install](#Install)
    - [With Yarn](#With-Yarn)
    - [With NPM](#With-NPM)
  - [Usage](#Usage)
    - [Write to Storage](#Write-to-Storage)
    - [Read From Storage](#Read-From-Storage)
      - [Optionally use a default value](#Optionally-use-a-default-value)
    - [Delete From Storage](#Delete-From-Storage)
  - [Full Example](#Full-Example)

## Install

### With Yarn

```sh
yarn add @rehooks/local-storage
```

### With NPM

```sh
npm i @rehooks/local-storage --save
```

## Usage

### Write to Storage

This can be anywhere from within your application.

> Note: Objects that are passed to writeStorage are automatically stringified.
> This will not work for circular structures.

```jsx
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

__Javascript__:

```jsx
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

__Typescript__:

```tsx
import React from 'react';
import { useLocalStorage } from '@rehooks/local-storage';

function MyComponent() {
  const [counterValue] = useLocalStorage<number>('i'); // specify a type argument for your type
  return (
    <div>
      <h1>{counterValue}</h1>
    </div>
  );
}
```

#### Optionally use a default value

> Note: Objects that are passed to useLocalStorage's default parameter will be automatically
> stringified. This will not work for circular structures.

```jsx
import React from 'react';
import { useLocalStorage } from '@rehooks/local-storage';

function MyComponent() {
  // Note: The type of user can be inferred from the default value type
  const [user] = useLocalStorage('user', { name: 'Anakin Skywalker' });
  return (
    <div>
      <h1>{user.name}</h1>
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

You may view this example [here on StackBlitz.](https://stackblitz.com/edit/react-vbrkjb?embed=1&file=index.js)

> Note: The writeStorage and deleteFromStorage functions are provided from useLocalStorage as well,
> and do not require you to specify the key when using them.

```jsx
import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { writeStorage, deleteFromStorage, useLocalStorage } from '@rehooks/local-storage';

const startingNum = 0;

const Clicker = () => (
  <Fragment>
    <h4>Clicker</h4>
    <button onClick={_ => {
      writeStorage('num', localStorage.getItem('num')
      ? +(localStorage.getItem('num')) + 1
      : startingNum
      )
    }}>
      Increment From Outside
    </button>
    <button onClick={_ => deleteFromStorage('num')}>
      Delete From Outside
    </button>
  </Fragment>
);

const IncrememterWithButtons = () => {
  const [number, setNum, deleteNum] = useLocalStorage('num');

  return (
    <Fragment>
      <p>{typeof(number) === 'number' ? number : 'Try incrementing the number!'}</p>
      <button onClick={_ => setNum(getNum !== null ? +(number) + 1 : startingNum)}>Increment</button>
      <button onClick={deleteNum}>Delete</button>
    </Fragment>
  );
};

const App = () => (
  <Fragment>
    <h1> Demo </h1>
    <IncrememterWithButtons />
    <Clicker />
  </Fragment>
);

// Assuming there is a div in index.html with an ID of 'root'
render(<App />, document.getElementById('root'));
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://solankiamit.com"><img src="https://avatars3.githubusercontent.com/u/3483526?v=4" width="100px;" alt=""/><br /><sub><b>Amit Solanki</b></sub></a><br /><a href="https://github.com/rehooks/local-storage/commits?author=iamsolankiamit" title="Code">💻</a> <a href="https://github.com/rehooks/local-storage/commits?author=iamsolankiamit" title="Documentation">📖</a> <a href="#ideas-iamsolankiamit" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/rehooks/local-storage/pulls?q=is%3Apr+reviewed-by%3Aiamsolankiamit" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://jharrilim.github.io/"><img src="https://avatars1.githubusercontent.com/u/19535809?v=4" width="100px;" alt=""/><br /><sub><b>Joe</b></sub></a><br /><a href="https://github.com/rehooks/local-storage/commits?author=jharrilim" title="Code">💻</a> <a href="#example-jharrilim" title="Examples">💡</a> <a href="#ideas-jharrilim" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-jharrilim" title="Maintenance">🚧</a> <a href="https://github.com/rehooks/local-storage/pulls?q=is%3Apr+reviewed-by%3Ajharrilim" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/rehooks/local-storage/commits?author=jharrilim" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/fatihky"><img src="https://avatars0.githubusercontent.com/u/4169772?v=4" width="100px;" alt=""/><br /><sub><b>Fatih Kaya</b></sub></a><br /><a href="https://github.com/rehooks/local-storage/commits?author=fatihky" title="Code">💻</a> <a href="https://github.com/rehooks/local-storage/commits?author=fatihky" title="Tests">⚠️</a> <a href="https://github.com/rehooks/local-storage/issues?q=author%3Afatihky" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://hübenthal.no"><img src="https://avatars3.githubusercontent.com/u/404102?v=4" width="100px;" alt=""/><br /><sub><b>Jarl André Hübenthal</b></sub></a><br /><a href="https://github.com/rehooks/local-storage/commits?author=jarlah" title="Code">💻</a> <a href="https://github.com/rehooks/local-storage/commits?author=jarlah" title="Tests">⚠️</a> <a href="https://github.com/rehooks/local-storage/issues?q=author%3Ajarlah" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://jamie.build/"><img src="https://avatars0.githubusercontent.com/u/952783?v=4" width="100px;" alt=""/><br /><sub><b>Jamie Kyle</b></sub></a><br /><a href="https://github.com/rehooks/local-storage/commits?author=jamiebuilds" title="Code">💻</a></td>
    <td align="center"><a href="http://devalbo.blogspot.com/"><img src="https://avatars3.githubusercontent.com/u/1653890?v=4" width="100px;" alt=""/><br /><sub><b>Albert Boehmler</b></sub></a><br /><a href="https://github.com/rehooks/local-storage/commits?author=devalbo" title="Code">💻</a> <a href="https://github.com/rehooks/local-storage/issues?q=author%3Adevalbo" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/gmdayley"><img src="https://avatars3.githubusercontent.com/u/647130?v=4" width="100px;" alt=""/><br /><sub><b>Gabriel Dayley</b></sub></a><br /><a href="https://github.com/rehooks/local-storage/commits?author=gmdayley" title="Code">💻</a> <a href="https://github.com/rehooks/local-storage/issues?q=author%3Agmdayley" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/mayteio"><img src="https://avatars1.githubusercontent.com/u/43975092?v=4" width="100px;" alt=""/><br /><sub><b>Harley Alexander</b></sub></a><br /><a href="#maintenance-mayteio" title="Maintenance">🚧</a> <a href="https://github.com/rehooks/local-storage/commits?author=mayteio" title="Code">💻</a> <a href="https://github.com/rehooks/local-storage/issues?q=author%3Amayteio" title="Bug reports">🐛</a> <a href="https://github.com/rehooks/local-storage/commits?author=mayteio" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
