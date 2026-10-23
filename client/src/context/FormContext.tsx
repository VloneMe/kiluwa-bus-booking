import React, { createContext, useContext, useState } from 'react';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

// Zod schema for passenger data
const passengerSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  mobile: z.string().min(10, { message: "Mobile number must be at least 10 digits" }),
  gender: z.enum(["child", "adult"], { message: "Please select a valid gender" }),
  idType: z.string().min(1, { message: "ID type is required" }),
  idNumber: z.string().min(1, { message: "ID number is required" }),
  email: z.string().email({ message: "Invalid email" }).optional(),
});

const SeatsFormSchema = z.object({
  passengers: z.array(passengerSchema),
});

// Create a context for the form
const FormContext = createContext<{
  handleSubmitForm: (values: any) => Promise<void>;
  appendPassenger: () => void;
  removePassenger: (index: number) => void;
  fields: any;
  register: any;
  errors: any;
} | null>(null);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { register, control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(SeatsFormSchema),
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'passengers',
  });

  const handleSubmitForm = async (values: any) => {
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
          accept: "application/json"
        }
      });

      if (!res.ok) throw new Error("Failed to send data!");

      await res.json();

      toast({
        title: "Success",
        description: "Data successfully submitted!",
        variant: "default",
      });

      reset();

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <FormContext.Provider value={{
      handleSubmitForm: handleSubmit(handleSubmitForm),
      appendPassenger: () => append({ firstName: '', lastName: '', mobile: '', gender: 'adult', idType: '', idNumber: '', email: '' }),
      removePassenger: (index: number) => remove(index),
      fields,
      register,
      errors
    }}>
      {children}
    </FormContext.Provider>
  );
};

// Hook to access the form context
export const useFormContext = () => useContext(FormContext);
