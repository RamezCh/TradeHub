import { Link } from "react-router-dom";

const IntroSection = () => {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: "url(/TradeHub-Intro.jpg)",
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="mb-5 text-7xl font-bold">TradeHub</h1>
          <p className="mb-5 text-3xl">
            Unlock endless possibilities and start trading today!
          </p>
          <label className="mb-5 input input-bordered flex items-center gap-2">
            <input type="text" className="grow" placeholder="Search" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          <Link to="/signup">
            <button className="btn btn-primary">Join Now</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IntroSection;
