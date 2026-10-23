import { useState, useEffect } from "react";  
import { useForm } from "react-hook-form";  
import { z } from "zod";  
import { zodResolver } from "@hookform/resolvers/zod";  
import { Container } from "../Container";  
import { Input } from "../ui/input";  
import { Button } from "../ui/button";  
import { Separator } from "../ui/separator";  
import { useAuth } from "@/context/AuthProvider";  
import {  
  Select,  
  SelectContent,  
  SelectItem,  
  SelectTrigger,  
  SelectValue,  
} from "../ui/select";  
import { Navigate } from "react-router-dom";  
import useUserProfile from "@/hooks/userDataHook";  

// Define the validation schema  
const updateProfileSchema = z.object({  
  first_name: z.string().min(1, "First Name is required"),  
  middle_name: z.string().optional(),  
  last_name: z.string().min(1, "Last Name is required"),  
  mobile_number: z.string().min(10, "Enter a valid mobile number"),  
  gender: z.enum(["male", "female"], { required_error: "Gender is required" }),  
  nationality: z.string().min(1, "Nationality is required"),  
  email: z.string().email("Invalid email address").optional(),  
  idType: z.string().optional(),  
  idNumber: z.string().optional(),  
});  

type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;  

export const UpdateProfile: React.FC = () => {  
  const { user, isLoggedIn } = useAuth();  
  const { profile } = useUserProfile(user);  
  const [updated, setUpdated] = useState(false);
  
  // console.log("Profile: ", profile)

  // Set up the form with react-hook-form  
  const { register, handleSubmit, formState: { errors }, setValue, reset} = useForm<UpdateProfileFormValues>({  
    resolver: zodResolver(updateProfileSchema),  
  });  

  // Effect to reset form with fetched profile data  
  useEffect(() => {  
    if (profile) {  
      reset({  
        first_name: profile.first_name || '',  
        middle_name: profile.middle_name || '',  
        last_name: profile.last_name || '',  
        mobile_number: profile.mobile_number || '',  
        gender: (profile.gender as "male" | "female") || 'male',
        nationality: profile.nationality || '',  
        email: profile.email || '',  
        idType: profile.identity_type || '',  
        idNumber: profile.identity_number || '',  
      });  
    }  
  }, [profile, reset]);  

  // Handle form submission  
  const onSubmit = async (data: UpdateProfileFormValues) => {  
    const payload = {  
      user_id: user?.user_id,  
      ...data,  
    };  

    try {  
      const res = await fetch(`${import.meta.env.VITE_API_KEY_UPDATE_PROFILE}`, {  
        method: "PUT",  
        headers: {  
          "Content-Type": "application/json",  
        },  
        body: JSON.stringify(payload),  
      });  

      if (res.ok) {  
        console.log("Profile updated successfully:", await res.json());  
        setUpdated(true);  
      } else {  
        const error = await res.json();  
        console.error("Profile update failed:", error);  
        alert("Update Failed: " + (error.message || "Please try again later."));  
      }  
    } catch (err) {  
      console.error("Error during profile update:", err);  
      alert("An unexpected error occurred. Please try again later.");  
    }  
  };  

  // Redirect if user is not logged in  
  if (!isLoggedIn) {  
    return <Navigate to="/login" />;  
  }  

  // Redirect after successful update  
  if (updated) {  
    return <Navigate to="/myaccount" />;  
  }  

  return (  
    <section className="min-h-screen bg-gray-300 w-full flex items-center">  
      <Container className="mb-10 mt-20">  
        <form  
          onSubmit={handleSubmit(onSubmit)}  
          className="border border-gray-400 px-4 py-6 rounded-lg space-y-5 max-w-[30rem] lg:max-w-[50rem] mx-auto"  
        >  
          <h2 className="text-2xl font-bold text-center pb-5">Update Profile</h2>  

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">  
            <Input placeholder="First Name" {...register("first_name")} />  
            {errors.first_name && <p className="text-red-500">{errors.first_name.message}</p>}  

            <Input placeholder="Middle Name" {...register("middle_name")} />  

            <Input placeholder="Last Name" {...register("last_name")} />  
            {errors.last_name && <p className="text-red-500">{errors.last_name.message}</p>}  
          </div>  

          <Input  
            type="tel"  
            placeholder="Mobile Number"  
            {...register("mobile_number")}  
          />  
          {errors.mobile_number && <p className="text-red-500">{errors.mobile_number.message}</p>}  

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">  
            <Select onValueChange={(value) => setValue("gender", value as "male" | "female")} defaultValue={profile?.gender}>  
              <SelectTrigger>  
                <SelectValue placeholder="Select Gender" />  
              </SelectTrigger>  
              <SelectContent>  
                <SelectItem value="male">Male</SelectItem>  
                <SelectItem value="female">Female</SelectItem>  
              </SelectContent>  
            </Select>  
            {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}  

            <Select onValueChange={(value) => setValue("nationality", value)} defaultValue={profile?.nationality}>  
              <SelectTrigger>  
                <SelectValue placeholder="Select Nationality" />  
              </SelectTrigger>  
              <SelectContent>  
                <SelectItem value="TANZANIAN">Tanzanian</SelectItem>  
                <SelectItem value="NON TANZANIAN">Non-Tanzanian</SelectItem>  
              </SelectContent>  
            </Select>  
            {errors.nationality && <p className="text-red-500">{errors.nationality.message}</p>}  
          </div>  

          <Input type="email" placeholder="Email" {...register("email")} />  
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}  

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">  
            <Select onValueChange={(value) => setValue("idType", value)} defaultValue={profile?.identity_type}>  
              <SelectTrigger>  
                <SelectValue placeholder="Select ID Type" />  
              </SelectTrigger>  
              <SelectContent>  
                <SelectItem value="National ID">National ID</SelectItem>  
                <SelectItem value="Passport">Passport</SelectItem>  
                <SelectItem value="Voting ID">Voting ID</SelectItem>  
                <SelectItem value="Driving Licence">Driving Licence</SelectItem>  
              </SelectContent>  
            </Select>  
            <Input placeholder="ID Number" {...register("idNumber")} />  
          </div>  

          <Button className="w-full bg-primary hover:bg-primary/75">Update</Button>  
          <Separator />  
        </form>  
      </Container>  
    </section>  
  );  
};