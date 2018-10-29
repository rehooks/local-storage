"use strict";
let { useState, useEffect } = require("react");

function useLocalStorage(key) {
  const [localState, updateLocalState] = useState(null);

  useEffect(() => {
    if (key && localStorage.hasOwnProperty(key)) {
      let value = localStorage.getItem(key)

      // parse the localStorage string and setState
      try {
        value = JSON.parse(value)
      } finally {
        updateLocalState(value)
      }
    }
  }, [])

  function syncLocalStorage(event) {
    if (event.key === key && event.isTrusted) {
      updateLocalState(event.newValue);
    }
  }
  useEffect(() => {
    window.addEventListener("storage", syncLocalStorage);
    return () => {
      window.removeEventListener("storage", syncLocalStorage);
    };
  }, []);
  return localState;
}

module.exports = useLocalStorage;
