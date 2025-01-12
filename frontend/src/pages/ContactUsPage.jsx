import { Mail, MapPin, Phone } from "lucide-react";

const ContactUsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Email */}
        <div className="flex items-center gap-4">
          <Mail className="w-6 h-6" />
          <div>
            <p className="text-lg font-semibold">Email</p>
            <p>support@tradehub.com</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-4">
          <Phone className="w-6 h-6" />
          <div>
            <p className="text-lg font-semibold">Phone</p>
            <p>+1 (123) 456-7890</p>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center gap-4">
          <MapPin className="w-6 h-6" />
          <div>
            <p className="text-lg font-semibold">Address</p>
            <p>123 TradeHub Street, Suite 456, Trade City, TC 78901</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
