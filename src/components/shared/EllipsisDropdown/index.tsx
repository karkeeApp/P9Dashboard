import { FC } from 'react';
import { Dropdown, DropDownProps } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

interface EllipsisDropdownProps {
  menu: DropDownProps['overlay'];
  placement?: DropDownProps['placement'];
  trigger?: DropDownProps['trigger'];
}

const EllipsisDropdown: FC<EllipsisDropdownProps> = ({
  menu,
  placement = 'bottomRight',
  trigger = ['click'],
}) => (
  <Dropdown overlay={menu} placement={placement} trigger={trigger}>
    <div className='ellipsis-dropdown'>
      <EllipsisOutlined />
    </div>
  </Dropdown>
);

export default EllipsisDropdown;
