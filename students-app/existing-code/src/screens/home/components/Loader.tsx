export default function Loader() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        <p className="mt-4 text-white text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
}
