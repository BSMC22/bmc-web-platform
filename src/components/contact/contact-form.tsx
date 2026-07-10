"use client";

import { useState, type FormEvent } from "react";
import { ArrowRightIcon, CheckCircleIcon } from "@/components/icons";

const serviceOptions = [
  "Marine Inspection",
  "Technical Audit",
  "Condition / Pre-Purchase Survey",
  "Vetting Support",
  "Technical Consultancy",
  "Otro",
];

const inputStyles =
  "w-full rounded-md border border-brand-slate-200 bg-white px-4 py-3 text-sm text-brand-navy-900 placeholder:text-brand-slate-500 focus:border-brand-teal-500 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/30";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  // NOTE(BMC): este formulario aún no está conectado a un backend real.
  // Cuando se integre Supabase / un endpoint de envío de correo, reemplazar
  // este handler por el envío real de los datos.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitted");
  }

  if (status === "submitted") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-brand-slate-200 bg-white p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-teal-500/10 text-brand-teal-500">
          <CheckCircleIcon className="h-6 w-6" />
        </span>
        <h3 className="text-xl font-semibold text-brand-navy-900">
          ¡Gracias por contactarnos!
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-brand-slate-600">
          Recibimos tu solicitud. Nuestro equipo se va a comunicar con vos a la
          brevedad para coordinar los próximos pasos.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-brand-navy-900">
            Nombre completo
          </label>
          <input id="name" name="name" type="text" required className={inputStyles} placeholder="Tu nombre" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="company" className="text-sm font-medium text-brand-navy-900">
            Empresa
          </label>
          <input id="company" name="company" type="text" className={inputStyles} placeholder="Nombre de tu empresa" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-brand-navy-900">
            Email
          </label>
          <input id="email" name="email" type="email" required className={inputStyles} placeholder="tu@empresa.com" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-brand-navy-900">
            Teléfono
          </label>
          <input id="phone" name="phone" type="tel" className={inputStyles} placeholder="+00 000 000 000" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="service" className="text-sm font-medium text-brand-navy-900">
          Servicio de interés
        </label>
        <select id="service" name="service" className={inputStyles} defaultValue={serviceOptions[0]}>
          {serviceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-brand-navy-900">
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={inputStyles}
          placeholder="Contanos qué necesitás: tipo de inspección, ubicación, fechas, etc."
        />
      </div>

      <button
        type="submit"
        className="inline-flex w-fit items-center justify-center gap-2 rounded-md bg-brand-teal-500 px-6 py-3 text-sm font-semibold text-brand-navy-950 transition-colors hover:bg-brand-teal-400"
      >
        Enviar Solicitud
        <ArrowRightIcon className="h-4 w-4" />
      </button>
    </form>
  );
}
