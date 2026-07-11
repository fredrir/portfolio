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
      <div className="border-primary-hint flex items-center px-4 md:px-6 border-b w-full justify-start py-1 gap-1.5 mb-3 font-mono text-xs text-faded">
        <span className="text-primary">$</span>
        <span>{command}</span>
      </div>
      <article className="px-4 md:px-6">
        <h2 className="text-lg font-bold text-primary mb-1">{title}</h2>
        <p className="text-sm text-readable mb-4">{body}</p>
        {children}
      </article>
    </div>
  );
}
