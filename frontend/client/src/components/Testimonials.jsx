import { testimonials } from "../constants";
import Image from "next/image";

const Testimonials = ({ width, bg }) => {
  return (
    <div className={`mt-20 tracking-wide ${bg && "bg-white shadow rounded-lg p-6 mb-6"}`}>
      {/* Title with Gold Accent */}
      <h2
        className={`${
          bg
            ? "text-xl font-semibold mb-4"
            : "text-3xl sm:text-5xl lg:text-6xl text-center my-10 lg:my-20 text-gray-900"
        }`}
      >
        What People are Saying{" "}
        <span className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-transparent bg-clip-text">
          about us
        </span>
      </h2>

      {/* Testimonials */}
      <div className="flex flex-wrap justify-center">
        {testimonials.map((testimonial, index) => (
          <div key={index} className={`w-full sm:w-1/2 lg:w-1/${width} px-4 py-2`}>
            <div className="rounded-md p-6 text-md border border-neutral-200 bg-white font-thin shadow-sm">
              <p className="text-neutral-800">{testimonial.text}</p>
              <div className="flex mt-8 items-start">
                {/* User Image */}
                <Image
                  className="w-12 h-12 mr-6 rounded-full border border-neutral-300"
                  src={testimonial.image}
                  alt={testimonial.user}
                  width={48}
                  height={48}
                />
                <div>
                  {/* User Name */}
                  <h6 className="text-gray-900 font-medium">{testimonial.user}</h6>
                  <span className="text-sm font-normal italic text-neutral-600">
                    {testimonial.company}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
