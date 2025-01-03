import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

const PasswordInput = ({
  label,
  value,
  onChange,
  placeholder,
  showPassword: externalShowPassword,
  togglePasswordVisibility: externalTogglePasswordVisibility,
}) => {
  const [internalShowPassword, setInternalShowPassword] = useState(false);

  const showPassword =
    externalShowPassword !== undefined
      ? externalShowPassword
      : internalShowPassword;
  const togglePasswordVisibility =
    externalTogglePasswordVisibility !== undefined
      ? externalTogglePasswordVisibility
      : () => setInternalShowPassword(!internalShowPassword);

  return (
    <div className="form-control w-full mb-5">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="size-5 text-base-content/40" />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          className="input input-bordered w-full pl-10"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <EyeOff className="size-5 text-base-content/40" />
          ) : (
            <Eye className="size-5 text-base-content/40" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
