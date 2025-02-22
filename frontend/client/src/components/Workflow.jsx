import { CheckCircle2 } from "lucide-react";
import { checklistItems } from "../constants";
import Image from "next/image";

const Workflow = () => {
  return (
    <div className="mt-20">
      {/* Title */}
      <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center mt-6 tracking-wide">
        Accelerate your{" "}
        <span className="bg-gradient-to-r from-yellow-500 to-yellow-800 text-transparent bg-clip-text">
          medical journey.
        </span>
      </h2>

      {/* Content */}
      <div className="flex flex-wrap justify-center">
        {/* Image */}
        <div className="p-2 w-full lg:w-1/2">
          <Image
            className="w-full h-full object-fill"
            src="/assets/auction/auction11-removebg-preview.png"
            alt="Doctors Image"
            width={400}
            height={300}
          />
        </div>

        {/* Checklist Items */}
        <div className="pt-12 w-full lg:w-1/2">
          {checklistItems.map((item, index) => (
            <div key={index} className="flex mb-12">
              {/* Icon */}
              <div className="text-yellow-500 mx-6 bg-yellow-100 h-10 w-10 p-2 justify-center items-center rounded-full">
                <CheckCircle2 />
              </div>
              {/* Text */}
              <div>
                <h5 className="mt-1 mb-2 text-xl text-yellow-800">{item.title}</h5>
                <p className="text-md text-neutral-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Workflow;
