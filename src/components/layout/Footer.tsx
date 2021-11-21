import { FC } from 'react';

// Config
import { APP_NAME } from '@/configs/app';

const Footer: FC = () => (
  <footer className='footer'>
    <span>
      Copyright &copy; {`${new Date().getFullYear()}`}{' '}
      <span className='font-weight-semibold'>{APP_NAME}</span>. All rights
      reserved.
    </span>
    <div>
      <a className='text-gray' href='/#' onClick={(e) => e.preventDefault()}>
        Term & Conditions
      </a>
      <span className='mx-2 text-muted'> | </span>
      <a className='text-gray' href='/#' onClick={(e) => e.preventDefault()}>
        Privacy & Policy
      </a>
    </div>
  </footer>
);

export default Footer;
