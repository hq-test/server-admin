import React from 'react';

const EmptyList = ({ message = 'Empty List, You can define a new one' }) => {
  return <h2 style={{ color: 'gray' }}>{message}</h2>;
};

export default EmptyList;
