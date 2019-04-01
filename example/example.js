import React from "react";
import { render } from "react-dom";
import { useLocalStorage } from "../";

const App = () => {
  let name = useLocalStorage("name");
  return (
    <div>
      <h1>{name}</h1>
    </div>
  );
}

render(<App />, document.getElementById('root'));
