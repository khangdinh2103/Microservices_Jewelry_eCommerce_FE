const HeaderLite = () => {
  return (
    <header className="bg-[#333333] py-3 px-6">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side */}
        <div className="w-1/3 flex justify-start"></div>

        {/* Center - Logo */}
        <div className="w-1/3 flex justify-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 border-2 border-white flex items-center justify-center relative">
              {/* Diamond shaped logo with T letter */}
              <svg viewBox="0 0 100 100" className="w-10 h-10 fill-[#000000]">
                <polygon points="50,0 100,50 50,100 0,50" />
                <text x="50" y="65" textAnchor="middle" fill="white" fontSize="40" fontWeight="bold">T</text>
              </svg>
            </div>
            <div className="text-white text-xl font-bold tracking-widest">TINH TÚ</div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-1/3 flex justify-end"></div>
      </div>
    </header>
  );
};

export default HeaderLite;