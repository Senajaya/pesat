import React from "react";

type TabKey = "beranda" | "tanaman" | "keuangan";

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
            <div className="grid grid-cols-3 gap-1 text-center text-xs font-medium">
              <button
                type="button"
                onClick={() => onSelectTab("beranda")}
                className={`rounded-xl py-2 transition ${
                  activeTab === "beranda"
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-stone-500 hover:bg-stone-100"
                }`}
              >
                Beranda
              </button>
              <button
                type="button"
                onClick={() => onSelectTab("tanaman")}
                className={`rounded-xl py-2 transition ${
                  activeTab === "tanaman"
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-stone-500 hover:bg-stone-100"
                }`}
              >
                Tanaman
              </button>
              <button
                type="button"
                onClick={() => onSelectTab("keuangan")}
                className={`rounded-xl py-2 transition ${
                  activeTab === "keuangan"
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-stone-500 hover:bg-stone-100"
                }`}
              >
                Keuangan
              </button>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}