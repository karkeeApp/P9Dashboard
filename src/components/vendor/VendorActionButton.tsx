import { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Menu, Space, Modal, notification } from 'antd';
import {
  CreditCardOutlined,
  SketchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import update from 'immutability-helper';

// Types
import { ResponseData } from '@/types/api';
import { UserStatus } from '@/types/user';
import { Vendor } from '@/types/vendor';
import { SponsorLevel } from '@/types/sponsor';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Utils
import { getSponsorLevelColor } from '@/utils/sponsor';

// Components
import { EllipsisDropdown, Flex } from '@/components/shared';

export interface VendorActionButtonProps {
  vendor: Vendor;
  onChangeLevel?: (vendor: Vendor) => Promise<void> | void;
  onRemove?: () => Promise<void> | void;
}

interface LevelState {
  modalVisibility: boolean;
  selected: SponsorLevel;
  loading: boolean;
}

interface RemoveState {
  modalVisibility: boolean;
  loading: boolean;
}

const { SubMenu } = Menu;

const VendorActionButton: FC<VendorActionButtonProps> = ({
  vendor,
  onChangeLevel,
  onRemove,
}) => {
  const history = useHistory();
  const { settings } = useGlobal();
  const [levelState, setLevelState] = useState<LevelState>({
    modalVisibility: false,
    selected: SponsorLevel.OTHER_SPONSORS,
    loading: false,
  });
  const [removeState, setRemoveState] = useState<RemoveState>({
    modalVisibility: false,
    loading: false,
  });

  // Level Handlers
  const handleShowLevelModal = (level: SponsorLevel) => {
    setLevelState(
      update(levelState, {
        modalVisibility: {
          $set: true,
        },
        selected: {
          $set: level,
        },
      }),
    );
  };
  const handleHideLevelModal = () => {
    setLevelState(
      update(levelState, {
        modalVisibility: {
          $set: false,
        },
        selected: {
          $set: SponsorLevel.OTHER_SPONSORS,
        },
      }),
    );
  };
  const handleChangeLevel = async () => {
    try {
      setLevelState(
        update(levelState, {
          loading: {
            $set: true,
          },
        }),
      );

      let levelEndpoint;

      switch (levelState.selected) {
        case SponsorLevel.SILVER:
          levelEndpoint = 'silver';
          break;

        case SponsorLevel.GOLD:
          levelEndpoint = 'gold';
          break;

        case SponsorLevel.PLATINUM:
          levelEndpoint = 'platinum';
          break;

        case SponsorLevel.DIAMOND:
          levelEndpoint = 'diamond';
          break;

        default:
          levelEndpoint = 'normal';
          break;
      }

      await API.get<ResponseData<Vendor>>(`/sponsor/${levelEndpoint}`, {
        params: {
          id: vendor.user_id,
        },
      });

      setLevelState(
        update(levelState, {
          loading: {
            $set: false,
          },
          modalVisibility: {
            $set: false,
          },
        }),
      );

      if (onChangeLevel) {
        void onChangeLevel(vendor);
      }
    } catch (err) {
      setLevelState(
        update(levelState, {
          loading: {
            $set: false,
          },
        }),
      );
    }
  };

  // Remove Handlers
  const handleShowRemoveModal = () => {
    setRemoveState(
      update(removeState, {
        modalVisibility: {
          $set: true,
        },
      }),
    );
  };
  const handleHideRemoveModal = () => {
    setRemoveState(
      update(removeState, {
        modalVisibility: {
          $set: false,
        },
      }),
    );
  };
  const handleRemove = async () => {
    try {
      setRemoveState(
        update(removeState, {
          loading: {
            $set: true,
          },
        }),
      );

      await API.delete<ResponseData<Vendor>>('/vendor/delete', {
        params: {
          id: vendor.user_id,
        },
      });

      notification.success({
        message: (
          <span>
            Removed vendor <strong>{vendor.vendor_name}</strong>
          </span>
        ),
      });

      setRemoveState(
        update(removeState, {
          modalVisibility: {
            $set: false,
          },
          loading: {
            $set: false,
          },
        }),
      );

      if (onRemove) {
        void onRemove();
      }
    } catch (err) {
      setRemoveState(
        update(removeState, {
          loading: {
            $set: false,
          },
        }),
      );
    }
  };

  const actionMenu = (
    <Menu>
      <SubMenu title='Sponsor Level' icon={<CreditCardOutlined />}>
        {settings.sponsor_levels.map((level) => (
          <Menu.Item
            key={level.key}
            onClick={() => handleShowLevelModal(level.value)}
          >
            <Flex alignItems='center'>
              {level.value === SponsorLevel.DIAMOND ? (
                <SketchOutlined color={getSponsorLevelColor(level.value)} />
              ) : (
                <CreditCardOutlined color={getSponsorLevelColor(level.value)} />
              )}
              <span className='ml-2'>{level.label}</span>
            </Flex>
          </Menu.Item>
        ))}
      </SubMenu>
      <Menu.Item
        onClick={() =>
          history.push({
            pathname: `${APP_PREFIX_PATH}/vendors/${vendor.user_id}`,
          })
        }
      >
        <Flex alignItems='center'>
          <EyeOutlined />
          <span className='ml-2'>View</span>
        </Flex>
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          history.push({
            pathname: `${APP_PREFIX_PATH}/vendors/edit/${vendor.user_id}`,
          })
        }
      >
        <Flex alignItems='center'>
          <EditOutlined />
          <span className='ml-2'>Edit</span>
        </Flex>
      </Menu.Item>
      {vendor.status !== UserStatus.DELETED && (
        <Menu.Item onClick={handleShowRemoveModal}>
          <Flex alignItems='center'>
            <DeleteOutlined />
            <span className='ml-2'>Remove</span>
          </Flex>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <>
      <EllipsisDropdown menu={actionMenu} />

      {/* Level Modal */}
      <Modal
        title='Confirm Level Change'
        visible={levelState.modalVisibility}
        confirmLoading={levelState.loading}
        maskClosable={false}
        okType='danger'
        okText='Yes'
        onOk={handleChangeLevel}
        onCancel={handleHideLevelModal}
      >
        <Space align='baseline'>
          <ExclamationCircleOutlined />
          <span>
            Change level to{' '}
            <strong>
              {
                settings.sponsor_levels.find(
                  (l) => l.value === levelState.selected,
                )?.label
              }
            </strong>
            ?
          </span>
        </Space>
      </Modal>

      {/* Remove Modal */}
      <Modal
        title='Confirm Removal'
        visible={removeState.modalVisibility}
        confirmLoading={removeState.loading}
        maskClosable={false}
        okType='danger'
        okText='Remove'
        onOk={handleRemove}
        onCancel={handleHideRemoveModal}
      >
        <Space align='baseline'>
          <ExclamationCircleOutlined />
          <span>
            Are you sure you want to remove vendor{' '}
            <strong>{vendor.vendor_name}</strong>?
          </span>
        </Space>
      </Modal>
    </>
  );
};

export default VendorActionButton;
