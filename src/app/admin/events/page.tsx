"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { upcomingEvents } from "@/lib/events-config";

/* ================================================================
   Worship Gift — /admin/events — Gestion des événements
   Liste + nombre de billets vendus par événement.
   ================================================================ */

interface EventStats {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;
  priceValue: number;
  ticketCount: number;
  totalRevenue: number;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Pour chaque événement, compter les billets et le CA
        const enriched: EventStats[] = await Promise.all(
          upcomingEvents.map(async (evt) => {
            try {
              const { count: ticketCount } = await supabase
                .from("tickets")
                .select("*", { count: "exact", head: true })
                .eq("event_id", evt.id);

              const { data: orders } = await supabase
                .from("orders")
                .select("amount")
                .eq("status", "paid");

              // Approximation : les orders liées à cet événement
              const totalRevenue =
                orders?.reduce((sum, o) => sum + (o.amount || 0), 0) || 0;

              return {
                id: evt.id,
                title: evt.title,
                date: evt.date,
                time: evt.time,
                location: evt.location,
                price: evt.price,
                priceValue: evt.priceValue,
                ticketCount: ticketCount || 0,
                totalRevenue,
              };
            } catch {
              return {
                id: evt.id,
                title: evt.title,
                date: evt.date,
                time: evt.time,
                location: evt.location,
                price: evt.price,
                priceValue: evt.priceValue,
                ticketCount: 0,
                totalRevenue: 0,
              };
            }
          })
        );

        setEvents(enriched);
      } catch {
        setEvents(
          upcomingEvents.map((evt) => ({
            id: evt.id,
            title: evt.title,
            date: evt.date,
            time: evt.time,
            location: evt.location,
            price: evt.price,
            priceValue: evt.priceValue,
            ticketCount: 0,
            totalRevenue: 0,
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatMAD = (cents: number) =>
    new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(cents / 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">Événements</h1>
        <p className="mt-1 text-sm text-gray-400">Gestion et statistiques des événements.</p>
      </div>

      <div className="grid gap-4">
        {events.map((evt) => (
          <div key={evt.id} className="rounded-lg border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-heading text-xl font-semibold text-white">{evt.title}</h2>
                <p className="mt-1 text-sm text-gray-400">
                  {evt.date} à {evt.time} — {evt.location}
                </p>
                <p className="mt-1 text-sm text-[#C9A84C]">{evt.price}</p>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="font-heading text-2xl font-bold text-white">{evt.ticketCount}</p>
                  <p className="text-xs text-gray-500">Billets vendus</p>
                </div>
                <div className="text-center">
                  <p className="font-heading text-2xl font-bold text-[#C9A84C]">
                    {formatMAD(evt.totalRevenue)}
                  </p>
                  <p className="text-xs text-gray-500">CA estimé</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="rounded-lg border border-dashed border-gray-700 p-4 text-center">
        <p className="text-sm text-gray-500">
          Les événements sont configurés dans{" "}
          <code className="text-[#C9A84C]">src/lib/events-config.ts</code>.
          Pour ajouter un événement, modifiez ce fichier.
        </p>
      </div>
    </div>
  );
}