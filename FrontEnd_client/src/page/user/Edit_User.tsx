import React, { useState } from 'react';

function Edit_User() {
  const [message, setMessage] = useState("Chào mừng bạn đến với trang React đơn giản!");

  const handleClick = () => {
    setMessage("Bạn vừa bấm nút!");
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Trang React Đơn Giản</h1>
      <p>{message}</p>
      <button onClick={handleClick}>Bấm vào đây</button>
    </div>
  );
}

export default Edit_User;
