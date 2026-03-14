"use client";

import { GitHubPane } from "./GitHubPane";
import { SpotifyPane } from "./SpotifyPane";
import { ContactForm } from "./ContactForm";
import type { ContactProps } from "./types";

const Contact = ({ contact }: ContactProps) => {
  return (
    <div className="flex flex-col px-4" id="contact">
      <div className="py-10 mt-24 container mx-auto">
        <div className="rounded-lg border border-primary/20 bg-background/60 backdrop-blur-sm shadow-lg shadow-primary/5 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-1 border-b border-primary/15 bg-primary/[0.03]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500/60" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
              <div className="w-2 h-2 rounded-full bg-green-500/60" />
            </div>
            <span className="font-mono text-2xs text-muted-foreground/50">
              tmux: contact [3 panes]
            </span>
            <span className="font-mono text-2xs text-primary/40">
              fredrir@fredrir
            </span>
          </div>

          <div className="p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              <GitHubPane />
              <SpotifyPane />
            </div>

            <ContactForm contact={contact} />
          </div>

          <div className="flex items-center justify-between px-3 py-0.5 border-t border-primary/15 bg-primary/[0.03]">
            <span className="font-mono text-3xs text-primary/40">
              [0] contact
            </span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-3xs text-muted-foreground/30">
                {contact.title}
              </span>
              <span className="font-mono text-3xs text-primary/40">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}{" "}
                {new Date().toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
