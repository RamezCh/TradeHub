import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1510596713412-56030de252c8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Oops! Page Not Found!</h1>
          <p className="mb-5">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable or perhaps you just mistyped
            the URL.
          </p>
          <Link to="/">
            <button className="btn btn-primary">Visit Home Page</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
