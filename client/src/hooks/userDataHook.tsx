import { UserProfile, UserProfileResponse } from '@/types/UserTypes';  
import { useState, useEffect } from 'react';    

const useUserProfile = (user: { user_id: string } | null) => {  
    const [profile, setProfile] = useState<UserProfile | any>();  
    const [loading, setLoading] = useState(false);  
    const [error, setError] = useState<string | null>(null);  

    useEffect(() => {  
        const fetchProfile = async () => {  
            if (!user) {  
                setError("Mtumiaji hajaingia.");  
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

                // Check if the response was successful before setting the profile  
                if (data.success) {  
                    setProfile(data.user_profile);  
                } else {  
                    throw new Error("Profile data fetch was not successful.");  
                }  
            } catch (err) {  
                // Log the error for debugging  
                console.error("Failed to fetch user profile:", err);  
                setError((err as Error).message);  
            } finally {  
                setLoading(false);  
            }  
        };  

        fetchProfile();  
    }, [user]);  

    return { profile, loading, error };  
};  

export default useUserProfile;