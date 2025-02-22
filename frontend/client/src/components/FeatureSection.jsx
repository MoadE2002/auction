import { features } from "../constants";

const FeatureSection = () => {
  return (
    <div className="relative mt-20 border-b border-neutral-200 min-h-[800px] bg-white">
      {/* Title */}
      <div className="text-center">
        <span className="bg-yellow-100 text-yellow-600 rounded-full h-6 text-sm font-medium px-2 py-1 uppercase">
          Features
        </span>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl mt-10 lg:mt-20 tracking-wide text-gray-900">
          Easily manage{" "}
          <span className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-transparent bg-clip-text">
            your appointments
          </span>
        </h2>
      </div>

      {/* Features List */}
      <div className="flex flex-wrap mt-10 lg:mt-20">
        {features.map((feature, index) => (
          <div key={index} className="w-full sm:w-1/2 lg:w-1/3">
            <div className="flex">
              {/* Icon Container */}
              <div className="flex mx-6 h-12 w-12 p-3 bg-yellow-50 text-yellow-600 justify-center items-center rounded-full shadow-md">
                {feature.icon}
              </div>
              {/* Text Content */}
              <div>
                <h5 className="mt-1 mb-4 text-xl font-semibold text-gray-800">
                  {feature.text}
                </h5>
                <p className="text-md p-2 mb-20 text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;
