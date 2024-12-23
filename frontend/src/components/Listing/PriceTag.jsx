const PriceTag = ({ price }) => {
  return (
    <div className="mt-4">
      <h3 className="text-2xl font-bold text-red-500">{price}</h3>
    </div>
  );
};

export default PriceTag;
