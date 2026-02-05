import React, { ReactNode } from 'react';

interface SectionProps {
  number: string;
  title: string;
  children: ReactNode;
  marginNote?: string;
}

const Section: React.FC<SectionProps> = ({ number, title, children, marginNote }) => {
  return (
    <section className="mb-24 relative group">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-baseline gap-4 text-ink">
        <span className="font-mono text-base text-ink-light">§{number}</span>
        {title}
      </h2>
      
      <div className="prose prose-lg prose-p:text-ink prose-headings:font-serif max-w-none">
        {children}
      </div>

      {marginNote && (
        <aside className="
          xl:absolute xl:right-[-260px] xl:top-16 xl:w-[220px] 
          mt-8 xl:mt-0 
          font-hand text-xl text-rust leading-tight 
          xl:rotate-1 transition-transform duration-500 hover:rotate-0
          pl-4 xl:pl-0 border-l-2 border-rust xl:border-l-0
          bg-paper/50 xl:bg-transparent p-4 xl:p-0
        ">
          {marginNote}
        </aside>
      )}
    </section>
  );
};

export default Section;