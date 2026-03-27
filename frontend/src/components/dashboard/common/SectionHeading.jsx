import React from "react";

const baseButtonClassName =
    "rounded border px-3 py-1.5 text-[0.75rem] transition-colors";

const actionVariants = {
    secondary: `${baseButtonClassName} border-border text-body hover:bg-white/5`,
    primary:
        `${baseButtonClassName} border-primary/40 bg-primary-soft text-primary hover:bg-primary/20`,
};

const SectionHeading = ({ title, description, actions = [] }) => {
    const hasActions = actions.length > 0;

    return (
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="mb-1 text-3xl font-light tracking-tight text-heading sm:text-4xl">{title}</h1>
                <p className="text-xs text-body">{description}</p>
            </div>

            {hasActions ? (
                <div className="flex items-center gap-3">
                    {actions.map((action) => {
                        const {
                            label,
                            href,
                            type = "button",
                            variant = "secondary",
                            className = "",
                        } = action;

                        const variantClassName = actionVariants[variant] || actionVariants.secondary;
                        const classes = `${variantClassName} ${className}`.trim();

                        if (href) {
                            return (
                                <a key={label} href={href} className={classes}>
                                    {label}
                                </a>
                            );
                        }

                        return (
                            <button key={label} type={type} className={classes}>
                                {label}
                            </button>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
};

export default SectionHeading;