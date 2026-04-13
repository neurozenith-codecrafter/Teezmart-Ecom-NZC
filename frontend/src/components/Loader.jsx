const Loader = () => {
  return (
    <div className="flex space-x-2 justify-center items-center h-full">
      <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-150"></div>
      <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-300"></div>
    </div>
  );
};

export default Loader;