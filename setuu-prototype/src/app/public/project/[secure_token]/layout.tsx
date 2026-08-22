export default function PublicProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b border-surface-variant/50 bg-surface flex items-center px-6 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center font-bold">
            S
          </div>
          <span className="font-merriweather font-bold text-lg text-on-surface">Setuu <span className="text-sm font-normal text-on-surface-variant font-inter">Public Viewer</span></span>
        </div>
        <div className="text-sm text-on-surface-variant font-medium">
          Read-Only Mode
        </div>
      </header>
      <main className="p-6 max-w-[1200px] mx-auto">
        {children}
      </main>
    </div>
  );
}
