import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Container } from "../Container";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthProvider";
import { Navigate } from "react-router-dom";

const changePasswordSchema = z.object({
    user_id: z.string().min(1, "User ID is required"),
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(6, "New password must be at least 6 characters"),
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const ChangePassword = () => {
    const [showCurrentPwd, setShowCurrentPwd] = useState(false);
    const [showNewPwd, setShowNewPwd] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { user, logout, isLoggedIn } = useAuth(); // Assumes user context provides the logged-in user's data

    const { register, handleSubmit, formState: { errors } } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: { user_id: user?.user_id || "" }, // Pre-fill user_id if available
    });

    const onSubmit: SubmitHandler<ChangePasswordFormValues> = async (data) => {
        setErrorMessage(null);
        setSuccessMessage(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_KEY_UPDATE_PWD}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Failed to change password.");
                return;
            }

            setSuccessMessage("Password changed successfully!");
            logout() // Then Logout
        } catch (error) {
            setErrorMessage("An unexpected error occurred. Please try again.");
        }
    };

    if (!isLoggedIn){
        return <Navigate to="/login" />;
    }

    return (
        <section className="min-h-screen bg-gray-300 w-full flex items-center">
            <Container>
                <form onSubmit={handleSubmit(onSubmit)} className="border border-gray-400 px-6 py-10 rounded-lg space-y-5 max-w-[30rem] mx-auto shadow-lg">
                    <h2 className="text-2xl font-bold text-center">Change Password</h2>

                    <div className="flex flex-col gap-1">
                        <Input
                            type="text"
                            placeholder="User ID"
                            aria-label="User ID"
                            {...register("user_id")}
                            disabled
                        />
                        {errors.user_id && <p className="text-red-500">{errors.user_id.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="relative flex items-center">
                            <Input
                                type={showCurrentPwd ? "text" : "password"}
                                placeholder="Current Password"
                                aria-label="Current Password"
                                {...register("current_password")}
                            />
                            <div onClick={() => setShowCurrentPwd(!showCurrentPwd)} className="absolute right-5 cursor-pointer text-gray-400">
                                {showCurrentPwd ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                        {errors.current_password && <p className="text-red-500">{errors.current_password.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="relative flex items-center">
                            <Input
                                type={showNewPwd ? "text" : "password"}
                                placeholder="New Password"
                                aria-label="New Password"
                                {...register("new_password")}
                            />
                            <div onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-5 cursor-pointer text-gray-400">
                                {showNewPwd ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                        {errors.new_password && <p className="text-red-500">{errors.new_password.message}</p>}
                    </div>

                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    {successMessage && <p className="text-green-500">{successMessage}</p>}

                    <Button className="w-full bg-primary hover:bg-primary/75">Change Password</Button>
                </form>
            </Container>
        </section>
    );
};
