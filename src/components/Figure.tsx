import Image from "next/image";
import { hasMedia } from "@/lib/media";

type FigureProps = {
  /** File name inside public/media, e.g. "unf-campus.jpg". */
  file: string;
  alt: string;
  caption?: string;
  /** Shown in the placeholder so it's obvious what belongs here. */
  hint: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
};

export default function Figure({
  file,
  alt,
  caption,
  hint,
  width,
  height,
  priority,
  className = "",
}: FigureProps) {
  const present = hasMedia(file);

  return (
    <figure className={className}>
      <div className="relative overflow-hidden rounded-2xl border border-night-line bg-night-raised">
        {present ? (
          <Image
            src={`/media/${file}`}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            className="h-full w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center"
            style={{ aspectRatio: `${width} / ${height}` }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              className="text-night-line"
              aria-hidden
            >
              <rect
                x="2.5"
                y="4.5"
                width="19"
                height="15"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="8.5" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M3 17l5.2-4.6a2 2 0 012.7.05L21 21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <p className="font-[family-name:var(--font-mono)] text-[11px] text-night-soft">
              {hint}
            </p>
            <p className="font-[family-name:var(--font-mono)] text-[10px] text-night-soft/50">
              public/media/{file}
            </p>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-[13px] leading-relaxed text-night-soft">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
