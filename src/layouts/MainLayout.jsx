import React from "react";

const MainLayout = ({ children }) => {
  return (
    <div className="center bg-white min-h-[calc(100vh-100px)] desktop-125:w-3xl">
      <div className="container mx-auto max-w-screen-md p-2 rounded bg-white">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
