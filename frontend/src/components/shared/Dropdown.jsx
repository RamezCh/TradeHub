import { useEffect } from "react";

const Dropdown = ({ label, name, value, options, onChange, required }) => {
  useEffect(() => {
    if (!value && options.length > 0) {
      onChange({ target: { name, value: options[0].value } });
    }
  }, [value, options, onChange, name]);

  return (
    <div>
      <label className="block text-sm font-bold mb-2">{label}</label>
      <select
        name={name}
        value={value || (options.length > 0 ? options[0].value : "")}
        onChange={onChange}
        className="select select-bordered w-full"
        required={required}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
