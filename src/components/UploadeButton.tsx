import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Image, message, Typography, Upload } from "antd";
import type { GetProp, UploadProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../Redux/Store";
import { uploadCustomerBill } from "../Redux/Slice/CustomerSlice";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface UploadeButtonProps {
  customerId: string;
}

const { Text } = Typography;

const beforeUpload = (file: FileType) => {
  const isValidImage = ["image/jpeg", "image/png"].includes(file.type);
  if (!isValidImage) {
    message.error("You can only upload JPG or PNG files");
  }

  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error("Image must be smaller than 5MB");
  }

  return isValidImage && isLt5M;
};

const UploadeButton = ({ customerId }: UploadeButtonProps) => {
  console.log("Rendering UploadeButton for customerId:", customerId);
  const dispatch = useDispatch<AppDispatch>();
  const uploadState = useSelector(
    (state: RootState) =>
      state.customers.billUploads[customerId] ?? {
        loading: false,
        error: null,
        images: [],
      }
  );

  const handleUpload: UploadProps["customRequest"] = async ({ file, onError, onSuccess }) => {
    try {
      await dispatch(uploadCustomerBill({ customerId, file: file as File })).unwrap();
      message.success("Bill image uploaded");
      onSuccess?.("ok");
    } catch (error) {
      const errorMessage = typeof error === "string" ? error : "Failed to upload bill image";
      message.error(errorMessage);
      onError?.(new Error(errorMessage));
    }
  };

  return (
    <div className="mt-5 border-t border-gray-200 pt-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-base font-semibold text-gray-900">Bill Images</h4>
          {uploadState.error && <Text type="danger">{uploadState.error}</Text>}
        </div>
        <Upload
          accept="image/jpeg,image/png"
          beforeUpload={beforeUpload}
          customRequest={handleUpload}
          disabled={uploadState.loading}
          showUploadList={false}
        >
          <Button
            icon={uploadState.loading ? <LoadingOutlined /> : <UploadOutlined />}
            loading={uploadState.loading}
            type="primary"
            className="bg-blue-600"
          >
            Upload Bill
          </Button>
        </Upload>
      </div>

      {uploadState.images.length > 0 ? (
        <Image.PreviewGroup>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {uploadState.images.map((imageUrl, index) => (
              <div
                className="h-28 overflow-hidden rounded border border-gray-200 bg-white"
                key={`${imageUrl}-${index}`}
              >
                <Image
                  alt={`Bill ${index + 1}`}
                  className="h-full w-full object-cover"
                  height="100%"
                  src={imageUrl}
                  width="100%"
                />
              </div>
            ))}
          </div>
        </Image.PreviewGroup>
      ) : (
        <div className="mt-3 text-sm italic text-gray-500">No bill images uploaded yet</div>
      )}
    </div>
  );
};

export default UploadeButton;
