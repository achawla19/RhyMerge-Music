import React from "react";
import who1 from "../assets/who1.jpg";
import who2 from "../assets/who2.jpg";
import who3 from "../assets/who3.jpg";

const WhoFor = () => {
  const personas = [
    {
      image: who1,
      title: "Music Producers",
      subtitle: "Create beats and collaborate on production",
      alt: "Music producer working in studio with equipment",
    },
    {
      image: who2,
      title: "Vocalists",
      subtitle: "Share your voice and find your sound",
      alt: "Vocalist recording in professional studio",
    },
    {
      image: who3,
      title: "Sound Engineers",
      subtitle: "Mix, master, and perfect the audio",
      alt: "Sound engineer working on mixing board",
    },
  ];

  return (
    <section className="py-20 px-6">
      <div className=" w-full">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
          Who is RhyMerge For?
        </h2>
        <p className="text-xl text-gray-400 text-center mb-16 w-full">
          Whether you're laying down beats, recording vocals, or perfecting the
          mix, RhyMerge brings your skills together.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {personas.map((persona, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group"
            >
              {/* Circular Avatar */}
              <div className="relative mb-6">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#7B61FF] shadow-xl shadow-[#7B61FF]/20 transform group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={persona.image}
                    alt={persona.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative ring */}
                <div
                  className="absolute inset-0 w-48 h-48 rounded-full border-2 border-[#E36FFF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ transform: "scale(1.1)" }}
                />
              </div>

              {/* Text Content */}
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#7B61FF] transition-colors duration-300">
                {persona.title}
              </h3>
              <p className="text-gray-400 text-lg">{persona.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoFor;
