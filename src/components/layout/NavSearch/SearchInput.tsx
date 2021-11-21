import { FC, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AutoComplete, AutoCompleteProps, Input } from 'antd';
import {
  DashboardOutlined,
  // AppstoreOutlined,
  // AntDesignOutlined,
  // FileTextOutlined,
  FlagOutlined,
  PayCircleOutlined,
  UsergroupAddOutlined,
  SketchOutlined,
  UnorderedListOutlined,
  PicLeftOutlined,
  StarOutlined,
  SearchOutlined,
} from '@ant-design/icons';

// Types
import { NavMenu } from '@/types/nav';

// Configs
import navigationConfig from '@/configs/nav';

// Components
import IntlMessage from '@/components/util/IntlMessage';

function getOptionList(
  navigationTree: NavMenu[],
  optionTree: NavMenu[] = [],
): NavMenu[] {
  for (const navItem of navigationTree) {
    if (navItem.submenu.length === 0) {
      optionTree.push(navItem);
    }
    if (navItem.submenu.length > 0) {
      getOptionList(navItem.submenu, optionTree);
    }
  }
  return optionTree;
}

const optionList = getOptionList(navigationConfig);

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'dashboard':
      return <DashboardOutlined className='text-success' />;

    case 'ads':
      return <FlagOutlined className='text-primary' />;

    case 'payments':
      return <PayCircleOutlined className='text-primary' />;

    case 'clubs':
      return <UsergroupAddOutlined className='text-primary' />;

    case 'users':
      return <UsergroupAddOutlined className='text-primary' />;

    case 'vendors':
      return <UsergroupAddOutlined className='text-primary' />;

    case 'sponsors':
      return <SketchOutlined className='text-primary' />;

    case 'listings':
      return <UnorderedListOutlined className='text-primary' />;

    case 'news':
      return <PicLeftOutlined className='text-primary' />;

    case 'events':
      return <PicLeftOutlined className='text-primary' />;

    case 'banners':
      return <StarOutlined className='text-primary' />;

    default:
      return null;
  }
};

const searchResult = () =>
  optionList.map((item) => {
    const category = item.key.split('-')[0];
    return {
      value: item.path,
      label: (
        <Link to={item.path}>
          <div className='search-list-item'>
            <div className='icon'>{getCategoryIcon(category)}</div>
            <div>
              <div className='font-weight-semibold'>
                <IntlMessage id={item.title} />
              </div>
              <div className='font-size-sm text-muted'>{category}</div>
            </div>
          </div>
        </Link>
      ),
    };
  });

interface SearchInputProps {
  active?: boolean;
  close?: () => void | Promise<void>;
  isMobile?: boolean;
  mode?: string;
}

const SearchInput: FC<SearchInputProps> = ({
  active = false,
  close,
  isMobile = false,
  mode = 'light',
}) => {
  const [value, setValue] = useState<string>('');
  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSelect = (): void => {
    setValue('');
    setOptions([]);
    if (close) {
      void close();
    }
  };

  const onSearch = (searchText: string) => {
    setValue(searchText);
    setOptions(!searchText ? [] : searchResult());
  };

  const autofocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (active) {
    autofocus();
  }

  return (
    <AutoComplete
      ref={inputRef}
      className={`nav-search-input ${isMobile ? 'is-mobile' : ''} ${
        mode === 'light' ? 'light' : ''
      }`}
      dropdownClassName='nav-search-dropdown'
      options={options}
      onSelect={onSelect}
      onSearch={onSearch}
      value={value}
      filterOption={(inputValue, option) =>
        (option as Record<string, string>).value
          .toUpperCase()
          .indexOf(inputValue.toUpperCase()) !== -1
      }
    >
      <Input
        placeholder='Search...'
        prefix={<SearchOutlined className='mr-0' />}
      />
    </AutoComplete>
  );
};

export default SearchInput;
