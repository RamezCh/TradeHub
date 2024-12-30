const Textarea = ({ label, name, value, onChange, placeholder, required }) => (
  <div>
    <label className="block text-sm font-bold mb-2">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className="textarea textarea-bordered w-full"
      placeholder={placeholder}
      required={required}
    ></textarea>
  </div>
);

export default Textarea;
