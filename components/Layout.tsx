import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen font-serif relative overflow-hidden bg-paper">
      {/* Background Grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(var(--grid) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Vignette Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(44, 36, 22, 0.08) 100%)'
        }}
      />

      <div className="relative z-10 max-w-[900px] mx-auto px-4 md:px-8 py-8 md:py-24">
        <header className="mb-16 md:mb-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-ink mb-6 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl md:text-2xl text-ink-light italic font-serif">
              {subtitle}
            </p>
          )}
          <div className="mt-8 font-mono text-sm text-rust tracking-widest uppercase font-bold">
            by Jake Pegurri
          </div>
        </header>

        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;