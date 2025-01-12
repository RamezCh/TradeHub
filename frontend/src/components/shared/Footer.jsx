import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer footer-center bg-base-200 text-base-content rounded p-10">
      <nav className="grid grid-flow-col gap-4">
        <Link to="/about-us" className="link link-hover">
          About us
        </Link>
        <Link to="/contact-us" className="link link-hover">
          Contact
        </Link>
        <Link to="/faq" className="link link-hover">
          F.A.Q
        </Link>
      </nav>
      <aside>
        <p>
          Copyright © {new Date().getFullYear()} - All right reserved by
          TradeHub
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
