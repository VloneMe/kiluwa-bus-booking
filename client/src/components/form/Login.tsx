import { useState } from "react";  
import { useForm, SubmitHandler } from "react-hook-form";  
import { z } from "zod";  
import { zodResolver } from '@hookform/resolvers/zod';  
import { Link, Navigate } from "react-router-dom";  
import { FaEye, FaEyeSlash } from "react-icons/fa6";  
import { Container } from "../Container";  
import { Input } from "../ui/input";  
import { Button } from "../ui/button";  
import { FaBusAlt } from "react-icons/fa";  
import { Separator } from "../ui/separator";     
import { useAuth } from "@/context/AuthProvider";  

const loginSchema = z.object({  
    username_or_email: z.string().min(1, "Simu au barua pepe inahitajika"),  
    password: z.string().min(1, "Nenosiri linahitajika"),  
});  

type LoginFormValues = {  
    username_or_email: string;  
    password: string;  
};  

export const Login = () => {   
    const [showPwd, setShowPwd] = useState(false);  
    const [errorMessage, setErrorMessage] = useState<string | null>(null);  
    const { login, isLoggedIn } = useAuth();   

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({  
        resolver: zodResolver(loginSchema),  
    });  

    const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {  
        setErrorMessage(null);
        // console.log("My data: ", data)  
        try {   
            const response = await fetch(`${import.meta.env.VITE_API_KEY_LOGIN}`, {   
                method: 'POST',  
                headers: {  
                    'Content-Type': 'application/json',  
                },  
                body: JSON.stringify(data),  
            });  

            if (!response.ok) {  
                const errorData = await response.json();  
                setErrorMessage(errorData.message || 'Kuingia kumeshindwa. Tafadhali jaribu tena.');  
                return;  
            }  

            const authData = await response.json();  
            if(authData.data){  
                login(authData.data);  
            }else {  
                // login(null)  
            }  
            // console.log("Kuingia: ", authData.data);  
        } catch (error: any) {  
            console.log("Error: ", error) 
            throw Error(error)
            setErrorMessage('Makosa yametokea. Tafadhali jaribu tena baadaye.');  
        }  
    };  

    if (isLoggedIn) {  
        return <Navigate to="/" />;  
    }  

    return (  
        <section className="min-h-screen bg-gray-300 w-full flex items-center">  
            <Container>  
                <form onSubmit={handleSubmit(onSubmit)} className="border border-gray-400 px-6 py-10 rounded-lg space-y-5 max-w-[30rem] mx-auto shadow-lg">  

                    <div className="flex flex-col items-center shadow-lg shadow-white/80">  
                        <FaBusAlt size={50} className="text-center text-primary" />  
                        <h2 className="text-2xl font-bold text-center pb-5">Kiluwa <span className="font-bold text-white">|</span> Kuingia</h2>  
                    </div>  

                    <div className="flex flex-col gap-1">  
                        <Input  
                            type="text"  
                            placeholder="Simu au Barua Pepe"  
                            aria-label="Simu au Barua Pepe"  
                            {...register("username_or_email")}  
                        />  
                        {errors.username_or_email && <p className="text-red-500">{errors.username_or_email.message}</p>}  
                    </div>  

                    <div className="flex flex-col gap-1">  
                        <div className="relative flex items-center">  
                            <Input  
                                type={showPwd ? 'text' : 'password'}  
                                placeholder="Nenosiri"  
                                aria-label="Nenosiri"  
                                {...register("password")}  
                            />  
                            <div onClick={() => setShowPwd(!showPwd)} className="absolute right-5 cursor-pointer text-gray-400">  
                                {showPwd ? <FaEyeSlash /> : <FaEye />}  
                            </div>  
                        </div>  
                        {errors.password && <p className="text-red-500">{errors.password.message}</p>}  
                    </div>  

                    {errorMessage && <p className="text-red-500">{errorMessage}</p>} {/* Onyesha ujumbe wa kosa */}  

                    <Button className="w-full bg-primary hover:bg-primary/75">Kuingia</Button>  

                    <Separator />  

                    <div className="text-center">  
                        Sina akaunti?  
                        <Link to={'/register'} className="text-blue-700 hover:text-blue-900"> Jisajili</Link>  
                    </div>  
                </form>  
            </Container>  
        </section>  
    );  
};