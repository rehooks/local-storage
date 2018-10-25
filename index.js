"use strict";
let { useState, useEffect } = require("react");

function useLocalStorage(key) {
  let localStorageItem;
  if (key) {
    localStorageItem = localStorage[key];
  }
  const [localState, updateLocalState] = useState(localStorageItem);
  function syncLocalStorage(event) {
    if (event.key === key) {
      updateLocalState(event.newValue);
    }
  }
  useEffect(() => {
    window.addEventListener("storage", syncLocalStorage);
    return () => {
      window.removeEventListener("storage", syncLocalStorage);
    };
  });
  return localState;
}

module.exports = useLocalStorage;
