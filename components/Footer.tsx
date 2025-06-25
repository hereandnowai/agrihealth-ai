import React from 'react';
import { ORGANISATION_NAME, ORGANISATION_WEBSITE, SOCIAL_LINKS, BRAND_SECONDARY_COLOR, BRAND_PRIMARY_COLOR, ORGANISATION_SLOGAN, ORGANISATION_SHORT_NAME, ORGANISATION_EMAIL, ORGANISATION_MOBILE } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

// Basic SVG icons for social media to avoid external dependencies for this example
const LinkedInIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
);
const GithubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
);
// Simplified icons for others
const SocialIcon: React.FC<{ href: string; label: string; children: React.ReactNode }> = ({ href, label, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={`text-[${BRAND_PRIMARY_COLOR}] hover:text-yellow-300 transition-colors`}>
    {children}
  </a>
);


const Footer: React.FC = () => {
  const { getLocalizedString } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-[${BRAND_SECONDARY_COLOR}] text-gray-300 py-8 px-4 text-center`}>
      <div className="container mx-auto">
        <div className="mb-4">
          <p className={`text-lg font-semibold text-[${BRAND_PRIMARY_COLOR}]`}>{ORGANISATION_NAME}</p>
          <p className="text-sm text-yellow-200">{ORGANISATION_SLOGAN}</p>
          <a href={ORGANISATION_WEBSITE} target="_blank" rel="noopener noreferrer" className={`text-sm text-[${BRAND_PRIMARY_COLOR}] hover:underline`}>
            {ORGANISATION_WEBSITE}
          </a>
        </div>
        
        <div className="flex justify-center space-x-6 mb-6">
          <SocialIcon href={SOCIAL_LINKS.blog} label="Blog">Blog</SocialIcon>
          <SocialIcon href={SOCIAL_LINKS.linkedin} label="LinkedIn"><LinkedInIcon className="w-6 h-6" /></SocialIcon>
          <SocialIcon href={SOCIAL_LINKS.instagram} label="Instagram">Instagram</SocialIcon>
          <SocialIcon href={SOCIAL_LINKS.github} label="GitHub"><GithubIcon className="w-6 h-6" /></SocialIcon>
          <SocialIcon href={SOCIAL_LINKS.twitter} label="X (Twitter)">X</SocialIcon>
          <SocialIcon href={SOCIAL_LINKS.youtube} label="YouTube">YouTube</SocialIcon>
        </div>

        <div className="text-xs text-gray-400">
          <p>&copy; {currentYear} {ORGANISATION_SHORT_NAME}. All rights reserved.</p>
          <p>Developed by Arlin Robeiksha Britto [ AI Products Engineering Team ]</p>
          <p>Contact: <a href={`mailto:${ORGANISATION_EMAIL}`} className="hover:underline">{ORGANISATION_EMAIL}</a> | {ORGANISATION_MOBILE}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;