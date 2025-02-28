
const ContactUs = () => {
  return (
    <div className="h-auto lg:h-[75vh] flex items-center justify-center px-4 lg:px-16 bg-zinc-900">
      <div className="w-full max-w-2xl bg-zinc-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-yellow-100 mb-6 text-center">
          Contact Us
        </h2>
        <form className="space-y-4">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-zinc-400 font-medium mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 text-zinc-900 rounded-lg bg-zinc-200 focus:outline-none focus:ring focus:ring-yellow-400"
              placeholder="Enter your name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-zinc-400 font-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 text-zinc-900 rounded-lg bg-zinc-200 focus:outline-none focus:ring focus:ring-yellow-400"
              placeholder="Enter your email"
            />
          </div>

          {/* Subject Field */}
          <div>
            <label
              htmlFor="subject"
              className="block text-zinc-400 font-medium mb-2"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              className="w-full px-4 py-2 text-zinc-900 rounded-lg bg-zinc-200 focus:outline-none focus:ring focus:ring-yellow-400"
              placeholder="Enter subject"
            />
          </div>

          {/* Message Field */}
          <div>
            <label
              htmlFor="message"
              className="block text-zinc-400 font-medium mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              rows="5"
              className="w-full px-4 py-2 text-zinc-900 rounded-lg bg-zinc-200 focus:outline-none focus:ring focus:ring-yellow-400"
              placeholder="Enter your message"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-500 text-zinc-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-all duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
