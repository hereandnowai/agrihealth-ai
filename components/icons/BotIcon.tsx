
import React from 'react';
import { CHATBOT_FACE_ICON_URL } from '../../constants';


const BotIcon: React.FC<React.SVGProps<SVGSVGElement> & {isImage?: boolean}> = ({className, isImage=true, ...props}) => {
    if(isImage){
        return <img src={CHATBOT_FACE_ICON_URL} alt="Caramel AI Face" className={className} />
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.343-.026.686-.038 1.024-.038h.001M7.5 10.5h2.25M10.5 10.5a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zM10.5 10.5V15m1.154 0A10.493 10.493 0 0012 15.75c.664 0 1.305-.057 1.923-.162M12 15.75V18m1.846-5.02.164-.163a4.5 4.5 0 016.222 6.222l-.163.164m-6.386-6.386a4.5 4.5 0 00-6.222 6.222l.163.164M12 18h.008v.008H12V18zm0 0H6.028a2.25 2.25 0 01-2.203-1.638l-.048-.153A2.25 2.25 0 013.75 13.5V12m6.75 6H12m6-10.5h2.25m-2.25 0V7.5M7.5 15h2.25M15 10.5a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0z" />
        </svg>
    )
};


export default BotIcon;
    