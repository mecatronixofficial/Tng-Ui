import { cn } from "@/utils";

interface Props {
  text: string;
  className?: string;
  paragraphClassName?: string;
}

export default function RichParagraphs({
  text,
  className,
  paragraphClassName,
}: Props) {
  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className={cn("space-y-3", className)}>
      {paragraphs.map((para, i) => (
        <p key={i} className={paragraphClassName}>
          {para.trim()}
        </p>
      ))}
    </div>
  );
}
