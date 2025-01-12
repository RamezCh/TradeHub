import { HelpCircle } from "lucide-react";

const FAQPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-2">
        <HelpCircle className="w-8 h-8" /> Frequently Asked Questions
      </h1>

      <div className="space-y-4">
        {/* FAQ Item 1 */}
        <div className="collapse collapse-arrow bg-base-200">
          <input type="radio" name="faq-accordion" defaultChecked />
          <div className="collapse-title text-xl font-medium">
            How do I start trading on TradeHub?
          </div>
          <div className="collapse-content">
            <p>
              To start trading, simply browse the available items or services,
              initiate a chat with the seller, and agree on the terms. Once
              agreed, you can create an offer to finalize the trade.
            </p>
          </div>
        </div>

        {/* FAQ Item 2 */}
        <div className="collapse collapse-arrow bg-base-200">
          <input type="radio" name="faq-accordion" />
          <div className="collapse-title text-xl font-medium">
            Can I trade items for services or money?
          </div>
          <div className="collapse-content">
            <p>
              Yes, TradeHub allows you to trade items for services, money, or
              other items. You can also trade services for items, money, or
              other services.
            </p>
          </div>
        </div>

        {/* FAQ Item 3 */}
        <div className="collapse collapse-arrow bg-base-200">
          <input type="radio" name="faq-accordion" />
          <div className="collapse-title text-xl font-medium">
            Is TradeHub safe to use?
          </div>
          <div className="collapse-content">
            <p>
              Yes, TradeHub prioritizes user safety. We recommend verifying the
              details of the trade and communicating through our platform to
              ensure a secure transaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
