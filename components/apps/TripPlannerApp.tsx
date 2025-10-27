
import React from 'react';

const TripPlannerApp: React.FC = () => {
  return (
    <div className="h-full w-full flex items-center justify-center bg-bg-tertiary rounded-b-md text-white p-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl p-8 shadow-xl backdrop-blur-sm">
        <h1 className="font-display text-3xl font-bold mb-6 text-center">Plan Your Next Adventure</h1>
        <form className="space-y-6">
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-text-secondary mb-2">Destination</label>
            <input type="text" id="destination" placeholder="e.g., Paris, France" className="w-full bg-black/20 border border-white/10 rounded-md p-3 focus:ring-2 focus:ring-primary-blue focus:outline-none" />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="start-date" className="block text-sm font-medium text-text-secondary mb-2">Start Date</label>
              <input type="date" id="start-date" className="w-full bg-black/20 border border-white/10 rounded-md p-3 focus:ring-2 focus:ring-primary-blue focus:outline-none" />
            </div>
            <div className="flex-1">
              <label htmlFor="end-date" className="block text-sm font-medium text-text-secondary mb-2">End Date</label>
              <input type="date" id="end-date" className="w-full bg-black/20 border border-white/10 rounded-md p-3 focus:ring-2 focus:ring-primary-blue focus:outline-none" />
            </div>
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-text-secondary mb-2">Budget: $2500</label>
            <input type="range" id="budget" min="500" max="10000" defaultValue="2500" className="w-full h-2 bg-black/20 rounded-lg appearance-none cursor-pointer accent-primary-blue" />
          </div>
          <button type="button" className="w-full font-bold py-3 px-4 rounded-lg bg-gradient-to-r from-primary-blue to-primary-purple hover:brightness-110 active:scale-95 transition-all duration-200">
            Create Trip with AI ✨
          </button>
        </form>
      </div>
    </div>
  );
};

export default TripPlannerApp;
