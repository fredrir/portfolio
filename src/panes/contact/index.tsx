"use client";

import { useState, useEffect, useRef } from "react";
import { useRecaptcha } from "@/shared/components/recaptcha-provider";
import { sendContactForm } from "@/app/actions/contact";
import toast from "react-hot-toast";
import { delay, genQueueId } from "./utils";
import type { ContactProps } from "@/shared/types";

type SendState = "idle" | "sending" | "success" | "error";
type VimMode = "normal" | "insert";

export function ContactPane({
  contact,
}: ContactProps) {
  const { executeRecaptcha } = useRecaptcha();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [sendState, setSendState] = useState<SendState>("idle");
  const [sendLog, setSendLog] = useState<string[]>([]);
  const [vimMode, setVimMode] = useState<VimMode>("normal");
  const [cmdBuffer, setCmdBuffer] = useState("");
  const [showCmd, setShowCmd] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const vimModeRef = useRef(vimMode);
  const showCmdRef = useRef(showCmd);
  const cmdBufferRef = useRef(cmdBuffer);
  const sendStateRef = useRef(sendState);
  vimModeRef.current = vimMode;
  showCmdRef.current = showCmd;
  cmdBufferRef.current = cmdBuffer;
  sendStateRef.current = sendState;

  const messageLines = formData.message.split("\n");

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [sendLog]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (sendStateRef.current === "sending") return;

      if (showCmdRef.current) {
        if (e.key === "Escape") {
          e.preventDefault();
          setCmdBuffer("");
          setShowCmd(false);
          return;
        }
        if (e.key === "Enter") {
          e.preventDefault();
          const cmd = cmdBufferRef.current.trim();
          if (cmd === "wq" || cmd === "wq!" || cmd === "x") {
            formRef.current?.requestSubmit();
          } else if (cmd === "q" || cmd === "q!") {
            setFormData({ name: "", email: "", phone: "", message: "" });
            setVimMode("normal");
          }
          setCmdBuffer("");
          setShowCmd(false);
          return;
        }
        if (e.key === "Backspace") {
          e.preventDefault();
          setCmdBuffer((prev) => {
            if (prev.length <= 1) {
              setShowCmd(false);
              return "";
            }
            return prev.slice(0, -1);
          });
          return;
        }
        if (e.key.length === 1) {
          e.preventDefault();
          setCmdBuffer((prev) => prev + e.key);
          return;
        }
        return;
      }

      if (vimModeRef.current === "normal") {
        if (e.key === ":") {
          e.preventDefault();
          setShowCmd(true);
          setCmdBuffer("");
          return;
        }
        if (e.key === "i" || e.key === "a") {
          e.preventDefault();
          setVimMode("insert");
          const firstInput = container.querySelector(
            "input:not([disabled]), textarea:not([disabled])",
          ) as HTMLElement;
          firstInput?.focus();
          return;
        }
      }

      if (vimModeRef.current === "insert" && e.key === "Escape") {
        e.preventDefault();
        setVimMode("normal");
        setFocusedField(null);
        (document.activeElement as HTMLElement)?.blur();
        container.focus();
        return;
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (field: string) => {
    setFocusedField(field);
    if (vimMode === "normal") setVimMode("insert");
  };

  const appendLog = (line: string) => {
    setSendLog((prev) => [...prev, line]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      toast.error(contact.recaptchaError);
      return;
    }

    setVimMode("normal");
    setFocusedField(null);
    (document.activeElement as HTMLElement)?.blur();
    setSendState("sending");
    setSendLog([]);

    appendLog("$ sendmail -t fhansteen@gmail.com");
    await delay(400);
    appendLog("Resolving MX record for hansteen.dev...");
    await delay(300);

    let token: string;
    try {
      token = await executeRecaptcha("contact_form");
      console.log(token);
      appendLog("CAPTCHA verification .............. [  OK  ]");
    } catch (error) {
      appendLog("CAPTCHA verification .............. [FAILED]");
      setSendState("error");
      console.error(error);
      toast.error(contact.recaptchaError);
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
        toast.success(contact.submitSuccess);
        setTimeout(() => {
          setFormData({ name: "", email: "", phone: "", message: "" });
          setSendState("idle");
          setSendLog([]);
        }, 4000);
      } else {
        appendLog("Message delivery ................... [FAILED]");
        appendLog("Error: " + (result.error ?? "unknown"));
        setSendState("error");
        toast.error(contact.submitError);
      }
    } catch (error) {
      console.error(contact.submitError + ": ", error);
      appendLog("Connection error: ETIMEDOUT");
      setSendState("error");
      toast.error(contact.submitError);
      setTimeout(() => {
        setSendState("idle");
        setSendLog([]);
      }, 4000);
    }
  };

  const isSending = sendState === "sending";
  const showLog = sendLog.length > 0;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="flex-1 overflow-hidden flex flex-col outline-hidden h-full"
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col flex-1 font-mono text-xs"
      >
        <div className="border-b border-border-faint px-3 py-2 space-y-1.5">
          <div className="flex items-center border-b border-border-faint pb-1.5">
            <span className="text-yellow-600 dark:text-vim-label w-10 shrink-0">
              To:
            </span>
            <span className="text-muted-foreground">fhansteen@gmail.com</span>
          </div>
          <div className="flex items-center border-b border-border-faint pb-1.5">
            <label
              htmlFor="contact-name"
              className="text-yellow-600 dark:text-vim-label w-10 shrink-0"
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
                className="flex-1 min-w-0 bg-transparent text-foreground outline-hidden font-mono text-xs max-md:text-base
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
              className="text-yellow-600 dark:text-vim-label w-10 shrink-0"
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
                className="flex-1 min-w-0 bg-transparent text-foreground outline-hidden font-mono text-xs max-md:text-base
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
              className="text-yellow-600 dark:text-vim-label w-10 shrink-0"
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
                className="flex-1 min-w-0 bg-transparent text-foreground outline-hidden font-mono text-xs max-md:text-base
                  placeholder:text-placeholder disabled:opacity-50"
                placeholder={`${contact.phone} (optional)`}
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
                    className="text-2xs leading-editor text-yellow-600/40 dark:text-vim-line-number"
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
                    className="text-2xs leading-editor text-blue-500/40 dark:text-vim-tilde"
                  >
                    ~
                  </span>
                ))}
              {formData.message.length === 0 &&
                Array.from({ length: 7 }).map((_, i) => (
                  <span
                    key={`tilde-${i}`}
                    className="text-2xs leading-editor text-blue-500/40 dark:text-vim-tilde"
                  >
                    ~
                  </span>
                ))}
            </div>
            <div className="flex-1 relative">
              <textarea
                ref={messageRef}
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => handleFocus("message")}
                onBlur={() => setFocusedField(null)}
                required
                disabled={isSending}
                className="w-full h-full min-h-36 bg-transparent text-foreground outline-hidden font-mono text-xs max-md:text-base
                  resize-none p-2 leading-editor placeholder:text-placeholder disabled:opacity-50"
                placeholder={
                  vimMode === "normal"
                    ? 'Press "i" to start typing...'
                    : contact.message + "..."
                }
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        {showLog && (
          <div className="border-t border-border-faint bg-muted/50 dark:bg-black/20 px-3 py-2 max-h-32 overflow-y-auto">
            {sendLog.map((line, i) => (
              <div key={i} className="leading-relaxed">
                {line.includes("[  OK  ]") ? (
                  <span>
                    {line.replace("[  OK  ]", "")}
                    <span className="text-green-400">[ OK ]</span>
                  </span>
                ) : line.includes("[FAILED]") ? (
                  <span>
                    {line.replace("[FAILED]", "")}
                    <span className="text-red-400">[FAILED]</span>
                  </span>
                ) : line.startsWith("$") ? (
                  <span>
                    <span className="text-primary">$</span>
                    {line.slice(1)}
                  </span>
                ) : line.startsWith("Mail sent") ? (
                  <span className="text-green-400">{line}</span>
                ) : line.startsWith("Error:") ||
                  line.startsWith("Connection error:") ? (
                  <span className="text-red-400">{line}</span>
                ) : (
                  <span className="text-muted-hover">{line}</span>
                )}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        )}

        <div className="flex items-center justify-between px-3 py-1 border-t border-wm-border bg-surface-faint">
          <div className="flex-1 min-w-0">
            {showCmd ? (
              <div className="flex items-center text-xs">
                <span className="text-foreground">:</span>
                <span className="text-foreground">{cmdBuffer}</span>
                <span className="text-primary-soft animate-pulse">█</span>
              </div>
            ) : vimMode === "insert" ? (
              <span className="text-xs font-bold text-foreground">
                -- INSERT --
              </span>
            ) : sendState === "idle" ? (
              <span className="text-xs text-subtle">
                Type <span className="text-primary-muted">i</span> to edit,{" "}
                <span className="text-primary-muted">:wq</span> to send
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
