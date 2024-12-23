import { Link } from "react-router-dom";
const SignUpNow = () => {
  return (
    <div className="card bg-base-200 w-full shadow-xl relative mb-20 mt-20">
      <div className="card-body items-center text-center bg-opacity-50 flex flex-col justify-center">
        <p className="text-4xl font-bold mb-4">
          What are you waiting for? Start trading now!
        </p>
        <div className="card-actions">
          <Link to="/signup">
            <button className="btn bg-primary text-2xl">Join Now</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpNow;
