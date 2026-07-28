import React, { useState } from 'react';
import {
  LayoutDashboard, Map, Sparkles, Compass, Sliders,
  CalendarCheck, Users, QrCode, Lock, ChevronLeft, ChevronRight,
  LogOut, UserCheck
} from 'lucide-react';
import { ActiveTab, UserRole } from './types';
import { useTranslation } from '../../i18n/LanguageContext';

export const MENU_ITEMS = [
  {
    id: 'dashboard' as ActiveTab,
    labelKey: 'menuDashboard',
    descKey: 'menuDashboardDesc',
    icon: LayoutDashboard,
    roles: ['platform-admin', 'tour-admin', 'operator']
  },
  {
    id: 'logistics' as ActiveTab,
    labelKey: 'menuLogistics',
    descKey: 'menuLogisticsDesc',
    icon: Map,
    roles: ['platform-admin']
  },
  {
    id: 'copilot' as ActiveTab,
    labelKey: 'menuCopilot',
    descKey: 'menuCopilotDesc',
    icon: Sparkles,
    roles: ['platform-admin']
  },
  {
    id: 'tours' as ActiveTab,
    labelKey: 'menuTours',
    descKey: 'menuToursDesc',
    icon: Compass,
    roles: ['platform-admin', 'tour-admin', 'operator']
  },
  {
    id: 'slider' as ActiveTab,
    labelKey: 'menuSlider',
    descKey: 'menuSliderDesc',
    icon: Sliders,
    roles: ['platform-admin', 'tour-admin']
  },
  {
    id: 'bookings' as ActiveTab,
    labelKey: 'menuBookings',
    descKey: 'menuBookingsDesc',
    icon: CalendarCheck,
    roles: ['platform-admin', 'operator']
  },
  {
    id: 'resources' as ActiveTab,
    labelKey: 'menuResources',
    descKey: 'menuResourcesDesc',
    icon: Users,
    roles: ['platform-admin', 'operator']
  },
  {
    id: 'pwa' as ActiveTab,
    labelKey: 'menuPwa',
    descKey: 'menuPwaDesc',
    icon: QrCode,
    roles: ['platform-admin']
  },
  {
    id: 'tourists' as ActiveTab,
    labelKey: 'menuTourists',
    descKey: 'menuTouristsDesc',
    icon: UserCheck,
    roles: ['platform-admin', 'tour-admin', 'operator']
  },
];

interface SidebarProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  currentRole: UserRole;
}

export default function Sidebar({
  activeTab,
  onChangeTab,
  currentRole
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useTranslation();

  return (
    <aside
      style={{ width: isCollapsed ? '76px' : '260px', transition: 'width 0.3s ease-in-out' }}
      className="hidden md:flex bg-slate-950 border-r border-white/5 h-screen sticky top-0 flex-col justify-between select-none z-30 flex-shrink-0"
      id="bt-sidebar"
    >
      <div>
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3 overflow-hidden">
            <Compass size={24} className="text-amber-500 logo-icon transition-transform duration-500 hover:rotate-180 flex-shrink-0" />
            {!isCollapsed && (
              <div
                className="flex flex-col"
              >
                <span className="font-extrabold text-sm tracking-tight text-white uppercase">Busca<span className="text-sky-500">Tours</span>
                </span>
                <span className="text-[9px] font-mono font-bold text-amber-500 tracking-wider">
                  B2B ADMIN PORTAL
                </span>
              </div>
            )}
          </div>

          <button
            id="btn-sidebar-collapse"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-white rounded border border-white/5 transition-colors hidden md:block"
          >
            {isCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 mt-4">
          {MENU_ITEMS.map((item) => {
            const IconComponent = item.icon;
            const hasAccess = item.roles.includes(currentRole);
            const isSelected = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                disabled={!hasAccess}
                onClick={() => onChangeTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded text-xs font-semibold transition-all duration-200 group relative ${isSelected
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/10'
                  : !hasAccess
                    ? 'opacity-40 cursor-not-allowed border border-transparent'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent hover:bg-white/5'
                  }`}
                title={!hasAccess ? `${t('sidebarAccessOnly')} ${item.roles.join(', ')}` : t(item.descKey)}
              >
                <div className="relative">
                  <IconComponent
                    size={16}
                    className={`transition-colors duration-200 flex-shrink-0 ${isSelected ? 'text-slate-950' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                  />
                  {!hasAccess && (
                    <div className="absolute -top-1 -right-1 bg-slate-950 p-0.5 rounded-full border border-white/10">
                      <Lock size={8} className="text-red-400" />
                    </div>
                  )}
                </div>

                {!isCollapsed && (
                  <div className="flex flex-col items-start text-left overflow-hidden">
                    <span className="truncate">{t(item.labelKey)}</span>
                    <span className={`text-[9px] font-normal font-mono leading-none mt-0.5 ${isSelected ? 'text-slate-800' : 'text-slate-500'
                      }`}>
                      {t(item.descKey)}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-white/5">
        {!isCollapsed && (
          <div className="p-2.5 bg-white/3 rounded-xl border border-white/5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-semibold text-slate-500 font-mono uppercase">{t('sidebar.platformConnection', 'CONEXIÓN PLATAFORMA')}</span>
              <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>
            <div className="text-[9px] text-slate-400 font-mono leading-relaxed">
              SATCOM: ACTIVE<br />
              PWA: READY (SYNC OK)
            </div>
          </div>
        )}
        <div className="mt-3">
          <button
            onClick={() => {
              window.location.hash = '';
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 rounded hover:bg-rose-950/20 transition-all ${isCollapsed ? 'justify-center' : ''}
            }`}
          >
            <LogOut size={13} />
            {!isCollapsed && <span>{t('sidebarLogout')}</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
