import React from "react";
import {
  ShieldCheck,
  CheckCircle,
  ShieldOff,
  MessageSquare,
} from "lucide-react";
import "../../styles/main.css";

const trustFeatures = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-green-700" />,
    title: "Verified Community",
    description:
      "All users undergo ID verification and background checks before participating",
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-green-700" />,
    title: "Admin-Approved Listings",
    description:
      "Every listing is manually verified by our team before being published",
  },
  {
    icon: <ShieldOff className="h-8 w-8 text-green-700" />,
    title: "Damage Protection",
    description:
      "Security deposits held in escrow until safe return confirmation",
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-green-700" />,
    title: "Mediation Support",
    description:
      "Dedicated team resolves disputes and oversees product handoffs/returns",
  },
];

const TrustSafety = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <span
            className="inline-block px-4 py-1.5 text-xs md:text-sm font-medium rounded-full bg-green-600/10 text-green-600 mb-4"
            style={{ fontSize: "0.68rem" }}
          >
            Safe Transactions
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-green-900 mb-3 text-center">
            Company-Mediated Assurance
          </h2>
          <p className="text-green-700/80 mb-3 text-center text-[0.85rem] md:text-base">
            We handle the complexities so you can rent with confidence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {trustFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white/90 border border-green-100 rounded-xl shadow-sm p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-lg animate-fade-up lg:min-w-[17rem] lg:max-w-[22rem] w-full"
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-green-700 text-lg text-center mb-2">
                {feature.title}
              </h3>
              <p className="text-center text-gray-500 text-[0.82rem]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div
          className="flex justify-center mt-12 animate-fade-up"
          style={{ animationDelay: "750ms" }}
        >
          <button className="bg-transparent border border-green-600 text-green-700 hover:bg-green-600 hover:text-white transition-colors duration-300 font-medium rounded-full px-8 py-3">
            Learn More About Trust & Safety
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrustSafety;
