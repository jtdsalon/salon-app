
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Analytics Hub', icon: 'fa-chart-pie' },
    // Fixed: Property 'APPOINTMENTS' does not exist on type 'typeof AppView'. Changed to SCHEDULE.
    { id: AppView.SCHEDULE, label: 'Appointments', icon: 'fa-calendar-check' },
    // Fixed: Property 'SOCIAL_HUB' does not exist on type 'typeof AppView'. Changed to ARCHIVE.
    { id: AppView.ARCHIVE, label: 'Social Hub', icon: 'fa-hashtag' },
    // Fixed: Property 'INVENTORY' does not exist on type 'typeof AppView'. Changed to APOTHECARY.
    { id: AppView.APOTHECARY, label: 'Inventory', icon: 'fa-boxes-stacked' },
    // Fixed: Property 'SERVICES' now exists in AppView.
    { id: AppView.SERVICES, label: 'Services', icon: 'fa-list-ul' },
    { id: AppView.STAFF, label: 'Team', icon: 'fa-users' },
    { id: AppView.CUSTOMERS, label: 'Customers', icon: 'fa-address-book' },
    // Fixed: Property 'AI_CONSULTANT' does not exist on type 'typeof AppView'. Changed to CHAT.
    { id: AppView.CHAT, label: 'AI Stylist', icon: 'fa-wand-magic-sparkles' },
  ];

  return (
    <aside className="w-64 h-full bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
      <div className="p-6">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-6">Management</div>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                currentView === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className={`fas ${item.icon} w-5`}></i>
              <span className="font-bold text-xs">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-6 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-3xl p-5 border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">System Status</p>
            <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-white">$45.2K</span>
            <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-lg">LIVE</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
