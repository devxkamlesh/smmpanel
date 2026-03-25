"use client";

import { MessageSquare, Plus, Clock } from "lucide-react";

const MOCK_TICKETS = [
  { id: 1, subject: "Order #78451 not starting", status: "open", priority: "high", date: "2026-03-25 09:00", lastReply: "Waiting for support" },
  { id: 2, subject: "Refund request for partial order", status: "answered", priority: "medium", date: "2026-03-24 14:30", lastReply: "Admin replied 2h ago" },
  { id: 3, subject: "API key not working", status: "closed", priority: "low", date: "2026-03-23 11:00", lastReply: "Resolved" },
];

const STATUS_STYLES: Record<string, string> = {
  open: "bg-amber-100 text-amber-700",
  answered: "bg-green-100 text-green-700",
  closed: "bg-surface-container-high text-on-surface-variant",
};

export default function TicketsPage() {
  return (
    <div className="animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl shadow-card">
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-on-surface">Support Tickets</h1>
            <p className="text-sm text-on-surface-variant">Get help from our support team</p>
          </div>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-colors shadow-card">
            <Plus className="w-4 h-4" />
            New Ticket
          </button>
        </div>

        <div className="divide-y divide-outline-variant/10">
          {MOCK_TICKETS.map((ticket) => (
            <div key={ticket.id} className="p-6 hover:bg-surface-container-low/30 transition-colors cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-on-surface">{ticket.subject}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-on-surface-variant flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {ticket.date}
                      </span>
                      <span className="text-xs text-on-surface-variant">{ticket.lastReply}</span>
                    </div>
                  </div>
                </div>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[ticket.status]}`}>
                  {ticket.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
