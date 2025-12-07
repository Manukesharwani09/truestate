/**
 * Sidebar Navigation Component
 */

import {
  LayoutDashboard,
  Network,
  Inbox,
  Settings,
  ChevronRight,
  FileText
} from 'lucide-react';
import { useState } from 'react';

export function Sidebar() {
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [invoicesExpanded, setInvoicesExpanded] = useState(false);

  return (
    <div className="w-64 bg-primary-800 text-white h-screen flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-primary-700">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <div>
            <h2 className="font-semibold text-white">Vault</h2>
            <p className="text-xs text-primary-300">Manu Kesharwani</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavItem icon={LayoutDashboard} label="Dashboard" active />
        <NavItem icon={Network} label="Nexus" />
        <NavItem icon={Inbox} label="Intake" />

        {/* Services with submenu */}
        <div>
          <button
            onClick={() => setServicesExpanded(!servicesExpanded)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-primary-200 hover:bg-primary-700 transition-colors"
          >
            <Settings className="h-5 w-5" />
            <span className="flex-1 text-left text-sm">Services</span>
            <ChevronRight
              className={`h-4 w-4 transition-transform ${servicesExpanded ? 'rotate-90' : ''}`}
            />
          </button>
          {servicesExpanded && (
            <div className="ml-8 mt-1 space-y-1">
              <SubNavItem label="Pre-active" />
              <SubNavItem label="Active" />
              <SubNavItem label="Blocked" />
              <SubNavItem label="Closed" />
            </div>
          )}
        </div>

        {/* Invoices with submenu */}
        <div>
          <button
            onClick={() => setInvoicesExpanded(!invoicesExpanded)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-primary-200 hover:bg-primary-700 transition-colors"
          >
            <FileText className="h-5 w-5" />
            <span className="flex-1 text-left text-sm">Invoices</span>
            <ChevronRight
              className={`h-4 w-4 transition-transform ${invoicesExpanded ? 'rotate-90' : ''}`}
            />
          </button>
          {invoicesExpanded && (
            <div className="ml-8 mt-1 space-y-1">
              <SubNavItem label="Proforma Invoices" />
              <SubNavItem label="Final Invoices" />
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

function NavItem({ icon: Icon, label, active }: NavItemProps) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        active
          ? 'bg-primary-700 text-white'
          : 'text-primary-200 hover:bg-primary-700'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm">{label}</span>
    </button>
  );
}

function SubNavItem({ label }: { label: string }) {
  return (
    <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-primary-300 hover:bg-primary-700 hover:text-white transition-colors text-sm">
      <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
      <span>{label}</span>
    </button>
  );
}
