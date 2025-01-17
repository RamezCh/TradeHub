const TextArea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  maxLength,
}) => (
  <div>
    <label className="block text-sm font-bold mb-2">{label}</label>
    <textarea
      name={name}
      value={
        value.length == maxLength
          ? value.slice(0, maxLength - 3) + "..."
          : value
      }
      onChange={onChange}
      className="textarea textarea-bordered w-full"
      placeholder={placeholder}
      required={required}
      maxLength={maxLength}
    ></textarea>
  </div>
);

export default TextArea;
