import { useState, useEffect } from 'react';

export const useLocalStorageState = (keyName, initialValue) => {
   const getInitialState = () => {
      const localStorageValue = localStorage.getItem(keyName);

      return (
         localStorageValue ? JSON.parse(localStorage.getItem(keyName)) : initialValue
      )
   };

   const [state, setState] = useState(getInitialState);

   useEffect(() => {
      localStorage.setItem(keyName, JSON.stringify(state));
   }, [state, keyName]);

   return [state, setState];
};