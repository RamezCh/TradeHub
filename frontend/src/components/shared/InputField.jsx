const InputField = ({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  maxLength,
  required,
}) => {
  const displayValue =
    type === "number"
      ? value
      : maxLength && value.length > maxLength
      ? value.slice(0, maxLength - 3) + "..."
      : value;

  return (
    <div>
      <label className="block text-sm font-bold mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={displayValue}
        onChange={onChange}
        className="input input-bordered w-full"
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
      />
    </div>
  );
};

export default InputField;
