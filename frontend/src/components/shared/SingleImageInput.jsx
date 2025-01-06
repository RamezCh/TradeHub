import { Trash } from "lucide-react";

const SingleImageInput = ({
  label = "image",
  imageUrl,
  onUpload,
  onRemove,
}) => (
  <div>
    <label className="block text-sm font-bold mb-2">
      {label
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")}
    </label>
    {!imageUrl ? (
      <input
        type="file"
        accept="image/*"
        onChange={onUpload}
        className="file-input file-input-bordered w-full"
      />
    ) : (
      <div className="relative w-24 h-24">
        <img
          src={imageUrl}
          alt="Uploaded"
          className="w-full h-full object-cover rounded-lg shadow"
        />
        <button
          type="button"
          className="absolute top-0 right-0 btn btn-xs btn-circle btn-error"
          onClick={onRemove}
        >
          <Trash size={16} />
        </button>
      </div>
    )}
  </div>
);

export default SingleImageInput;
