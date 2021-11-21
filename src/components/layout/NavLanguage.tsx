import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { CheckOutlined, GlobalOutlined, DownOutlined } from '@ant-design/icons';
import { Menu, Dropdown } from 'antd';

// Redux Actions
import { onLocaleChange } from '@/redux/actions/theme';

// Custom Hooks
import { useTheme } from '@/hooks';

// Assets
import lang from '@/assets/data/language.data.json';

function getLanguageDetail(locale: string) {
  const data = lang.filter((elm) => elm.langId === locale);
  return data[0];
}

interface SelectedLanguageProps {
  locale: string;
}

const SelectedLanguage: FC<SelectedLanguageProps> = ({ locale }) => {
  const language = getLanguageDetail(locale);
  const { langName, icon } = language;
  return (
    <div className='d-flex align-items-center'>
      <img
        style={{ maxWidth: '20px' }}
        src={`/img/flags/${icon}.png`}
        alt={langName}
      />
      <span className='font-weight-semibold ml-2'>
        {langName} <DownOutlined className='font-size-xs' />
      </span>
    </div>
  );
};

interface NavLanguageProps {
  configDisplay?: boolean;
}

export const NavLanguage: FC<NavLanguageProps> = ({ configDisplay }) => {
  const dispatch = useDispatch();
  const { locale } = useTheme();

  const languageOption = (
    <Menu>
      {lang.map((elm) => (
        <Menu.Item
          key={elm.langId}
          className={
            locale === elm.langId ? 'ant-dropdown-menu-item-active' : ''
          }
          onClick={() => dispatch(onLocaleChange(elm.langId))}
        >
          <span className='d-flex justify-content-between align-items-center'>
            <div>
              <img
                style={{ maxWidth: '20px' }}
                src={`/img/flags/${elm.icon}.png`}
                alt={elm.langName}
              />
              <span className='font-weight-normal ml-2'>{elm.langName}</span>
            </div>
            {locale === elm.langId ? (
              <CheckOutlined className='text-success' />
            ) : null}
          </span>
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <Dropdown
      placement='bottomRight'
      overlay={languageOption}
      trigger={['click']}
    >
      {configDisplay ? (
        <a href='#/' className='text-gray' onClick={(e) => e.preventDefault()}>
          <SelectedLanguage locale={locale} />
        </a>
      ) : (
        <Menu mode='horizontal'>
          <Menu.Item>
            <a href='#/' onClick={(e) => e.preventDefault()}>
              <GlobalOutlined className='nav-icon mr-0' />
            </a>
          </Menu.Item>
        </Menu>
      )}
    </Dropdown>
  );
};

export default NavLanguage;
