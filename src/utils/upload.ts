import { UploadChangeParam } from 'antd/lib/upload';

export function normFile(
  ...e: UploadChangeParam[]
): UploadChangeParam[] | UploadChangeParam['fileList'] {
  if (Array.isArray(e) && e.length > 1) {
    return e;
  }

  return e[0] && e[0].fileList;
}

export function getBase64(file: Blob): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
