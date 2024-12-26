import { Link } from "react-router-dom";
import SearchBar from "../shared/SearchBar";

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
          {/* Search Bar */}
          <SearchBar />
          <Link to="/signup">
            <button className="btn btn-primary mt-3">Join Now</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IntroSection;
