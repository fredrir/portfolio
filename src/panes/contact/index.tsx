"use client";

import { useState, useEffect, useRef } from "react";
import { useRecaptcha } from "@/shared/components/recaptcha-provider";
import { sendContactForm } from "@/app/actions/contact";
import { useNotification } from "@/shared/notification";
import { MY_EMAIL } from "@/lib/constants";
import { delay, genQueueId } from "./utils";
import { useVimMode } from "./hooks/use-vim-mode";
import { SendLog } from "./components/send-log";
import type { ContactProps } from "@/i18n/types";

type SendState = "idle" | "sending" | "success" | "error";

const EMPTY_FORM = { name: "", email: "", phone: "", message: "" };

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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
    appendLog("Resolving MX record for hansteen.dev...");
    await delay(300);

    let token: string;
    try {
      token = await executeRecaptcha("contact_form");
      appendLog("CAPTCHA verification .............. [  OK  ]");
    } catch (error) {
      appendLog("CAPTCHA verification .............. [FAILED]");
      setSendState("error");
      console.error(error);
      notification.error(contact.recaptchaError);
      return;
    }

    await delay(250);
    appendLog("Establishing TLS connection ........ [  OK  ]");
    await delay(200);
    appendLog("Authenticating sender .............. [  OK  ]");
    await delay(150);
    appendLog(`Sending ${formData.message.length} bytes ...`);

    try {
      const result = await sendContactForm({
        ...formData,
        recaptchaToken: token,
      });

      if (result.success) {
        appendLog("Message delivery ................... [  OK  ]");
        appendLog("");
        appendLog("Mail sent successfully. Queue ID: " + genQueueId());
        setSendState("success");
        notification.success(contact.submitSuccess);
        setTimeout(() => {
          setFormData(EMPTY_FORM);
          setSendState("idle");
          setSendLog([]);
        }, 4000);
      } else {
        appendLog("Message delivery ................... [FAILED]");
        appendLog("Error: " + (result.error ?? "unknown"));
        setSendState("error");
        notification.error(contact.submitError);
      }
    } catch (error) {
      console.error(contact.submitError + ": ", error);
      appendLog("Connection error: ETIMEDOUT");
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
      className="flex-1 overflow-hidden flex flex-col outline-hidden h-full"
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col flex-1"
      >
        <div className="border-b border-border-faint px-3 py-2 space-y-1.5">
          <div className="flex items-center border-b border-border-faint pb-1.5">
            <span className="text-vim-label w-10 shrink-0">To:</span>
            <span className="text-muted-foreground">{MY_EMAIL}</span>
          </div>
          <div className="flex items-center border-b border-border-faint pb-1.5">
            <label
              htmlFor="contact-name"
              className="text-vim-label w-10 shrink-0"
            >
              From:
            </label>
            <div className="flex-1 flex items-center gap-1 min-w-0">
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
                className="flex-1 min-w-0 bg-transparent text-foreground outline-hidden font-mono text-xs
                  placeholder:text-placeholder disabled:opacity-50"
                placeholder={contact.name}
                autoComplete="off"
              />
              {focusedField === "name" && (
                <span className="text-primary animate-pulse">█</span>
              )}
            </div>
          </div>
          <div className="flex items-center border-b border-border-faint pb-1.5">
            <label
              htmlFor="contact-email"
              className="text-vim-label w-10 shrink-0"
            >
              Mail:
            </label>
            <div className="flex-1 flex items-center gap-1 min-w-0">
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
                className="flex-1 min-w-0 bg-transparent text-foreground outline-hidden font-mono text-xs
                  placeholder:text-placeholder disabled:opacity-50"
                placeholder={contact.email}
                autoComplete="off"
              />
              {focusedField === "email" && (
                <span className="text-primary animate-pulse">█</span>
              )}
            </div>
          </div>
          <div className="flex items-center pb-1.5">
            <label
              htmlFor="contact-phone"
              className="text-vim-label w-10 shrink-0"
            >
              Tel:
            </label>
            <div className="flex-1 flex items-center gap-1 min-w-0">
              <input
                id="contact-phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => handleFocus("phone")}
                onBlur={() => setFocusedField(null)}
                disabled={isSending}
                className="flex-1 min-w-0 bg-transparent text-foreground outline-hidden font-mono text-xs
                  placeholder:text-placeholder disabled:opacity-50"
                placeholder={`${contact.phone} (${contact.optional})`}
                autoComplete="off"
              />
              {focusedField === "phone" && (
                <span className="text-primary animate-pulse">█</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex min-h-36">
            <div className="w-8 shrink-0 border-r border-border-faint bg-surface-faint flex flex-col items-end pt-2 pr-1 select-none">
              {(formData.message.length > 0 ? messageLines : [""]).map(
                (_, i) => (
                  <span
                    key={i}
                    className="text-2xs leading-editor text-vim-line-number"
                  >
                    {i + 1}
                  </span>
                ),
              )}
              {formData.message.length > 0 &&
                Array.from({
                  length: Math.max(0, 8 - messageLines.length),
                }).map((_, i) => (
                  <span
                    key={`tilde-${i}`}
                    className="text-2xs leading-editor text-vim-tilde"
                  >
                    ~
                  </span>
                ))}
              {formData.message.length === 0 &&
                Array.from({ length: 7 }).map((_, i) => (
                  <span
                    key={`tilde-${i}`}
                    className="text-2xs leading-editor text-vim-tilde"
                  >
                    ~
                  </span>
                ))}
            </div>
            <div className="flex-1 relative">
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => handleFocus("message")}
                onBlur={() => setFocusedField(null)}
                required
                disabled={isSending}
                className="w-full h-full min-h-36 bg-transparent text-foreground outline-hidden font-mono text-xs
                  resize-none p-2 leading-editor placeholder:text-placeholder disabled:opacity-50"
                placeholder={
                  vim.vimMode === "normal"
                    ? contact.vimHintNormal
                    : contact.message + "..."
                }
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        <SendLog lines={sendLog} logEndRef={logEndRef} />

        <div className="flex items-center justify-between px-3 py-1 border-t border-wm-border bg-surface-faint">
          <div className="flex-1 min-w-0">
            {vim.showCmd ? (
              <div className="flex items-center text-xs">
                <span className="text-foreground">:</span>
                <span className="text-foreground">{vim.cmdBuffer}</span>
                <span className="text-primary-soft animate-pulse">█</span>
              </div>
            ) : vim.vimMode === "insert" ? (
              <span className="text-xs font-bold text-foreground">
                -- INSERT --
              </span>
            ) : sendState === "idle" ? (
              <span className="text-xs text-subtle">
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
            <span className="text-ghost text-2xs">
              {messageLines.length},
              {formData.message.length > 0
                ? (messageLines[messageLines.length - 1]?.length ?? 0) + 1
                : 0}
            </span>
            <button
              type="submit"
              disabled={isSending}
              className="font-mono text-xs px-3 py-0.5 rounded border border-control-border-hover
                text-primary hover:bg-control-active hover:border-wm-border-swap
                active:bg-surface-selected transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isSending ? contact.submitLoading : ":wq"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
