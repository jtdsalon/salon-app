
import React from 'react';
import { AppView } from '../types';

interface MobileNavProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ currentView, setView }) => {
  const items = [
    { id: AppView.DASHBOARD, icon: 'fa-chart-pie', label: 'Stats' },
    // Fixed: Property 'SOCIAL_HUB' does not exist on type 'typeof AppView'. Changed to ARCHIVE.
    { id: AppView.ARCHIVE, icon: 'fa-hashtag', label: 'Social' },
    // Fixed: Property 'INVENTORY' does not exist on type 'typeof AppView'. Changed to APOTHECARY.
    { id: AppView.APOTHECARY, icon: 'fa-boxes-stacked', label: 'Stock' },
    // Fixed: Property 'AI_CONSULTANT' does not exist on type 'typeof AppView'. Changed to CHAT.
    { id: AppView.CHAT, icon: 'fa-wand-magic-sparkles', label: 'AI' },
    { id: AppView.STAFF, icon: 'fa-users', label: 'Team' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 flex items-center justify-around h-16 px-2 z-50">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`flex flex-col items-center justify-center flex-1 gap-1 transition-all duration-300 ${
            currentView === item.id ? 'text-indigo-600 -translate-y-1' : 'text-slate-400'
          }`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${currentView === item.id ? 'bg-indigo-50' : ''}`}>
            <i className={`fas ${item.icon} text-base`}></i>
          </div>
          <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
          {currentView === item.id && <div className="w-1 h-1 bg-indigo-600 rounded-full"></div>}
        </button>
      ))}
    </nav>
  );
};

export default MobileNav;
