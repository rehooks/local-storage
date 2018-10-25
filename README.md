# `@rehooks/local-storage`

> React hook for local-storage

> **Note:** This is using the new [React Hooks API Proposal](https://reactjs.org/docs/hooks-intro.html)
> which is subject to change until React 16.7 final.
>
> You'll need to install `react`, `react-dom`, etc at `^16.7.0-alpha.0`

## Install

```sh
yarn add @rehooks/local-storage
```

## Usage

```js
import useLocalStorage from "@rehooks/local-storage";

function MyComponent() {
  let name = useLocalStorage("Jamie");
  return (
    <div>
      <h1>{name}</h1>
    </div>
  );
}
```
