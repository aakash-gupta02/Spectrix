import React from "react";
import Link from "next/link";
import { Info } from "lucide-react";

const SectionHeading = ({ title, description, children, docLink }) => {
  const hasActions = Boolean(children);

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-3xl font-light tracking-tight text-heading sm:text-4xl">
            {title}
          </h1>
          {docLink && (
            <Link
              href={docLink}
              target="_blank"
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
              title="View documentation"
            >
              <Info className="h-4 w-4" />
            </Link>
          )}
        </div>
        <p className="text-xs text-body">{description}</p>
      </div>

      {hasActions ? (
        <div className="flex items-center gap-3">{children}</div>
      ) : null}
    </div>
  );
};

export default SectionHeading;
