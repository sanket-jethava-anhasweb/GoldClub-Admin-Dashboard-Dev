import React, { useState } from 'react';
import { Modal, Upload, Select, Input, Button } from 'antd';
import { UploadOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';

const { Option } = Select;

const CustomModal = ({ visible, onCancel, onSave }) => {
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const [selectedOption, setSelectedOption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [textInput, setTextInput] = useState('');

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  const handleImageUpload = (info) => {
    if (info.file.status === 'done') {
      // Handle successful file upload
      setImageFile(info.file.originFileObj);
    } else if (info.file.status === 'error') {
      // Handle file upload error
      console.error('File upload failed:', info.file.error);
    }
  };

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  const handleSave = () => {
    // Perform any additional logic with the selectedOption, imageFile, and textInput
    // ...

    // Call the onSave callback
    onSave();

    // Close the modal
    onCancel();
  };

  const handleCancel = () => {
    // Call the onCancel callback
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      title="Custom Modal"
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel} icon={<CloseOutlined />}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave} icon={<SaveOutlined />}>
          Save
        </Button>,
      ]}
    >
      <Upload
        showUploadList={false}
        beforeUpload={() => false} // Prevent automatic upload, handle in custom logic
        onChange={handleImageUpload}
      >
        <Button icon={<UploadOutlined />}>Upload Image</Button>
      </Upload>

      <Select
        style={{ width: '100%', margin: '16px 0' }}
        placeholder="Select an option"
        onChange={handleOptionChange}
      >
        <Option value="GPAY">GPAY</Option>
        <Option value="Net Banking">Net Banking</Option>
        <Option value="Bank Transfer">Bank Transfer</Option>
      </Select>

      <Input
        placeholder="Enter text"
        value={textInput}
        onChange={handleTextChange}
      />
    </Modal>
  );
};

export default CustomModal;
