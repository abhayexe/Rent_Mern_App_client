import { assets } from "../../assets/assets";

function Body() {
  return (
    <div className="h-auto lg:h-[75vh] flex flex-col-reverse lg:flex-row items-center lg:items-center px-4 lg:px-16">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center mt-8 lg:mt-0">
        <h1 className="text-4xl lg:text-6xl font-semibold text-yellow-100 text-center lg:text-left">
          Welcome to Rentra
        </h1>

        <p className="mt-4 text-lg lg:text-xl text-white text-center lg:text-left">
          At Rentra, we believe in a smarter, more sustainable way to access the
          things you need. Instead of spending thousands on appliances,
          furniture, vehicles, or gadgets, why not rent them for as long as you
          need? Our platform connects renters with local providers, making it
          easy, affordable, and hassle-free to borrow high-quality products
          without the commitment of ownership.
        </p>
        <div className="mt-6">
          <div className="inline-block text-yellow-100 text-lg font-semibold border border-yellow-100 px-6 py-2 hover:bg-zinc-800 rounded-full">
            Discover
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <img
          src={assets.justice}
          alt="Justice"
          className="w-32 lg:w-full max-w-xs lg:max-w-lg object-contain"
        />
      </div>
    </div>
  );
}

export default Body;
