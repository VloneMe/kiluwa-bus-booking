// import tigoImg from '/paymethods/tigopesa.png';
import mixbyyas from '/paymethods/mixbyyas.png';
import mpesaImg from '/paymethods/mpesa.png';
import airtelImg from '/paymethods/AirtelMoney.png';
import halopesaImg from '/paymethods/halopay.png';
// import azampesaImg from '/paymethods/azampesa.jpeg';


export const paymentMethods = [
        { 
            id: 'tigo', 
            title: "Mixx By Yas",
            name: 'Tigo', 
            image: mixbyyas,
            desc: [  
                "Piga namba ya Mixx By Yas menyu *150*01#",  
                "Chagua chaguo la 4 Lipa bili",  
                "Chagua chaguo la 3 Weka nambari ya biashara",  
                "Weka nambari ya biashara: {business}",  
                "Weka nambari ya marejeleo ya malipo: {reference}",  
                "Weka kiasi: {amount} TZS",  
                "Weka PIN yako ya Mixx By Yas ili kulipa Tiketi Mtandao"  
            ]
        },
        { 
            id: 'mpesa', 
            title: "M-Pesa",
            name: 'Mpesa', 
            image: mpesaImg,
            desc: [  
                "Piga namba ya Vodacom M-PESA Menyu *150*00#",  
                "Chagua chaguo la 4 Lipa kwa M-Pesa",  
                "Chagua chaguo la 4 Weka nambari ya biashara",  
                "Weka nambari ya biashara: {business}",  
                "Weka nambari ya malipo: {reference}",  
                "Weka kiasi: {amount} TZS",  
                "Weka PIN yako",  
                "Weka 1 kuthibitisha malipo kwa MALIPO MTANDAO"  
            ]
        },
        {
            id: 'airtel', 
            name: 'Airtel', 
            title: "Airtel Money",
            image: airtelImg,
            desc: [  
                "Piga namba ya Airtel Money Menyu *150*60#",  
                "Chagua chaguo la 5 Lipia Bili",  
                "Chagua chaguo la 4 Weka nambari ya biashara",  
                "Ingiza namba ya malipo: {business}",  
                "Weka nambari ya malipo: {reference}",
                "Weka kiasi: {amount} TZS",
                "Weka 1 kuthibitisha MALIPO MTANDAO",    
                "Ingiza namba ya siri kuthibitisha malipo"  
            ]
        },
        { 
            id: 'halopesa', 
            title: "Halopesa", 
            name: 'Halopesa', 
            image: halopesaImg,
            desc: [
                "Piga *150*88#",
                "Chagua 4 Lipia Bili",
                "Chagua 3 Namba ya Biashara",
                "Ingiza Namba ya Biashara: {business}",
                "Weka nambari ya malipo: {reference}",
                "Weka kiasi: {amount} TZS",
                "Ingiza namba ya siri kuthibitisha malipo"
            ] 
        },
        // { 
        //     id: 'azampesa', 
        //     title: "Azampesa", 
        //     name: 'Azampesa', 
        //     image: azampesaImg,
        //     desc: [
        //         "Piga *150*08#",
        //         "Chagua 4 Lipia Bili",
        //         "Chagua Kampuni",
        //         "Ingiza namba ya kampuni: {business}",
        //         "Enter payment reference no: {reference}",
        //         "Enter amount: {amount} TZS",
        //         "Enter PIN to confirm Payment"
        //     ] 
        // },
    ];
    