import { FC, useState, ReactNode } from 'react';
import { Grid, Drawer, DrawerProps } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

// Utils
import utils from '@/utils';

const { useBreakpoint } = Grid;

interface SideContentProps {
  sideContent?: ReactNode;
  sideContentWidth?: number;
  border?: boolean;
}

const SideContent: FC<SideContentProps> = ({
  sideContent,
  sideContentWidth = 250,
  border = false,
}) => (
    <div
      className={`side-content ${border ? 'with-border' : ''}`}
      style={{ width: `${sideContentWidth}px` }}
    >
      {sideContent}
    </div>
  );

interface SideContentMobileProps {
  sideContent?: ReactNode;
  visible?: boolean;
  onSideContentClose?: DrawerProps['onClose'];
}

const SideContentMobile: FC<SideContentMobileProps> = ({
  sideContent,
  visible,
  onSideContentClose,
}) => (
    <Drawer
      width={320}
      placement="left"
      closable={false}
      onClose={onSideContentClose}
      visible={visible}
      bodyStyle={{ paddingLeft: 0, paddingRight: 0 }}
    >
      <div className="h-100">{sideContent}</div>
    </Drawer>
  );

interface InnerAppLayoutProps {
  sideContent?: ReactNode;
  mainContent: ReactNode;
  pageHeader?: boolean;
  sideContentWidth?: number;
  border?: boolean;
  sideContentGutter?: boolean;
}

export const InnerAppLayout: FC<InnerAppLayoutProps> = ({
  sideContent,
  mainContent,
  pageHeader,
  sideContentWidth = 0,
  border = false,
  sideContentGutter = true,
}) => {
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');
  const [visible, setVisible] = useState(false);

  const close: SideContentMobileProps['onSideContentClose'] = () => {
    setVisible(false);
  };

  const openSideContentMobile = () => {
    setVisible(true);
  };

  return (
    <div className='inner-app-layout'>
      {isMobile ? (
        <SideContentMobile
          sideContent={sideContent}
          visible={visible}
          onSideContentClose={close}
        />
      ) : (
        <SideContent
          sideContent={sideContent}
          sideContentWidth={sideContentWidth}
          border={border}
        />
      )}
      <div
        className={`main-content ${pageHeader ? 'has-page-header' : ''} ${
          sideContentGutter ? 'gutter' : 'no-gutter'
        }`}
      >
        {isMobile ? (
          <div
            className={`font-size-lg mb-3 ${
              !sideContentGutter ? 'pt-3 px-3' : ''
            }`}
          >
            <MenuOutlined onClick={() => openSideContentMobile()} />
          </div>
        ) : null}
        {mainContent}
      </div>
    </div>
  );
};

export default InnerAppLayout;
