import IntroSection from "../components/HomePage/IntroSection";
import PopularSection from "../components/HomePage/PopularSection";
import SignUpNow from "../components/HomePage/SignUpNow";
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
    </div>
  );
};
export default HomePage;
