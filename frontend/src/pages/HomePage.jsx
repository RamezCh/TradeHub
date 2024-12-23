import IntroSection from "../components/HomePage/IntroSection";
import PopularSection from "../components/HomePage/PopularSection";
import SignUpNow from "../components/HomePage/SignUpNow";

const marginBetweenSections = "mb-10";

const HomePage = () => {
  return (
    <div>
      {/* Encourage the user to sign in or sign up and have search bar to search for products */}
      <div className={marginBetweenSections}>
        <IntroSection />
      </div>
      {/* Popular Services */}
      <div className={marginBetweenSections}>
        <PopularSection type="service" />
      </div>

      {/* Sign Up Now */}
      <div className={marginBetweenSections}>
        <SignUpNow />
      </div>

      {/* Popular Items */}
      <div className={marginBetweenSections}>
        <PopularSection type="item" />
      </div>
    </div>
  );
};
export default HomePage;
