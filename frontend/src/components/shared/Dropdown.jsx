const Dropdown = ({
  label,
  name,
  value,
  options,
  onChange,
  required,
  transformValue = true,
}) => (
  <div>
    <label className="block text-sm font-bold mb-2">{label}</label>
    <select
      name={name}
      value={transformValue ? value.toLowerCase() : value}
      onChange={onChange}
      className="select select-bordered w-full"
      required={required}
    >
      {options.map((option, index) => (
        <option
          key={index}
          value={transformValue ? option.value.toLowerCase() : option.value}
        >
          {transformValue ? option.label.toLowerCase() : option.label}
        </option>
      ))}
    </select>
  </div>
);

export default Dropdown;
