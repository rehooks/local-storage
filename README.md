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

```js
import { useLocalStorage } from "@rehooks/local-storage";

function MyComponent() {
  let name = useLocalStorage("name"); // send the key to be tracked.
  return (
    <div>
      <h1>{name}</h1>
    </div>
  );
}
```
