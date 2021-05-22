import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Modal, Button } from 'antd';
import { toast } from 'react-toastify';
import { StarOutlined } from '@ant-design/icons';

const RatingModal = ({ isUser, token, children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const { asPath } = router;
  console.log('asPath: ', asPath);
  console.log('router: ', router);
  // console.log({ isUser });
  // console.log({ token });

  const handleModal = () => {
    if (!isUser && token) {
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
