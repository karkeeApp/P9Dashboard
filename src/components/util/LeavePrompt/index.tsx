import { FC } from 'react';
import { Prompt, PromptProps } from 'react-router-dom';

export interface LeavePromptProps {
  when: PromptProps['when'];
}

const LeavePrompt: FC<LeavePromptProps> = ({ when }) => (
  <Prompt
    when={when}
    message='Leave site? Changes you made may not be saved.'
  />
);

export default LeavePrompt;
