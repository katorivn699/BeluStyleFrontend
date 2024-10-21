const RadioCommon = ({ value, current, handleChecked, context }) => {
  return (
    <div className="selection">
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="radio"
          name="payment"
          id={value}
          className="hidden peer"
          checked={current === value}
          value={value}
          onClick={handleChecked}
        />
        <span className="h-5 w-5 rounded-full border-2 border-gray-300 peer-checked:bg-blue-600 peer-checked:border-transparent transition-colors duration-300 ease-in-out transform peer-checked:scale-110"></span>
        <span className="ml-2 text-gray-700">{context}</span>
      </label>
    </div>
  );
};

export default RadioCommon;
