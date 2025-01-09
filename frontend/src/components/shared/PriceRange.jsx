const PriceRange = ({
  min = 0,
  max = 1000,
  step = 1,
  value,
  onChange = () => {},
}) => {
  const handleMinChange = (e) => {
    const newMin = parseInt(e.target.value, 10);
    if (newMin <= value.max) {
      onChange({ min: newMin, max: value.max });
    }
  };

  const handleMaxChange = (e) => {
    const newMax = parseInt(e.target.value, 10);
    if (newMax >= value.min) {
      onChange({ min: value.min, max: newMax });
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-base-100 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-semibold">Price Range</span>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-sm font-medium">Min:</span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.min}
          onChange={handleMinChange}
          className="flex-1 range range-primary"
        />
        <span className="text-sm font-medium">{value.min}</span>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-sm font-medium">Max:</span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.max}
          onChange={handleMaxChange}
          className="flex-1 range range-primary"
        />
        <span className="text-sm font-medium">{value.max}</span>
      </div>
      <span className="text-sm font-medium">
        Selected Range: {value.min} - {value.max}
      </span>
    </div>
  );
};

export default PriceRange;
