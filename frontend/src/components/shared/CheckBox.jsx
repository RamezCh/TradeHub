import { CheckSquare, Square } from "lucide-react";

const CheckBox = ({
  label,
  options,
  selectedOptions,
  onChange,
  direction = "column",
}) => {
  const layoutClass =
    direction === "row" ? "flex-row gap-4" : "flex-col space-y-2";

  const handleCheckboxChange = (option) => {
    const lowercasedOption = option.toLowerCase();
    if (selectedOptions.includes(lowercasedOption)) {
      onChange(
        selectedOptions.filter((selected) => selected !== lowercasedOption)
      );
    } else {
      onChange([...selectedOptions, lowercasedOption]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-bold mb-2">{label}</label>
      <div className={`flex ${layoutClass}`}>
        {options.map((option) => {
          const lowercasedOption = option.toLowerCase();
          return (
            <div
              key={lowercasedOption}
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={() => handleCheckboxChange(option)}
            >
              {selectedOptions.includes(lowercasedOption) ? (
                <CheckSquare className="text-blue-500" size={20} />
              ) : (
                <Square className="text-gray-500" size={20} />
              )}
              <span className="text-sm capitalize">{option}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckBox;
