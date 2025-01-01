import { MapPin, Info, List, HandCoins } from "lucide-react";

const ListingInfo = ({
  description,
  condition,
  location,
  category,
  otherPaymentForms,
}) => {
  const infoItems = [
    {
      icon: <Info className="text-secondary w-6 h-6" />,
      title: "Description",
      content: description,
    },
    {
      icon: <List className="text-secondary w-6 h-6" />,
      title: "Condition",
      content: condition,
    },
    {
      icon: <MapPin className="text-secondary w-6 h-6" />,
      title: "Location",
      content: location,
    },
    {
      icon: <List className="text-secondary w-6 h-6" />,
      title: "Category",
      content: category,
    },
    {
      icon: <HandCoins className="text-secondary w-6 h-6" />,
      title: "Other Payment Forms",
      content: otherPaymentForms,
    },
  ];

  return (
    <div className="bg-base-200 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-primary">Listing Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {infoItems.map((item, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex-shrink-0">{item.icon}</div>
            <div>
              <h3 className="text-lg font-semibold text-secondary">
                {item.title}
              </h3>
              <p className="text-gray-700">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingInfo;
