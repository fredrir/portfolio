"use client";

import { EnvelopeIcon } from "@phosphor-icons/react";
import { PhoneIcon } from "@phosphor-icons/react/dist/ssr";
import type { Landing } from "@/i18n/types";
import { MY_EMAIL, MY_PHONE } from "@/lib/constants";
import { FredVatar } from "@/shared/fredvatar";

interface Props {
  landing: Landing;
}

export function AboutPane({ landing }: Props) {
  return (
    <div className="flex h-full flex-row items-center gap-3 overflow-auto p-4">
      <FredVatar ariaLabel={landing.avatarLabel} />
      <div className="flex min-w-0 flex-col">
        <div className="@xl:mb-3 mb-2 inline-flex items-end gap-1.5">
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full border border-border bg-overlay-medium" />
            <div className="h-2 w-2 rounded-full border border-border bg-overlay-medium" />
          </div>
          <div className="rounded-2xl border border-border bg-glass-heavy @xl:px-4 px-3 @xl:py-2 py-1.5 font-bold text-foreground text-sm">
            {landing.title}
            <span className="text-primary">{" <Fredrik/>"}</span>
          </div>
        </div>
        <div className="flex h-full @lg:max-w-sm @xl:max-w-md max-w-xs flex-col @xl:space-y-2.5 space-y-1.5 text-start">
          <p className="text-muted-foreground text-xs leading-relaxed">{landing.mainText}</p>
          <div className="mt-auto @xl:space-y-2.5 space-y-2 pt-1.5 text-xs">
            <a
              href={`mailto:${MY_EMAIL}`}
              className="group/link flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
            >
              <EnvelopeIcon
                weight="bold"
                className="h-3 w-3 text-primary opacity-60 transition-opacity group-hover/link:opacity-100"
              />
              <span className="text-primary/70">~</span>
              {MY_EMAIL}
            </a>
            <a
              href={`tel:${MY_PHONE.replace(/\s/g, "")}`}
              className="group/link flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
            >
              <PhoneIcon
                weight="bold"
                className="h-3 w-3 text-primary opacity-60 transition-opacity group-hover/link:opacity-100"
              />
              <span className="text-primary/70">~</span>
              {MY_PHONE}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
