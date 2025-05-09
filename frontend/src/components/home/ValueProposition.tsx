import { DollarSign, TrendingUp, Leaf, Users } from "lucide-react";

const features = [
  {
    icon: <DollarSign className="h-7 w-7 text-green-700" />,
    title: "Save Money",
    description:
      "Why buy when you can rent? Access thousands of items at a fraction of the cost.",
  },
  {
    icon: <TrendingUp className="h-7 w-7 text-green-700" />,
    title: "Earn Extra Income",
    description:
      "Turn your unused items into a steady income stream. Set your own rates and availability.",
  },
  {
    icon: <Leaf className="h-7 w-7 text-green-700" />,
    title: "Sustainable Living",
    description:
      "Reduce waste and environmental impact by sharing resources within your community.",
  },
  {
    icon: <Users className="h-7 w-7 text-green-700" />,
    title: "Build Community",
    description:
      "Connect with neighbors, share experiences, and build lasting relationships in your local area.",
  },
];

const ValueProposition = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <span className="inline-block text-xs font-semibold bg-green-100 text-green-700 px-4 py-1 rounded-full mb-3 tracking-wide">
            Our Benefits
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-green-800 mb-3">
            Why Choose Bhara?
          </h2>
          <p className="text-green-700/80 mb-3 text-sm md:text-base">
          Rent anything you need or earn from what you own—Bhara handles everything from security checks to delivery, ensuring a safe and seamless experience for both renters and owners.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/90 border border-green-100 rounded-xl shadow-sm p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-lg animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-green-800 text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-green-700 text-sm/6">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
