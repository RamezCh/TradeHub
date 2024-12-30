const InputField = ({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  required,
}) => (
  <div>
    <label className="block text-sm font-bold mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={type === "number" ? Number(value) : value}
      onChange={onChange}
      className="input input-bordered w-full"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export default InputField;
