function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-gray-950">
      <div className="flex items-center gap-3">
        <span className="text-xl">🔤</span>
        <h1 className="text-lg font-bold tracking-tight text-gray-100">
          Regex Playground
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <a
          href="https://github.com/Dev-2A/regex-playground"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-200 transition-colors text-sm"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}

export default Header;
