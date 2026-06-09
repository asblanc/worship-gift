"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { upcomingEvents } from "@/lib/events-config";

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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
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

              const totalRevenue = orders?.reduce((sum, o) => sum + (o.amount || 0), 0) || 0;

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
                id: evt.id, title: evt.title, date: evt.date, time: evt.time,
                location: evt.location, price: evt.price, priceValue: evt.priceValue,
                ticketCount: 0, totalRevenue: 0,
              };
            }
          })
        );
        setEvents(enriched);
      } catch {
        setEvents(
          upcomingEvents.map((evt) => ({
            id: evt.id, title: evt.title, date: evt.date, time: evt.time,
            location: evt.location, price: evt.price, priceValue: evt.priceValue,
            ticketCount: 0, totalRevenue: 0,
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

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="font-heading text-3xl font-bold text-white">Événements</h1>
        <p className="mt-1 text-sm text-gray-400">
          Statistiques et gestion des événements.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
        </div>
      ) : (
        <motion.div variants={stagger} className="grid gap-4">
          {events.map((evt) => (
            <motion.div
              key={evt.id}
              variants={fadeUp}
              className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-6 transition-all hover:border-[#C9A84C]/20"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1.5">
                  <h2 className="font-heading text-xl font-semibold text-white">{evt.title}</h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {evt.date}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {evt.time}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {evt.location}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[#C9A84C]">{evt.price}</p>
                </div>
                <div className="flex gap-8">
                  <div className="text-center">
                    <p className="font-heading text-2xl font-bold text-white">{evt.ticketCount}</p>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400">Billets</p>
                  </div>
                  <div className="text-center">
                    <p className="font-heading text-2xl font-bold text-[#C9A84C]">
                      {formatMAD(evt.totalRevenue)}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400">CA estimé</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="rounded-xl border border-dashed border-white/[0.06] p-6 text-center">
        <p className="text-xs text-gray-400">
          Les événements sont configurés dans{" "}
          <code className="rounded bg-[#C9A84C]/10 px-1.5 py-0.5 font-mono text-xs text-[#C9A84C]">
            src/lib/events-config.ts
          </code>
          . Pour ajouter un événement, modifiez ce fichier.
        </p>
      </div>
    </motion.div>
  );
}