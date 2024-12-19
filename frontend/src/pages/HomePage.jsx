import IntroSection from "../components/HomePage/IntroSection";
import PopularSection from "../components/HomePage/PopularSection";
import SignUpNow from "../components/HomePage/SignUpNow";
import Footer from "../components/shared/Footer";
const HomePage = () => {
  return (
    <div>
      {/* Encourage the user to sign in or sign up and have search bar to search for products */}
      <IntroSection />
      {/* Popular Services */}
      <PopularSection type="service" />
      {/* Popular Items */}
      <PopularSection type="item" />
      {/* Sign Up Now */}
      <SignUpNow />
      {/* Footer */}
      <Footer />
    </div>
  );
};
export default HomePage;
