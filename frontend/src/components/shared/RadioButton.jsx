import { Circle, CheckCircle } from "lucide-react";

const RadioButton = ({
  label,
  options,
  selectedOption,
  onChange,
  direction = "column", // Default is column layout
}) => {
  const layoutClass =
    direction === "row" ? "flex-row gap-4" : "flex-col space-y-2";

  return (
    <div>
      <label className="block text-sm font-bold mb-2">{label}</label>
      <div className={`flex ${layoutClass}`}>
        {options.map((option) => (
          <div
            key={option}
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => onChange(option.toLowerCase())}
          >
            {selectedOption === option.toLowerCase() ? (
              <CheckCircle className="text-blue-500" size={20} />
            ) : (
              <Circle className="text-gray-500" size={20} />
            )}
            <span className="text-sm capitalize">{option}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadioButton;
