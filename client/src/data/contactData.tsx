import { HiLocationMarker } from 'react-icons/hi';  
import { BsFillTelephoneOutboundFill } from 'react-icons/bs';  
import { AiOutlineMail } from 'react-icons/ai';  

export const contactData = [  
    {  
        id: 1,  
        icon: <HiLocationMarker size={30} />,  
        title: "Anwani",  // Translated: Address  
        description: "Mbezi, Dar es Salaam, Tanzania",  // Address remains the same  
    },  
    // Uncomment if you want to add Mailbox information  
    // {  
    //     id: 2,  
    //     icon: <BsMailbox size={30}/>,  
    //     title: "Sanduku la Barua",  // Translated: Mail box  
    //     description: "P. O. Box: 11949 Dar es Salaam, Tanzania ",  // Remains the same  
    // },  
    {  
        id: 3,  
        icon: <AiOutlineMail size={30} />,  
        title: "Barua Pepe",  // Translated: Email  
        description: "info@buspoa.co.tz",  // Email remains the same  
    },  
    {  
        id: 4,  
        icon: <BsFillTelephoneOutboundFill size={30} />,  
        title: "Simu",  // Translated: Phone  
        description: "+255 767 859 044",  // Phone number remains the same  
    }  
];