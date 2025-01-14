import { QRCodeCanvas } from "qrcode.react";

const QRCode = ({ code }) => {
  return (
    <div className="inline-flex flex-col items-center bg-base-100 justify-center p-6 text-primary rounded-lg shadow-lg max-w-md">
      <h3 className="text-2xl font-bold mb-4">Scan this QR Code</h3>
      <div className="mb-4 p-4 bg-neutral rounded-lg">
        <QRCodeCanvas value={code} size={256} className="rounded-lg" />
      </div>
      <p className="text-lg font-mono bg-accent text-accent-content p-2 rounded-lg break-all">
        {code}
      </p>
    </div>
  );
};

export default QRCode;
