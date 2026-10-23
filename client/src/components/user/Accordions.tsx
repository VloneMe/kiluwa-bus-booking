import { useEffect, useState } from "react";  
import {  
    Accordion,  
    AccordionContent,  
    AccordionItem,  
    AccordionTrigger,  
} from "@/components/ui/accordion";  
import { BsFillPhoneLandscapeFill } from "react-icons/bs";  
import { FaHistory } from "react-icons/fa";  
import { FaTicket } from "react-icons/fa6";  
import { ImProfile } from "react-icons/im";  
import { useAuth } from "@/context/AuthProvider";  
import { ContactUs } from "../contactus";  
import { Ticket } from "../bus/Ticket";  
import { BookingHistory } from "./BookingHistory";  
import { Separator } from "../ui/separator";  
import { UserProfile, UserProfileResponse } from "@/types/UserTypes";


export function Accordions() {  
    const { user } = useAuth(); // Pata mtumiaji aliyeingia  
    const [profile, setProfile] = useState<UserProfile | null>(null);  
    const [loading, setLoading] = useState<boolean>(true);  
    const [error, setError] = useState<string | null>(null);  

    useEffect(() => {  
        const fetchProfile = async () => {  
            if (!user) {  
                setError("Mtumiaji hajaingia.");  
                setLoading(false);  
                return;  
            }  

            try {  
                setLoading(true);  
                setError(null);  
                const response = await fetch(`${import.meta.env.VITE_API_KEY_PROFILE}`, {  
                    method: "POST",  
                    headers: {  
                        "Content-Type": "application/json",  
                    },  
                    body: JSON.stringify({ user_id: user.user_id }),  
                });  

                if (!response.ok) {  
                    throw new Error("Imeshindikana kupata data ya wasifu");  
                }  

                const data: UserProfileResponse = await response.json();  
                setProfile(data.user_profile);  
            } catch (err) {  
                setError((err as Error).message);  
            } finally {  
                setLoading(false);  
            }  
        };  

        fetchProfile();  
    }, [user]);  

    return (  
        <Accordion type="single" defaultValue="item-2" collapsible className="w-full space-y-3 py-3">  
            <AccordionItem value="item-1" className="border-primary px-2">  
                <AccordionTrigger className="gap-2 hover:underline font-bold">  
                    <span className="flex items-center gap-2">  
                        <FaTicket className="text-secondary text-xl"/> Tiketi Yangu  
                    </span>  
                </AccordionTrigger>  
                <AccordionContent className="px-4">  
                    <Separator />  
                    {profile?.tickets && profile.tickets.length > 0 ? (  
                        profile.tickets.map((ticket) => (  
                            <div key={ticket.Ticket_id}>  
                                <Ticket ticketid={ticket.Ticket_id} non_input />  
                            </div>  
                        ))  
                    ) : (  
                        <p>Hakuna tiketi ya sasa iliyopatikana.</p>  
                    )}  
                </AccordionContent>  
            </AccordionItem>  
            <AccordionItem value="item-2" className="border-secondary px-2">  
                <AccordionTrigger className="gap-2 hover:underline font-bold">  
                    <span className="flex items-center gap-2">  
                        <ImProfile className="text-secondary text-xl"/> Wasifu  
                    </span>  
                </AccordionTrigger>  
                <AccordionContent className="px-">  
                    {loading ? (  
                        <p>Inapakia wasifu...</p>  
                    ) : error ? (  
                        <p className="text-red-500">Kosa: {error}</p>  
                    ) : profile ? (  
                        <div className="capitalize flex flex-col space-y-3">  
                            <Separator />  
                            <div className="flex items-center justify-between">  
                                <p className="flex flex-col">  
                                    <strong>Jina la Kwanza</strong> {profile.first_name}  
                                </p>  
                                <p className="flex flex-col text-right">  
                                    <strong>Jina la Mwisho</strong> {profile.last_name}  
                                </p>  
                            </div>  
                            <Separator />  
                            <div className="flex items-center justify-between">  
                                <p className="flex flex-col lowercase">  
                                    <strong>Barua Pepe</strong> {profile.email || "Hapana"}  
                                </p>  
                                <p className="flex flex-col text-right">  
                                    <strong>Simu</strong> {profile.mobile_number}  
                                </p>  
                            </div>  
                            <Separator />  
                            <div className="flex items-center justify-between">  
                                <p className="flex flex-col">  
                                    <strong>Jinsia</strong> {profile.gender}  
                                </p>  
                                <p className="flex flex-col text-right">  
                                    <strong>Kikundi cha Umri</strong> {profile.age}  
                                </p>  
                            </div>  
                            <Separator />  
                            <div className="flex items-center justify-between">  
                                <p className="flex flex-col">  
                                    <strong>Uraia</strong> {profile.nationality}  
                                </p>  
                                <p className="flex flex-col text-right">  
                                    <strong>Tiketi Zilizohifadhiwa</strong> {profile.tickets.length}  
                                </p>  
                            </div>  
                            <Separator />  
                            <div className="flex items-center justify-between">  
                                <p className="flex flex-col">  
                                    <strong>Aina ya Kitambulisho</strong> {profile.identity_type}  
                                </p>  
                                <p className="flex flex-col text-right">  
                                    <strong>Nambari ya Kitambulisho</strong> {profile.identity_number}  
                                </p>  
                            </div>  
                        </div>  
                    ) : (  
                        <p>Hakuna data ya wasifu iliyopatikana.</p>  
                    )}  
                </AccordionContent>  
            </AccordionItem>  
            <AccordionItem value="item-3" className="border-secondary px-2">  
                <AccordionTrigger className="gap-2 text-black hover:underline font-bold">  
                    <span className="flex items-center gap-2">  
                        <FaHistory className="text-secondary text-xl"/> Safari Zilizopita 
                    </span>  
                </AccordionTrigger>  
                <AccordionContent className="px-4">  
                    <Separator />  
                    {profile?.tickets && profile.tickets.length > 0 ? (  
                        profile.tickets.map((ticket, idx) => (  
                            <div key={idx}>  
                                <BookingHistory  
                                    idx={idx}  
                                    Route={`${ticket.pickup_trip_location} - ${ticket.drop_trip_location}`}  
                                    date={ticket.date}  
                                >  
                                        <Ticket ticketid={ticket.Ticket_id} non_input={false}/>  
                                </BookingHistory>  
                            </div>  
                        ))  
                    ) : (  
                        <p>Hakuna historia ya uhifadhi iliyopatikana.</p>  
                    )}  
                </AccordionContent>  
            </AccordionItem>  
            <AccordionItem value="item-4" className="border-secondary px-2">  
                <AccordionTrigger className="gap-2 text-black hover:underline font-bold">  
                    <span className="flex items-center gap-2">  
                        <BsFillPhoneLandscapeFill className="text-secondary text-xl"/> Wasiliana Nasi  
                    </span>  
                </AccordionTrigger>  
                <AccordionContent className="w-full">  
                    <Separator />  
                    <ContactUs className="pt-5" fixContainer="px-0"/>  
                </AccordionContent>  
            </AccordionItem>  
        </Accordion>  
    );  
};