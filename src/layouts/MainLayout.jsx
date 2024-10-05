import React from "react";

const MainLayout = ({ children }) => {
  return (
    <div className="center min-h-[calc(100vh-100px)] desktop-100:w-2xl">
      <div className="container mx-auto max-w-screen-md p-2 rounded">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
