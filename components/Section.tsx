
import React from 'react';

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, className = '', titleClassName = '' }) => {
  return (
    <section className={`py-6 px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-xl mb-6 ${className}`}>
      {title && (
        <h2 className={`text-2xl font-semibold text-teal-700 mb-4 pb-2 border-b-2 border-yellow-400 ${titleClassName}`}>
          {title}
        </h2>
      )}
      {children}
    </section>
  );
};

export default Section;
    