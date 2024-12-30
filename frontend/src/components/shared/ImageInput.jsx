import { Trash } from "lucide-react";

const ImageInput = ({ imageUrls, onUpload, onRemove }) => (
  <div>
    <label className="block text-sm font-bold mb-2">Images</label>
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={onUpload}
      className="file-input file-input-bordered w-full"
    />
    <div className="mt-4 flex gap-4">
      {imageUrls.map((url, index) => (
        <div key={index} className="relative">
          <img
            src={url}
            alt="Uploaded"
            className="w-24 h-24 object-cover rounded-lg shadow"
          />
          <button
            type="button"
            className="absolute top-0 right-0 btn btn-xs btn-circle btn-error"
            onClick={() => onRemove(index)}
          >
            <Trash size={16} />
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default ImageInput;
