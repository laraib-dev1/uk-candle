import React from "react";

const feedbacks = [
  {
    name: "Esther Howard",
    role: "Client",
    text: "Uma cursus eget nunc scelerisque viverra mauris in aliquam. Suspendisse.",
    img: "/assets/client1.png",
  },
  {
    name: "Eleanor Pena",
    role: "Client",
    text: "Pulvinar etiam non quam lacus. Pellentesque dignissim enim sit amet.",
    img: "/assets/client2.png",
  },
  {
    name: "Annette Black",
    role: "Client",
    text: "Feugiat vivamus at augue eget arcu dictum varius. At in tellus integer.",
    img: "/assets/client3.png",
  },
];

const ClientFeedback = () => {
  return (
    <section className="bg-gradient-to-r from-[#f9ede6] to-[#fef9f7] py-16 text-center">
      <h2 className="text-2xl italic text-gray-700 font-serif mb-10">
        Client Feedback
      </h2>

      <div className="flex flex-wrap justify-center gap-6 px-6">
        {feedbacks.map((item, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-md p-6 max-w-xs flex flex-col items-start text-left"
          >
            <p className="text-gray-600 text-sm mb-6">
              <span className="text-2xl text-orange-400 font-serif">“</span>
              {item.text}
            </p>
            <div className="flex items-center gap-3 mt-auto">
              <img
                src={item.img}
                alt={item.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-gray-500">/ {item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ClientFeedback;
