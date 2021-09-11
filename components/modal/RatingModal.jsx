import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Modal, Button } from 'antd';
import { toast } from 'react-toastify';
import { StarOutlined } from '@ant-design/icons';

const RatingModal = ({ isUser, children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const { asPath } = router;

  const handleModal = () => {
    if (isUser) {
      setModalVisible(true);
    } else {
      // router.push('/login');
      router.push({
        pathname: '/login',
        query: { from: asPath },
      });
    }
  };

  return (
    <>
      <div onClick={handleModal}>
        <StarOutlined className="text-danger" /> <br />{' '}
        {isUser ? 'Leave rating' : 'Login to leave rating'}
      </div>
      <Modal
        title="Leave your rating"
        centered
        visible={modalVisible}
        onOk={() => {
          setModalVisible(false);
          toast.success('Thanks for your review. It will apper soon');
        }}
        onCancel={() => setModalVisible(false)}
      >
        {children}
      </Modal>
    </>
  );
};

export default RatingModal;
