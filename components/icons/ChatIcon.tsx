
import React from 'react';

const ChatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3.697-3.697C12.71 11.961 12.5 12 12 12H7.5c-1.246 0-2.25-1.004-2.25-2.25v-4.5c0-1.246 1.004-2.25 2.25-2.25h8.25c.884 0 1.673.483 2.063 1.221L17.75 8.511zM17.25 8.25L15 6" />
  </svg>
);

export default ChatIcon;
    