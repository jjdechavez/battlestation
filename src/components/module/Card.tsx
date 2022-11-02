import React from 'react';

const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='w-full bg-white border border-gray-200 rounded-xl shadow-sm'>
      <div className='p-4 sm:p-7'>{children}</div>
    </div>
  );
};

export default Card;
