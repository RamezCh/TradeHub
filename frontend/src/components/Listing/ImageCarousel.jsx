const ImageCarousel = ({ images }) => {
  // Ensure the images prop is passed correctly
  return (
    <div className="carousel w-full">
      {images.map((image, index) => (
        <div
          key={index}
          id={`slide${index}`}
          className="carousel-item relative w-full"
        >
          <img
            src={image}
            alt={`Slide ${index + 1}`}
            className="w-full rounded-lg"
          />
          <div className="absolute flex justify-between transform -translate-y-1/2 top-1/2 w-full px-4">
            <a
              href={`#slide${(index - 1 + images.length) % images.length}`}
              className="btn btn-circle"
            >
              ❮
            </a>
            <a
              href={`#slide${(index + 1) % images.length}`}
              className="btn btn-circle"
            >
              ❯
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageCarousel;
