import { FC } from 'react';
import { CloseOutlined } from '@ant-design/icons';

// Custom Hooks
import { useTheme } from '@/hooks';

// Utils
import utils from '@/utils';

// Components
import SearchInput from './SearchInput';

interface NavSearchProps {
  active: boolean;
  close: () => void | Promise<void>;
}

const NavSearch: FC<NavSearchProps> = ({ active, close }) => {
  const { headerNavColor } = useTheme();
  const mode = utils.getColorContrast(headerNavColor);

  return (
    <div
      className={`nav-search ${active ? 'nav-search-active' : ''} ${mode}`}
      style={{ backgroundColor: headerNavColor }}
    >
      <div className='d-flex align-items-center w-100'>
        <SearchInput close={close} active={active} />
      </div>
      <div className='nav-close' role='none' onClick={close}>
        <CloseOutlined />
      </div>
    </div>
  );
};

export default NavSearch;
