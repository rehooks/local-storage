# `@rehooks/local-storage`

> React hook for local-storage

## Install

```sh
yarn add @rehooks/local-storage
```

## Usage

```js
import useLocalStorage from "@rehooks/local-storage";

function MyComponent() {
  let name = useLocalStorage("name"); // send the key to be tracked.
  return (
    <div>
      <h1>{name}</h1>
    </div>
  );
}
```
