export function Header() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-gray-800">本間解体工業様</h2>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">PoC版</span>
      </div>
    </header>
  );
}

