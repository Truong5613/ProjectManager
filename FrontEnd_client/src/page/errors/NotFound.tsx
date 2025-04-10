const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <h2 className="text-2xl mt-4 font-semibold">Not Found</h2>
      
      <a
        href="/"
        className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
      >
        Back 
      </a>
    </div>
  );
};

export default NotFound;
