import React from "react";

interface BusinessMapProps {
  link: string;
}

export const LanguageSelector: React.FC<BusinessMapProps> = ({ link }) => {
  return (
    <div className="business-map">
      <iframe
        title="Google Maps"
        src={link}
        width="100%"
        height="450"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};
