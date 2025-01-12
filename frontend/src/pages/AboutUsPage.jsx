import { Users } from "lucide-react";

const AboutUsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-2">
        <Users className="w-8 h-8" /> About Us
      </h1>

      <div className="max-w-2xl mx-auto text-center">
        <p className="text-lg mb-4">
          Welcome to TradeHub, your go-to platform for trading items and
          services with ease. Whether you&apos;re looking to exchange goods,
          offer services, or negotiate deals, TradeHub connects you with the
          right people.
        </p>
        <p className="text-lg mb-4">
          Our mission is to create a seamless and secure trading experience for
          everyone. We believe in the power of community and the value of fair
          trade.
        </p>
        <p className="text-lg">
          Join TradeHub today and start trading with confidence!
        </p>
      </div>
    </div>
  );
};

export default AboutUsPage;
