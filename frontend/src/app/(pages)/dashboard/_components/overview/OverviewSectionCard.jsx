export default function OverviewSectionCard({ title, description, className = "", children }) {
    return (
        <section className={`rounded-lg border border-dashed border-border bg-page p-4 ${className}`.trim()}>
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-sm text-heading">{title}</h2>
                    {description ? <p className="mt-1 text-[0.6875rem] text-body">{description}</p> : null}
                </div>
            </div>

            {children}
        </section>
    );
}