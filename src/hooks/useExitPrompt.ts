import { useState, useEffect, Dispatch, SetStateAction } from 'react';

function initBeforeUnload(showExitPrompt: boolean): void {
  window.onbeforeunload = (e) => {
    if (showExitPrompt) {
      e.preventDefault();
      e.returnValue = '';

      return '';
    }

    return undefined;
  };
}

export default function useExitPrompt(
  show: boolean,
): [boolean, Dispatch<SetStateAction<boolean>>] {
  const [showExitPrompt, setShowExitPrompt] = useState<boolean>(show);

  window.onload = function onload() {
    initBeforeUnload(showExitPrompt);
  };

  useEffect(() => {
    initBeforeUnload(showExitPrompt);
  }, [showExitPrompt]);

  return [showExitPrompt, setShowExitPrompt];
}
