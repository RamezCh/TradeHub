const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <>
      <div className="hidden lg:flex flex-col items-center justify-center bg-base-200 p-12">
        {/* Container for TH */}
        <div className="flex items-center justify-center space-x-4">
          {/* Grid for the letter T */}
          <div className="grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => {
              const isT = i === 1 || i === 4 || i === 7 || (i >= 0 && i <= 2);
              return (
                <div
                  key={i}
                  className={`aspect-square w-24 rounded-2xl ${
                    isT ? "bg-primary/10" : "bg-transparent"
                  } ${i % 2 === 0 ? "animate-pulse" : ""}`}
                />
              );
            })}
          </div>
          {/* Grid for the letter H */}
          <div className="grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => {
              const isH =
                i === 0 || i === 2 || i === 6 || i === 8 || (i >= 3 && i <= 5);
              return (
                <div
                  key={i}
                  className={`aspect-square w-24 rounded-2xl ${
                    isH ? "bg-primary/10" : "bg-transparent"
                  } ${i % 2 === 0 ? "animate-pulse" : ""}`}
                />
              );
            })}
          </div>
        </div>
        {/* Container for title and subtitle */}
        <div className="text-center mt-8">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-base-content/60">{subtitle}</p>
        </div>
      </div>
    </>
  );
};

export default AuthImagePattern;
