import { useEffect } from 'react';

const addBodyClass = (className: string) =>
  document.body.classList.add(className);
const removeBodyClass = (className: string) =>
  document.body.classList.remove(className);

export default function useBodyClass(className: string | string[]): void {
  useEffect(() => {
    // Set up
    if (className instanceof Array) {
      className.map(addBodyClass);
    } else {
      addBodyClass(className);
    }

    // Clean up
    return () => {
      if (className instanceof Array) {
        className.map(removeBodyClass);
      } else {
        removeBodyClass(className);
      }
    };
  }, [className]);
}
