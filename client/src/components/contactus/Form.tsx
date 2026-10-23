import { useForm, FieldError } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Jina lazima liwe angalau herufi 2"),
  email: z.string().email("Anwani ya barua pepe si sahihi"),
  subject: z.string().min(3, "Mada lazima iwe angalau herufi 3"),
  message: z.string().min(10, "Ujumbe lazima uwe angalau herufi 10"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export const Form = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setErrorMessage("");
    setSuccess(false);
    try {
      const res = await fetch("/api/contactus/", {
        method: "POST",
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          subject: values.subject,
          messages: [
            {
              subject: values.subject,
              message: values.message,
            },
          ],
        }),
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Imeshindikana kutuma ujumbe!");

      await res.json();
      reset();
      setSuccess(true);
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Hitilafu isiyotarajiwa.";
      setErrorMessage(msg);
      console.error(error);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {errorMessage && (
        <div
          className="contact-form__banner contact-form__banner--error"
          role="alert"
        >
          {errorMessage}
        </div>
      )}
      {success && (
        <div
          className="contact-form__banner contact-form__banner--success"
          role="status"
        >
          Asante! Ujumbe wako umepokelewa. Tutawasiliana nawe hivi karibuni.
        </div>
      )}

      <div className="contact-form__field">
        <Label htmlFor="contact-name" className="contact-form__label">
          Jina
        </Label>
        <Input
          id="contact-name"
          autoComplete="name"
          className={cn(
            "contact-form__input",
            errors.name && "contact-form__input--error"
          )}
          placeholder="Jina lako kamili"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          {...register("name")}
        />
        {errors.name && (
          <p id="contact-name-error" className="contact-form__error" role="alert">
            {(errors.name as FieldError).message}
          </p>
        )}
      </div>

      <div className="contact-form__field">
        <Label htmlFor="contact-email" className="contact-form__label">
          Barua pepe
        </Label>
        <Input
          id="contact-email"
          type="email"
          autoComplete="email"
          className={cn(
            "contact-form__input",
            errors.email && "contact-form__input--error"
          )}
          placeholder="mfano@barua.com"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p
            id="contact-email-error"
            className="contact-form__error"
            role="alert"
          >
            {(errors.email as FieldError).message}
          </p>
        )}
      </div>

      <div className="contact-form__field">
        <Label htmlFor="contact-subject" className="contact-form__label">
          Mada
        </Label>
        <Input
          id="contact-subject"
          autoComplete="off"
          className={cn(
            "contact-form__input",
            errors.subject && "contact-form__input--error"
          )}
          placeholder="Mada ya ujumbe wako"
          aria-invalid={errors.subject ? true : undefined}
          aria-describedby={errors.subject ? "contact-subject-error" : undefined}
          {...register("subject")}
        />
        {errors.subject && (
          <p
            id="contact-subject-error"
            className="contact-form__error"
            role="alert"
          >
            {(errors.subject as FieldError).message}
          </p>
        )}
      </div>

      <div className="contact-form__field">
        <Label htmlFor="contact-message" className="contact-form__label">
          Ujumbe
        </Label>
        <Textarea
          id="contact-message"
          className={cn(
            "contact-form__input contact-form__textarea",
            errors.message && "contact-form__input--error"
          )}
          placeholder="Andika ujumbe wako hapa..."
          rows={5}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          {...register("message")}
        />
        {errors.message && (
          <p
            id="contact-message-error"
            className="contact-form__error"
            role="alert"
          >
            {(errors.message as FieldError).message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "contact-form__submit w-full sm:w-auto",
          "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
      >
        {isSubmitting ? "Inatumwa…" : "Tuma ujumbe"}
      </Button>
    </form>
  );
};
