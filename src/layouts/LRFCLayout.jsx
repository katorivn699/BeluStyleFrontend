import React from 'react';

export const UserForm = ({ children }) => {
  return (
    <div className="flex justify-center min-h-[calc(100vh-100px)] w-screen bg-white overflow-x-hidden"> 
      <div className="bg-white p-2 rounded w-full max-w-screen-md"> 
        {children}
      </div>
    </div>
  );
};