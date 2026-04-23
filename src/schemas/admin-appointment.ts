import { z } from "zod";
import { AppointmentStatus } from "@prisma/client";

export const adminAppointmentSchema = z.object({
  patientId: z.string().min(1, "Veuillez choisir un patient"),
  practitionerId: z.string().min(1, "Veuillez choisir un praticien"),
  serviceId: z.string().min(1, "Veuillez choisir un soin"),
  startsAt: z
    .any()
    .transform((val) => {
      if (typeof val === "string") return new Date(val);
      return val;
    })
    .pipe(z.date({ error: () => ({ message: "Date et heure invalides" }) })),
  status: z.nativeEnum(AppointmentStatus),
  notes: z.string().optional(),
});

export type AdminAppointmentInput = z.infer<typeof adminAppointmentSchema>;
