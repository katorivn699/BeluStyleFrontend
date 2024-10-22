import React from "react";
import { Field, ErrorMessage } from "formik";

export const InputField = ({ label, name, type = "text", placeholder, ...rest }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-500 text-xl mb-2">
        {label}
      </label>
      <Field
        name={name}
        type={type}
        id={name}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 transition-all duration-200 outline-none text-lg"
        placeholder={placeholder}
        {...rest}
      />
      <ErrorMessage
        name={name}
        component="p"
      className="text-red-500 text-sm"
      />
    </div>
  );
};

export const UserInfoField = ({label, name, type = "text", value, placeholder}) => {
  <div className="mb-4">
    <label htmlFor={name} className="block text-gray-500 text-xl mb-2">
        {label}
      </label>
      <InputField
        name={name}
        type={type}
        id={name}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 transition-all duration-200 outline-none text-lg"
        placeholder={placeholder}
        value={value}
      />
  </div>
}

