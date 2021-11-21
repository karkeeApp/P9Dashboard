import { FC } from 'react';
import { PlusOutlined } from '@ant-design/icons';

const UploadButton: FC = () => (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);

export default UploadButton;
