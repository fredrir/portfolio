"use client";

import { useEffect, useRef, useState } from "react";
import type { ContactProps } from "@/i18n/types";
import { MY_EMAIL } from "@/lib/constants";
import { sendContactForm } from "@/server/contact";
import { useRecaptcha } from "@/shared/components/recaptcha-provider";
import { useNotification } from "@/shared/notification";
import { SendLog } from "./components/send-log";
import { useVimMode } from "./hooks/use-vim-mode";
import { delay, genQueueId } from "./utils";

type SendState = "idle" | "sending" | "success" | "error";

const EMPTY_FORM = { name: "", email: "", phone: "", message: "" };

function formatCopy(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

export function ContactPane({ contact }: ContactProps) {
  const { executeRecaptcha } = useRecaptcha();
  const notification = useNotification();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [sendState, setSendState] = useState<SendState>("idle");
  const [sendLog, setSendLog] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isSending = sendState === "sending";

  const vim = useVimMode(containerRef, isSending, {
    onSubmit: () => formRef.current?.requestSubmit(),
    onReset: () => {
      setFormData(EMPTY_FORM);
    },
  });

  const messageLines = formData.message.split("\n");

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [sendLog]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (field: string) => {
    setFocusedField(field);
    if (vim.vimMode === "normal") vim.setVimMode("insert");
  };

  const appendLog = (line: string) => {
    setSendLog((prev) => [...prev, line]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      notification.error(contact.recaptchaError);
      return;
    }

    vim.setVimMode("normal");
    setFocusedField(null);
    (document.activeElement as HTMLElement)?.blur();
    setSendState("sending");
    setSendLog([]);

    appendLog(`$ sendmail -t ${MY_EMAIL}`);
    await delay(400);
    appendLog(contact.log.resolvingMx);
    await delay(300);

    let token: string;
    try {
      token = await executeRecaptcha("contact_form");
      appendLog(contact.log.captchaOk);
    } catch (error) {
      appendLog(contact.log.captchaFailed);
      setSendState("error");
      console.error(error);
      notification.error(contact.recaptchaError);
      return;
    }

    await delay(250);
    appendLog(contact.log.tlsOk);
    await delay(200);
    appendLog(contact.log.authOk);
    await delay(150);
    appendLog(formatCopy(contact.log.sendingBytes, { bytes: formData.message.length }));

    try {
      const result = await sendContactForm({
        data: { ...formData, recaptchaToken: token },
      });

      if (result.success) {
        appendLog(contact.log.deliveryOk);
        appendLog("");
        appendLog(formatCopy(contact.log.sent, { queueId: genQueueId() }));
        setSendState("success");
        notification.success(contact.submitSuccess);
        setTimeout(() => {
          setFormData(EMPTY_FORM);
          setSendState("idle");
          setSendLog([]);
        }, 4000);
      } else {
        appendLog(contact.log.deliveryFailed);
        appendLog(
          formatCopy(contact.log.error, {
            error: result.error ?? contact.log.unknownError,
          }),
        );
        setSendState("error");
        notification.error(contact.submitError);
      }
    } catch (error) {
      console.error(contact.submitError + ": ", error);
      appendLog(contact.log.connectionError);
      setSendState("error");
      notification.error(contact.submitError);
      setTimeout(() => {
        setSendState("idle");
        setSendLog([]);
      }, 4000);
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="flex h-full flex-1 flex-col overflow-hidden outline-hidden"
    >
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <div className="space-y-1.5 border-border-faint border-b px-3 py-2">
          <div className="flex items-center border-border-faint border-b pb-1.5">
            <span className="w-10 shrink-0 text-vim-label">{contact.toLabel}</span>
            <span className="text-muted-foreground">{MY_EMAIL}</span>
          </div>
          <div className="flex items-center border-border-faint border-b pb-1.5">
            <label htmlFor="contact-name" className="w-10 shrink-0 text-vim-label">
              {contact.fromLabel}
            </label>
            <div className="flex min-w-0 flex-1 items-center gap-1">
              <input
                id="contact-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => handleFocus("name")}
                onBlur={() => setFocusedField(null)}
                required
                disabled={isSending}
                className="min-w-0 flex-1 bg-transparent font-mono text-foreground text-xs outline-hidden placeholder:text-placeholder disabled:opacity-50"
                placeholder={contact.name}
                autoComplete="off"
              />
              {focusedField === "name" && <span className="animate-pulse text-primary">█</span>}
            </div>
          </div>
          <div className="flex items-center border-border-faint border-b pb-1.5">
            <label htmlFor="contact-email" className="w-10 shrink-0 text-vim-label">
              {contact.mailLabel}
            </label>
            <div className="flex min-w-0 flex-1 items-center gap-1">
              <input
                id="contact-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus("email")}
                onBlur={() => setFocusedField(null)}
                required
                disabled={isSending}
                className="min-w-0 flex-1 bg-transparent font-mono text-foreground text-xs outline-hidden placeholder:text-placeholder disabled:opacity-50"
                placeholder={contact.email}
                autoComplete="off"
              />
              {focusedField === "email" && <span className="animate-pulse text-primary">█</span>}
            </div>
          </div>
          <div className="flex items-center pb-1.5">
            <label htmlFor="contact-phone" className="w-10 shrink-0 text-vim-label">
              {contact.phoneLabel}
            </label>
            <div className="flex min-w-0 flex-1 items-center gap-1">
              <input
                id="contact-phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => handleFocus("phone")}
                onBlur={() => setFocusedField(null)}
                disabled={isSending}
                className="min-w-0 flex-1 bg-transparent font-mono text-foreground text-xs outline-hidden placeholder:text-placeholder disabled:opacity-50"
                placeholder={`${contact.phone} (${contact.optional})`}
                autoComplete="off"
              />
              {focusedField === "phone" && <span className="animate-pulse text-primary">█</span>}
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-36 flex-1">
            <div className="flex w-8 shrink-0 select-none flex-col items-end border-border-faint border-r bg-surface-faint pt-2 pr-1">
              {(formData.message.length > 0 ? messageLines : [""]).map((_, i) => (
                <span key={i} className="text-2xs text-vim-line-number leading-editor">
                  {i + 1}
                </span>
              ))}
              {formData.message.length > 0 &&
                Array.from({
                  length: Math.max(0, 8 - messageLines.length),
                }).map((_, i) => (
                  <span key={`tilde-${i}`} className="text-2xs text-vim-tilde leading-editor">
                    ~
                  </span>
                ))}
              {formData.message.length === 0 &&
                Array.from({ length: 7 }).map((_, i) => (
                  <span key={`tilde-${i}`} className="text-2xs text-vim-tilde leading-editor">
                    ~
                  </span>
                ))}
            </div>
            <div className="relative flex-1">
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => handleFocus("message")}
                onBlur={() => setFocusedField(null)}
                required
                disabled={isSending}
                className="h-full min-h-36 w-full resize-none bg-transparent p-2 font-mono text-foreground text-xs leading-editor outline-hidden placeholder:text-placeholder disabled:opacity-50"
                placeholder={
                  vim.vimMode === "normal" ? contact.vimHintNormal : contact.message + "..."
                }
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        <SendLog
          lines={sendLog}
          logEndRef={logEndRef}
          markers={{
            okToken: contact.log.okToken,
            okBadge: contact.log.okBadge,
            failedToken: contact.log.failedToken,
            failedBadge: contact.log.failedBadge,
            sentPrefix: contact.log.sentPrefix,
            errorPrefix: contact.log.errorPrefix,
            connectionErrorPrefix: contact.log.connectionErrorPrefix,
          }}
        />

        <div className="flex items-center justify-between border-wm-border border-t bg-surface-faint px-3 py-1">
          <div className="min-w-0 flex-1">
            {vim.showCmd ? (
              <div className="flex items-center text-xs">
                <span className="text-foreground">:</span>
                <span className="text-foreground">{vim.cmdBuffer}</span>
                <span className="animate-pulse text-primary-soft">█</span>
              </div>
            ) : vim.vimMode === "insert" ? (
              <span className="font-bold text-foreground text-xs">{contact.insertMode}</span>
            ) : sendState === "idle" ? (
              <span className="text-subtle text-xs">
                {contact.vimHintStatus.split(/\{|\}/).map((part, i) =>
                  part === "i" || part === "wq" ? (
                    <span key={i} className="text-primary-muted">
                      {part === "wq" ? `:${part}` : part}
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  ),
                )}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xs text-ghost">
              {messageLines.length},
              {formData.message.length > 0
                ? (messageLines[messageLines.length - 1]?.length ?? 0) + 1
                : 0}
            </span>
            <button
              type="submit"
              disabled={isSending}
              className="rounded border border-control-border-hover px-3 py-0.5 font-mono text-primary text-xs transition-all hover:border-wm-border-swap hover:bg-control-active active:bg-surface-selected disabled:cursor-not-allowed disabled:opacity-30"
            >
              {isSending ? contact.submitLoading : contact.submitCommand}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
