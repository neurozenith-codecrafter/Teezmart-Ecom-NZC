const Loader = () => {
  return (
    <div className="space-y-4 p-4">
      {[1, 2, 3].map((_, i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          <div className="w-20 h-20 bg-gray-300 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;