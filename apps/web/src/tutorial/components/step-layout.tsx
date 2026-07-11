"use client";

interface Props {
  command: string;
  title: string;
  body: string;
  children: React.ReactNode;
}

export function StepLayout({ command, title, body, children }: Props) {
  return (
    <div>
      <div className="mb-3 flex w-full items-center justify-start gap-1.5 border-primary-hint border-b px-4 py-1 font-mono text-faded text-xs md:px-6">
        <span className="text-primary">$</span>
        <span>{command}</span>
      </div>
      <article className="px-4 md:px-6">
        <h2 className="mb-1 font-bold text-lg text-primary">{title}</h2>
        <p className="mb-4 text-readable text-sm">{body}</p>
        {children}
      </article>
    </div>
  );
}
