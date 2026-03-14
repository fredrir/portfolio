"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRecaptcha } from "@/components/RecaptchaProvider";
import { sendContactForm } from "@/app/actions/contact";
import toast from "react-hot-toast";
import Image from "next/image";

interface Props {
  contact: {
    title: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    submit: string;
    submitSuccess: string;
    submitError: string;
    submitLoading: string;
    recaptchaError: string;
  };
}

interface ContributionDay {
  count: number;
  date: string;
  level: number;
}

interface GitHubData {
  username: string;
  name: string;
  bio: string;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  topLanguages: { lang: string; count: number }[];
  profileUrl: string;
  createdAt: string;
  contributions: ContributionDay[];
  totalContributions: number;
}

interface SpotifyData {
  isPlaying: boolean;
  notConfigured?: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumArt?: string;
  songUrl?: string;
  progressMs?: number;
  durationMs?: number;
}

const GITHUB_ASCII = [
  "   ╭─────────╮   ",
  "  ╭┤  ◉   ◉  ├╮  ",
  "  │╰────┬────╯│  ",
  "  │     ▽     │  ",
  "  ╰─┬───────┬─╯  ",
  "    │       │    ",
  "    ╰───────╯    ",
];

const SPOTIFY_ASCII = [
  " ╭──────────────╮",
  " │  ╭────────╮  │",
  " │  │ ♫ ♪ ♫  │  │",
  " │  ╰────────╯  │",
  " │ ▶ ━━━━━━━━━  │",
  " ╰──────────────╯",
];

function TerminalPane({
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-md border border-primary/20 bg-background/80 backdrop-blur-sm overflow-hidden ${className}`}
    >
      <div className="p-3 font-mono text-xs leading-relaxed">{children}</div>
    </div>
  );
}

function TypedLine({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) return;
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-300 ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(0.25rem)",
      }}
    >
      {children}
    </div>
  );
}

const LANG_ICONS: Record<string, { icon: string; color: string }> = {
  TypeScript: { icon: "TS", color: "text-blue-400" },
  JavaScript: { icon: "JS", color: "text-yellow-400" },
  Python: { icon: "PY", color: "text-blue-300" },
  Java: { icon: "JV", color: "text-orange-400" },
  Kotlin: { icon: "KT", color: "text-purple-400" },
  Go: { icon: "GO", color: "text-cyan-400" },
  Rust: { icon: "RS", color: "text-orange-300" },
  C: { icon: "C ", color: "text-blue-500" },
  "C++": { icon: "++", color: "text-blue-400" },
  "C#": { icon: "C#", color: "text-green-400" },
  Ruby: { icon: "RB", color: "text-red-400" },
  PHP: { icon: "HP", color: "text-indigo-300" },
  Swift: { icon: "SW", color: "text-orange-400" },
  Shell: { icon: "SH", color: "text-green-300" },
  Lua: { icon: "LU", color: "text-blue-600" },
  Dart: { icon: "DT", color: "text-cyan-300" },
  HTML: { icon: "<>", color: "text-orange-500" },
  CSS: { icon: "# ", color: "text-blue-500" },
  Vue: { icon: "VU", color: "text-green-500" },
  Svelte: { icon: "SV", color: "text-orange-600" },
};

function LangIcon({ lang }: { lang: string }) {
  const info = LANG_ICONS[lang];
  if (!info) {
    return (
      <span className="text-muted-foreground font-bold text-2xs w-4 inline-block">
        {lang.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return (
    <span className={`${info.color} font-bold text-2xs w-4 inline-block`}>
      {info.icon}
    </span>
  );
}

function BarChart({
  items,
  maxCount,
}: {
  items: { lang: string; count: number }[];
  maxCount: number;
}) {
  return (
    <div className="space-y-0.5 mt-1 w-full">
      {items.map(({ lang, count }) => {
        const pct = Math.max(5, Math.round((count / maxCount) * 100));
        return (
          <div key={lang} className="flex items-center gap-2 w-full">
            <LangIcon lang={lang} />
            <span className="text-muted-foreground w-20 shrink-0 truncate">
              {lang}
            </span>
            <div className="flex-1 h-3 bg-primary/5 rounded-sm overflow-hidden">
              <div
                className="h-full bg-primary/40 rounded-sm transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-muted-foreground/60 shrink-0 w-6 text-right">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ContributionGraph({
  contributions,
  total,
}: {
  contributions: ContributionDay[];
  total: number;
}) {
  const numWeeks = Math.ceil(contributions.length / 7);
  const weeks: (ContributionDay | null)[][] = Array.from(
    { length: numWeeks },
    () => Array(7).fill(null),
  );

  contributions.forEach((day) => {
    const dow = new Date(day.date + "T00:00:00").getDay();
    const daysSinceStart = Math.floor(
      (new Date(day.date + "T00:00:00").getTime() -
        new Date(contributions[0].date + "T00:00:00").getTime()) /
        86400000,
    );
    const weekIdx = Math.floor(daysSinceStart / 7);
    if (weekIdx >= 0 && weekIdx < numWeeks) {
      weeks[weekIdx][dow] = day;
    }
  });

  const levelChars = ["·", "░", "▒", "▓", "█"];
  const levelColors = [
    "text-muted-foreground/20",
    "text-green-600/40 dark:text-green-400/30",
    "text-green-600/60 dark:text-green-400/50",
    "text-green-600/80 dark:text-green-400/70",
    "text-green-600 dark:text-green-400",
  ];

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-primary font-semibold text-2xs">
          {total.toLocaleString()} contributions
        </span>
        <span className="text-muted-foreground/40 text-2xs">last year</span>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="flex w-full font-mono leading-none">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col flex-1 min-w-0">
              {week.map((day, di) => {
                const level = day?.level ?? 0;
                return (
                  <span
                    key={di}
                    className={`${levelColors[level]} text-3xs select-none text-center`}
                    title={
                      day
                        ? `${day.count} contributions on ${day.date}`
                        : undefined
                    }
                  >
                    {levelChars[level]}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CavaVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const [bars, setBars] = useState<number[]>(Array(16).fill(2));

  useEffect(() => {
    if (!isPlaying) {
      setBars(Array(16).fill(1));
      return;
    }
    const interval = setInterval(() => {
      setBars(
        Array(16)
          .fill(0)
          .map(() => Math.floor(Math.random() * 6) + 1),
      );
    }, 180);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const chars = ["▁", "▂", "▃", "▅", "▆", "█"];

  return (
    <div className="flex gap-0.5 items-end h-5 font-mono">
      {bars.map((level, i) => (
        <span
          key={i}
          className={isPlaying ? "text-green-400" : "text-muted-foreground/40"}
          style={{
            transition: "all 150ms ease",
          }}
        >
          {chars[Math.min(level - 1, chars.length - 1)]}
        </span>
      ))}
    </div>
  );
}

function GitHubPane() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setData(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxLangCount = data
    ? Math.max(...data.topLanguages.map((l) => l.count))
    : 1;

  return (
    <TerminalPane title="cat /proc/github">
      <div className="text-muted-foreground/50 mb-2">
        <span className="text-primary">$</span> cat /proc/github
      </div>
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="space-y-1">
            <span className="text-muted-foreground animate-pulse">
              Fetching from api.github.com...
            </span>
          </div>
        ) : !data ? (
          <span className="text-red-400">
            error: could not reach github api
          </span>
        ) : (
          <>
            <div className="flex gap-6 flex-col sm:flex-row">
              <div className="shrink-0 hidden sm:block">
                {GITHUB_ASCII.map((line, i) => (
                  <TypedLine key={i} delay={i * 60}>
                    <span className="text-primary/70 whitespace-pre text-2xs leading-tight">
                      {line}
                    </span>
                  </TypedLine>
                ))}
              </div>

              <div className="min-w-0 space-y-0.5">
                <TypedLine delay={80}>
                  <a
                    href={data.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-bold hover:underline"
                  >
                    {data.username}@github
                  </a>
                </TypedLine>
                <TypedLine delay={140}>
                  <span className="text-primary/30 text-2xs">
                    ─────────────────────
                  </span>
                </TypedLine>
                <TypedLine delay={200}>
                  <span className="text-primary font-semibold">Repos</span>
                  <span className="text-muted-foreground">
                    {" "}
                    {data.publicRepos}
                  </span>
                </TypedLine>
                <TypedLine delay={260}>
                  <span className="text-primary font-semibold">Stars</span>
                  <span className="text-muted-foreground">
                    {" "}
                    {data.totalStars}
                  </span>
                </TypedLine>
                <TypedLine delay={320}>
                  <span className="text-primary font-semibold">Followers</span>
                  <span className="text-muted-foreground">
                    {" "}
                    {data.followers}
                  </span>
                </TypedLine>
                <TypedLine delay={380}>
                  <span className="text-primary font-semibold">Following</span>
                  <span className="text-muted-foreground">
                    {" "}
                    {data.following}
                  </span>
                </TypedLine>
                <TypedLine delay={440}>
                  <span className="text-primary font-semibold">Since</span>
                  <span className="text-muted-foreground">
                    {" "}
                    {new Date(data.createdAt).getFullYear()}
                  </span>
                </TypedLine>
              </div>
            </div>
            {data.topLanguages.length > 0 && (
              <TypedLine delay={500} className="w-full">
                <div className="mt-2 pt-1 w-full border-t border-primary/10">
                  <BarChart items={data.topLanguages} maxCount={maxLangCount} />
                </div>
              </TypedLine>
            )}
            {data.contributions.length > 0 && (
              <TypedLine delay={600} className="w-full">
                <div className="mt-2 pt-2 w-full border-t border-primary/10">
                  <ContributionGraph
                    contributions={data.contributions}
                    total={data.totalContributions}
                  />
                </div>
              </TypedLine>
            )}
          </>
        )}
      </div>
    </TerminalPane>
  );
}

function SpotifyPane() {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSpotify = useCallback(() => {
    fetch("/api/spotify")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData({ isPlaying: false }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchSpotify();
    const interval = setInterval(fetchSpotify, 30000);
    return () => clearInterval(interval);
  }, [fetchSpotify]);

  const progressPct =
    data?.progressMs && data?.durationMs
      ? Math.round((data.progressMs / data.durationMs) * 100)
      : 0;

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  return (
    <TerminalPane title="cat /proc/spotify">
      <div className="text-muted-foreground/50 mb-2">
        <span className="text-primary">$</span> cat /proc/spotify
      </div>

      {loading ? (
        <span className="text-muted-foreground animate-pulse">
          Connecting to spotify daemon...
        </span>
      ) : !data?.title ? (
        <div className="flex gap-4 flex-col sm:flex-row items-start">
          <div className="shrink-0 hidden sm:block">
            {SPOTIFY_ASCII.map((line, i) => (
              <span
                key={i}
                className="text-muted-foreground/30 whitespace-pre text-2xs leading-tight block"
              >
                {line}
              </span>
            ))}
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground/50">
              {data?.notConfigured
                ? "spotify: daemon not configured"
                : "spotify: no track data available"}
            </span>
            <div className="text-muted-foreground/30 text-2xs">
              {data?.notConfigured
                ? "# set SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET,"
                : "# waiting for playback..."}
            </div>
            {data?.notConfigured && (
              <div className="text-muted-foreground/30 text-2xs">
                # SPOTIFY_REFRESH_TOKEN in .env
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-4 flex-col sm:flex-row items-start">
            <div className="shrink-0 hidden sm:block">
              {data.albumArt ? (
                <Image
                  src={data.albumArt}
                  alt={data.album ?? "Album art"}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded border border-primary/20 opacity-80"
                  unoptimized
                />
              ) : (
                SPOTIFY_ASCII.map((line, i) => (
                  <span
                    key={i}
                    className="text-green-400/60 whitespace-pre text-2xs leading-tight block"
                  >
                    {line}
                  </span>
                ))
              )}
            </div>

            <div className="min-w-0 space-y-0.5 flex-1">
              <div>
                <span className="text-primary font-semibold">
                  {data.isPlaying ? "▶" : "⏸"}
                </span>
                <span className="text-muted-foreground/50 ml-1">
                  {data.isPlaying ? "NOW PLAYING" : "LAST PLAYED"}
                </span>
              </div>
              <div>
                <span className="text-primary font-semibold">Track</span>
                <span className="text-muted-foreground"> </span>
                {data.songUrl ? (
                  <a
                    href={data.songUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary hover:underline transition-colors"
                  >
                    {data.title}
                  </a>
                ) : (
                  <span className="text-foreground">{data.title}</span>
                )}
              </div>
              <div>
                <span className="text-primary font-semibold">Artist</span>
                <span className="text-muted-foreground"> {data.artist}</span>
              </div>
              <div>
                <span className="text-primary font-semibold">Album</span>
                <span className="text-muted-foreground"> {data.album}</span>
              </div>

              {data.isPlaying && data.progressMs && data.durationMs && (
                <div className="pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground/50 text-2xs w-8">
                      {formatTime(data.progressMs)}
                    </span>
                    <div className="flex-1 flex items-center">
                      <div className="w-full bg-primary/10 h-1 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary/60 rounded-full transition-all duration-1000"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-muted-foreground/50 text-2xs w-8 text-right">
                      {formatTime(data.durationMs)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <CavaVisualizer isPlaying={data.isPlaying} />
        </div>
      )}
    </TerminalPane>
  );
}

type SendState = "idle" | "sending" | "success" | "error";
type VimMode = "normal" | "insert";

function ContactForm({ contact }: Props) {
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
      className="flex-1 rounded-md border border-primary/20 bg-background/80 backdrop-blur-sm overflow-hidden flex flex-col outline-none"
    >
      <div className="flex items-center justify-between px-3 py-1 border-b border-primary/15 bg-primary/[0.03]">
        <div className="flex items-center gap-3">
          <span className="text-primary text-2xs">VIM</span>
          <span className="text-muted-foreground/30 text-2xs">
            mail.tmp [+]
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground/30 text-2xs">
            {formData.message.length > 0
              ? `${messageLines.length}L, ${formData.message.length}C`
              : "0L, 0C"}
          </span>
          {sendState === "sending" && (
            <span className="text-yellow-400/80 text-2xs animate-pulse">
              SENDING
            </span>
          )}
          {sendState === "success" && (
            <span className="text-green-400/80 text-2xs">SENT</span>
          )}
          {sendState === "error" && (
            <span className="text-red-400/80 text-2xs">ERROR</span>
          )}
        </div>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col flex-1 font-mono text-xs"
      >
        <div className="border-b border-primary/10 px-3 py-2 space-y-1.5">
          <div className="flex items-center border-b border-primary/10 pb-1.5">
            <span className="text-yellow-600 dark:text-yellow-400/70 w-10 shrink-0">
              To:
            </span>
            <span className="text-muted-foreground">fhansteen@gmail.com</span>
          </div>
          <div className="flex items-center border-b border-primary/10 pb-1.5">
            <label
              htmlFor="contact-name"
              className="text-yellow-600 dark:text-yellow-400/70 w-10 shrink-0"
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
                className="flex-1 min-w-0 bg-transparent text-foreground outline-none font-mono text-base sm:text-xs
                  placeholder:text-muted-foreground/30 disabled:opacity-50"
                placeholder={contact.name}
                autoComplete="off"
              />
              {focusedField === "name" && (
                <span className="text-primary animate-pulse">█</span>
              )}
            </div>
          </div>
          <div className="flex items-center border-b border-primary/10 pb-1.5">
            <label
              htmlFor="contact-email"
              className="text-yellow-600 dark:text-yellow-400/70 w-10 shrink-0"
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
                className="flex-1 min-w-0 bg-transparent text-foreground outline-none font-mono text-base sm:text-xs
                  placeholder:text-muted-foreground/30 disabled:opacity-50"
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
              className="text-yellow-600 dark:text-yellow-400/70 w-10 shrink-0"
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
                className="flex-1 min-w-0 bg-transparent text-foreground outline-none font-mono text-base sm:text-xs
                  placeholder:text-muted-foreground/30 disabled:opacity-50"
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
            <div className="w-8 shrink-0 border-r border-primary/10 bg-primary/[0.02] flex flex-col items-end pt-2 pr-1 select-none">
              {(formData.message.length > 0 ? messageLines : [""]).map(
                (_, i) => (
                  <span
                    key={i}
                    className="text-2xs leading-editor text-yellow-600/40 dark:text-yellow-400/25"
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
                    className="text-2xs leading-editor text-blue-500/40 dark:text-blue-400/30"
                  >
                    ~
                  </span>
                ))}
              {formData.message.length === 0 &&
                Array.from({ length: 7 }).map((_, i) => (
                  <span
                    key={`tilde-${i}`}
                    className="text-2xs leading-editor text-blue-500/40 dark:text-blue-400/30"
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
                className="w-full h-full min-h-36 bg-transparent text-foreground outline-none font-mono text-base sm:text-xs
                  resize-none p-2 leading-editor placeholder:text-muted-foreground/30 disabled:opacity-50"
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
          <div className="border-t border-primary/10 bg-muted/50 dark:bg-black/20 px-3 py-2 max-h-32 overflow-y-auto">
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
                  <span className="text-muted-foreground/70">{line}</span>
                )}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        )}

        <div className="flex items-center justify-between px-3 py-1 border-t border-primary/15 bg-primary/[0.02]">
          <div className="flex-1 min-w-0">
            {showCmd ? (
              <div className="flex items-center text-xs">
                <span className="text-foreground">:</span>
                <span className="text-foreground">{cmdBuffer}</span>
                <span className="text-primary/60 animate-pulse">█</span>
              </div>
            ) : vimMode === "insert" ? (
              <span className="text-xs font-bold text-foreground">
                -- INSERT --
              </span>
            ) : sendState === "idle" ? (
              <span className="text-xs text-muted-foreground/40">
                Type <span className="text-primary/50">i</span> to edit,{" "}
                <span className="text-primary/50">:wq</span> to send
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground/30 text-2xs">
              {messageLines.length},
              {formData.message.length > 0
                ? (messageLines[messageLines.length - 1]?.length ?? 0) + 1
                : 0}
            </span>
            <button
              type="submit"
              disabled={isSending}
              className="font-mono text-2xs sm:text-xs px-3 py-0.5 rounded border border-primary/30
                text-primary hover:bg-primary/10 hover:border-primary/60
                active:bg-primary/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isSending ? contact.submitLoading : ":wq"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function genQueueId() {
  const chars = "0123456789ABCDEF";
  let id = "";
  for (let i = 0; i < 10; i++) id += chars[Math.floor(Math.random() * 16)];
  return id;
}

const Contact = ({ contact }: Props) => {
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
