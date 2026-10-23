import { useState } from "react";  
import { useForm, SubmitHandler } from "react-hook-form";  
import { z } from "zod";  
import { zodResolver } from '@hookform/resolvers/zod';  
import { Link, Navigate } from "react-router-dom";  
import { FaBusAlt } from "react-icons/fa";  
import { Container } from "../Container";  
import { Input } from "../ui/input";  
import { Button } from "../ui/button";  
import { Separator } from "../ui/separator";  
import { useAuth } from "@/context/AuthProvider";  
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const registerSchema = z.object({
    first_name: z.string().nonempty({ message: "Jina la kwanza linahitajika." }),
    middle_name: z.string().optional(),
    last_name: z.string().nonempty({ message: "Jina la mwisho linahitajika." }),
    phone_number: z
        .string()
        .nonempty({ message: "Nambari ya simu inahitajika." })
        .regex(/^(0\d{9}|255\d{11})$/, { message: "Nambari ya simu inapaswa kuanzia na '0' (10 digits)" }),
    passenger_gender: z.enum(["male", "female"], { required_error: "Jinsia inahitajika." }),
    age_group: z.enum(["adult", "child"], { required_error: "Kundi la umri linahitajika." }),
    email: z.string().email({ message: "Barua pepe si sahihi." }).optional(),
    idType: z.string().optional(),
    idNumber: z.string().optional(),
    nationality: z.string().nonempty({ message: "Uraia unahitaji!" }),
    password: z
        .string()
        .min(6, { message: "Nenosiri linahitaji angalau herufi 6." })
        .regex(/[A-Z]/, { message: "Nenosiri linahitaji angalau herufi kubwa." })
        .regex(/[a-z]/, { message: "Nenosiri linahitaji angalau herufi ndogo." })
        .regex(/[0-9]/, { message: "Nenosiri linahitaji angalau nambari." }),
    confirm_password: z.string().nonempty({ message: "Thibitisha nenosiri inahitajika." })
}).refine(data => data.password === data.confirm_password, {
    message: "Nenosiri na thibitisha nenosiri havILINGANI.",
    path: ["confirm_password"],
});
  

type RegisterFormValues = {  
    first_name: string;  
    middle_name?: string;  
    last_name: string;  
    phone_number: string;  
    passenger_gender?: "male" | "female";  
    age_group?: "adult" | "child";  
    email?: string;  
    idType?: string;  
    idNumber?: string;  
    nationality: string;  
    password: string;  
    confirm_password: string;  
};  

export const Register: React.FC = () => { 
    const [registered, setRegistered] = useState(false); 
    const [errorMessage, setErrorMessage] = useState<string | null>(null);  
    const [isLoading, setIsLoading] = useState(false);  
    const [successMessage, setSuccessMessage] = useState<string | null>(null);  
    const { isLoggedIn } = useAuth();  

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<RegisterFormValues>({  
        resolver: zodResolver(registerSchema),  
    });  

    const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {  
        setErrorMessage(null);  
        setSuccessMessage(null);  
        setIsLoading(true); 

        const payload = {  
            passenger: {  
                first_name: data.first_name,  
                middle_name: data.middle_name || "",  
                last_name: data.last_name,  
                nationality: data.nationality,  
                gender: data.passenger_gender,  
                age_group: data.age_group,  
                identity_type: data.idType || "",  
                identity_number: data.idNumber || "",  
                mobile_number: data.phone_number,  
                email: data.email || "",  
                nywira: data.password,  
            },  
        }; 

        // console.log("Registered: ", payload);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_KEY_REGISTER}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
        
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error Response:', errorData);
                setErrorMessage(errorData.message || 'Kusajili kumeshindwa. Tafadhali jaribu tena.');
                return;
            }
        
            const authData = await response.json();
            console.log('Success Response:', authData);
            setSuccessMessage("Usajili umekamilika. Tafadhali ingia.");
            setRegistered(true);
        } catch (error) {
            console.error('Fetch Error:', error);
            setErrorMessage('Makosa yametokea. Tafadhali jaribu tena baadaye.');
        }
         
    };  

    if (isLoggedIn) {  
        return <Navigate to="/myaccount" />;  
    }  

    if (registered) {  
        return <Navigate to='/login' />;  
    } 

    return (  
        <section className="min-h-screen bg-gray-300 py-32 w-full flex items-center">  
            <Container>  
                <form onSubmit={handleSubmit(onSubmit)} className="border border-gray-400 px-6 py-10 rounded-lg space-y-5 max-w-[30rem] mx-auto shadow-lg">  
                    <div className="flex flex-col items-center shadow-lg shadow-white/80">  
                        <FaBusAlt size={50} className="text-center text-primary" />  
                        <h2 className="text-2xl font-bold text-center pb-5">Kiluwa <span className="font-bold text-white">|</span> Jisajili</h2>  
                    </div>  

                    {/* Input Fields */}  
                    <div className="flex flex-col gap-1">  
                        <Input  
                            type="text"  
                            placeholder="Jina la Kwanza"  
                            aria-label="Jina la Kwanza"  
                            {...register("first_name")}  
                        />  
                        {errors.first_name && <p className="text-red-500">{errors.first_name.message}</p>}  
                    </div>  

                    <div className="flex flex-col gap-1">  
                        <Input  
                            type="text"  
                            placeholder="Jina la Kati"  
                            aria-label="Jina la Kati"  
                            {...register("middle_name")}  
                        />  
                    </div>  

                    <div className="flex flex-col gap-1">  
                        <Input  
                            type="text"  
                            placeholder="Jina la Mwisho"  
                            aria-label="Jina la Mwisho"  
                            {...register("last_name")}  
                        />  
                        {errors.last_name && <p className="text-red-500">{errors.last_name.message}</p>}  
                    </div>  

                    {/* Nationality Select */}  
                    <div>  
                        <div className="bg-white rounded-lg">  
                            <Select onValueChange={value => setValue("nationality", value)}>  
                                <SelectTrigger>  
                                    <SelectValue placeholder="Chagua Uraia" />  
                                </SelectTrigger>  
                                <SelectContent className="bg-white">  
                                    <SelectItem value="TANZANIAN">MTANZANIA</SelectItem>  
                                    <SelectItem value="NON TANZANIAN">SI MTANZANIA</SelectItem>  
                                </SelectContent>  
                            </Select>  
                        </div>  
                        {errors.nationality && <p className="text-red-500">{errors.nationality.message}</p>}  
                    </div>  

                    {/* Gender Select */}  
                    <div>  
                        <div className="bg-white rounded-lg relative">  
                            <Select onValueChange={value => setValue("passenger_gender", value as "male" | "female")}>  
                                <SelectTrigger>  
                                    <SelectValue placeholder="Chagua jinsia" />  
                                </SelectTrigger>  
                                <SelectContent className="bg-white">  
                                    <SelectItem value="male">Mwanaume</SelectItem>  
                                    <SelectItem value="female">Mwanamke</SelectItem>  
                                </SelectContent>  
                            </Select>  
                        </div>  
                        {errors.passenger_gender && <p className="text-red-500">{errors.passenger_gender.message}</p>}  
                    </div>  

                    {/* Age Group Select */}  
                    <div>  
                        <div className="bg-white rounded-lg">  
                            <Select onValueChange={value => setValue("age_group", value as "adult" | "child")}>  
                                <SelectTrigger>  
                                    <SelectValue placeholder="Chagua kundi la umri" className="text-gray-400 placeholder-gray-400" />  
                                </SelectTrigger>  
                                <SelectContent className="bg-white relative">  
                                    <SelectItem value="adult">Mkubwa</SelectItem>  
                                    <SelectItem value="child">Mtoto</SelectItem>  
                                </SelectContent>  
                            </Select>  
                        </div>  
                        {errors.age_group && <p className="text-red-500">{errors.age_group.message}</p>}  
                    </div>  

                    {/* Phone Number */}  
                    <div>  
                        {/* <label>Nambari ya Simu <span className="text-red-700 pl-2 font-bold text-lg">*</span></label>   */}
                        <Input  
                            type="tel"  
                            placeholder="0XXXXXXXXXX"  
                            {...register("phone_number")}  
                            className="bg-white"  
                            onChange={(e) => {  
                                const value = e.target.value.replace(/\D/g, ''); // Allow only digits  

                                if (value.startsWith('255') && value.length > 12) {  
                                    setValue("phone_number", value.slice(0, 12));  
                                } else if (value.startsWith('0') && value.length > 10) {  
                                    setValue("phone_number", value.slice(0, 10));  
                                } else if (!value.startsWith('0') && !value.startsWith('255')) {  
                                    setValue("phone_number", ''); // Clear input if it does not start correctly  
                                } else {  
                                    setValue("phone_number", value); // Update the form state directly  
                                }  
                            }}  
                        />  
                        {errors.phone_number && (  
                            <p className="text-red-500">{errors.phone_number.message}</p>  
                        )}  
                    </div>  

                    <div className="flex flex-col gap-1">  
                        <Input  
                            type="email"  
                            placeholder="Barua Pepe"  
                            aria-label="Barua Pepe"  
                            {...register("email")}  
                        />  
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}  
                    </div>  

                    {/* ID Type Select */}  
                    <div>  
                        <div className="bg-white rounded-lg relative">  
                            <Select onValueChange={value => setValue("idType", value)}>  
                                <SelectTrigger>  
                                    <SelectValue placeholder="Chagua Aina ya Kitambulisho" />  
                                </SelectTrigger>  
                                <SelectContent className="bg-white relative">  
                                    <SelectItem value="NIL">NIL</SelectItem>  
                                    <SelectItem value="National ID (NIDA)">Kitambulisho cha Kitaifa (NIDA)</SelectItem>  
                                    <SelectItem value="Passport">Pasipoti</SelectItem>  
                                    <SelectItem value="Voting ID">Kitambulisho cha Kupigia Kura</SelectItem>  
                                    <SelectItem value="Driving Licence">Leseni ya Udereva</SelectItem>  
                                </SelectContent>  
                            </Select>  
                        </div>  
                        {errors.idType && <p className="text-red-500">{errors.idType.message}</p>}  
                    </div>  

                    <div className="flex flex-col gap-1">  
                        <Input  
                            type="text"  
                            placeholder="Nambari ya Kitambulisho"  
                            aria-label="Nambari ya Kitambulisho"  
                            {...register("idNumber")}  
                        />  
                    </div>  

                    <div className="flex flex-col gap-1">  
                        <Input  
                            type="password"  
                            placeholder="Nenosiri"  
                            aria-label="Nenosiri"  
                            {...register("password")}  
                        />  
                        {errors.password && <p className="text-red-500">{errors.password.message}</p>}  
                    </div>  

                    <div className="flex flex-col gap-1">  
                        <Input  
                            type="password"  
                            placeholder="Thibitisha Nenosiri"  
                            aria-label="Thibitisha Nenosiri"  
                            {...register("confirm_password")}  
                        />  
                        {errors.confirm_password && <p className="text-red-500">{errors.confirm_password.message}</p>}  
                    </div>  

                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}  
                    {successMessage && <p className="text-green-500">{successMessage}</p>}  

                    <Button className="w-full bg-primary hover:bg-primary/75" disabled={isLoading}>  
                        {isLoading ? "Inapakia..." : "Jisajili"}  
                    </Button>  

                    <Separator />  

                    <div className="text-center">  
                        Nina akaunti?  
                        <Link to={'/login'} className="text-blue-700 hover:text-blue-900"> Ingia</Link>  
                    </div>  
                </form>  
            </Container>  
        </section>  
    );  
};