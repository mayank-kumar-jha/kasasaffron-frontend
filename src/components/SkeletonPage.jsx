import React from 'react';

const SkeletonPage = () => (
  <div className="w-full min-h-screen bg-[#140003] px-6 md:px-16 pt-32 pb-20 overflow-hidden flex flex-col">
    <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E6C587]/30 to-transparent animate-[shimmer_2s_infinite]"></div>
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 mt-12 md:mt-24">
      <div className="flex-1 flex flex-col gap-6 justify-center">
        <div className="w-24 h-4 bg-[#E6C587]/10 rounded-full animate-pulse"></div>
        <div className="w-full md:w-4/5 h-12 md:h-20 bg-white/5 rounded-xl animate-pulse delay-75"></div>
        <div className="w-3/4 md:w-3/5 h-12 md:h-20 bg-white/5 rounded-xl animate-pulse delay-100"></div>
        <div className="w-full max-w-md h-24 bg-white/5 rounded-xl mt-8 animate-pulse delay-150"></div>
        <div className="flex gap-6 mt-8">
          <div className="w-40 h-14 bg-white/5 rounded-full animate-pulse delay-200"></div>
          <div className="w-40 h-14 bg-white/5 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <div className="w-full max-w-md aspect-[3/4] bg-white/5 rounded-[150px_150px_0_0] animate-pulse delay-500 shadow-2xl border border-white/5"></div>
      </div>
    </div>
  </div>
);

export default SkeletonPage;
