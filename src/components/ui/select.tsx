import * as React from "react";

import { cn } from "../../lib/utils";

function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      data-slot="select"
      className={cn(
        "flex h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition-colors",
        "focus-visible:border-[#5e54b8] focus-visible:ring-4 focus-visible:ring-[#5e54b8]/10",
        className
      )}
      {...props}
    />
  );
}

export { Select };
