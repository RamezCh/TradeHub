import { ShoppingCart } from "lucide-react";

const ItemCard = ({ item }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <figure>
        <img src={item.imageUrl} alt={item.title} className="w-full" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{item.title}</h2>
        <p>{item.description}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary flex items-center">
            <ShoppingCart size={16} className="mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
