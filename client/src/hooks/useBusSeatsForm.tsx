import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the schema using Zod
const FormSchema = z.object({
  firstName: z.string().nonempty("First name is required."),
  lastName: z.string().nonempty("Last name is required."),
  mobileNumber: z.string().nonempty("Mobile number is required."),
  gender: z.enum(["male", "female"], {
    required_error: "Please select a gender.",
  }),
  type: z.enum(["adult", "child"], {
    required_error: "Please select a type.",
  }),
  email: z.string().email("Invalid email format."),
  idType: z.string({
    required_error: "Please select an ID type.",
  }),
  idNumber: z.string().nonempty("ID number is required."),
});

export function useBusSeatsForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleSubmit = (seatName: string, onDataReady: (data: any) => void) => {
    return form.handleSubmit((data) => {
      const formData = { ...data, seatName };
      onDataReady(formData);
    });
  };

  return {
    form,
    handleSubmit,
  };
};