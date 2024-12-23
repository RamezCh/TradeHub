import { Link } from "react-router-dom";

const SignUpNow = () => {
  return (
    <div className="hero bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hey!</h1>
          <p className="py-6 text-4xl">
            What are you waiting for? Start trading now!
          </p>
          <Link to="/signup">
            <button className="btn btn-primary">Get Started</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpNow;
