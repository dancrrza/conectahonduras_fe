"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function EventsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const all = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = all.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1,
  );

  return (
    <div className="flex items-center justify-center gap-1.5 pt-10">
      <PageBtn
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </PageBtn>

      {visible.map((p, i) => {
        const prev = visible[i - 1];
        const showEllipsis = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-1.5">
            {showEllipsis && (
              <span className="w-9 h-9 flex items-center justify-center text-muted-foreground text-xs tracking-widest">
                ···
              </span>
            )}
            <PageBtn
              active={p === currentPage}
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
            >
              {p}
            </PageBtn>
          </span>
        );
      })}

      <PageBtn
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </PageBtn>
    </div>
  );
}

function PageBtn({
  active,
  children,
  ...props
}: {
  active?: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "w-9 h-9 rounded-xl text-xs font-medium flex items-center justify-center border transition-all",
        active
          ? "bg-primary/10 border-primary/30 text-primary"
          : "bg-background border-border text-muted-foreground hover:text-foreground hover:bg-muted hover:border-input",
        "disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-background disabled:hover:text-muted-foreground",
      )}
    >
      {children}
    </button>
  );
}
