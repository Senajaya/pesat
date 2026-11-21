import React from "react";

export type TabKey = "beranda" | "tanaman" | "keuangan" | "user";

interface MobileShellProps {
  activeTab?: TabKey;
  onSelectTab?: (tab: TabKey) => void;
  showBottomNav?: boolean;
  children: React.ReactNode;
}

export function MobileShell({
  activeTab = "beranda",
  onSelectTab,
  showBottomNav = true,
  children,
}: MobileShellProps) {
  const navItems: { key: TabKey; label: string }[] = [
    { key: "beranda", label: "Beranda" },
    { key: "tanaman", label: "Tanaman" },
    { key: "keuangan", label: "Keuangan" },
    { key: "user", label: "User" },
  ];

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <div className="mx-auto min-h-screen w-full max-w-md bg-stone-50 shadow-sm flex flex-col">
        <main className={`flex-1 ${showBottomNav ? "pb-24" : "pb-6"}`}>
          {children}
        </main>

        {showBottomNav && onSelectTab && (
          <nav
            aria-label="Navigasi utama"
            className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-stone-200 bg-white/95 backdrop-blur px-2 py-2"
          >
            <div className="grid grid-cols-4 gap-1 text-center text-xs font-medium">
              {navItems.map((item) => {
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onSelectTab(item.key)}
                    className={`rounded-xl py-2 px-1 truncate transition ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-stone-500 hover:bg-stone-100"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}