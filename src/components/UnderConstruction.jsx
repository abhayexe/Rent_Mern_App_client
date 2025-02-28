import { useState } from "react";

const UnderConstruction = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      name: "User Plan",
      price: "$9.99/month",
      features: ["Free and Faster delivery", "Flexible Cancellation Policy", "Extra rent points","discounts on longer rents"],
    },
    {
      name: "Provider Plan",
      price: "$19.99/month",
      features: ["Zero Comissions", "More warehouse space", "View customer points","better product promotion"],
    },
    {
      name: "Super Plan",
      price: "$29.99/month",
      features: ["All Pro features of both the previous plans", "24/7 support", "Unlimited storage", "Exclusive content"],
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl lg:text-4xl font-bold text-yellow-400 mb-6">Choose Your Plan</h1>
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl w-full">
        {plans.map((plan, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-4">{plan.name}</h2>
            <p className="text-xl font-bold mb-4">{plan.price}</p>
            <ul className="mb-6 text-gray-300">
              {plan.features.map((feature, i) => (
                <li key={i} className="mb-2">✔ {feature}</li>
              ))}
            </ul>
            <button 
              className="bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 transition"
              onClick={() => setSelectedPlan(plan)}
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
      {selectedPlan && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-md">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Confirm Subscription</h2>
            <p className="text-lg mb-4">Are you sure you want to subscribe to the {selectedPlan.name} for {selectedPlan.price}?</p>
            <div className="flex justify-center gap-4">
              <button 
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                onClick={() => alert(`Subscribed to ${selectedPlan.name}`)}
              >
                Confirm
              </button>
              <button 
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                onClick={() => setSelectedPlan(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnderConstruction;