export function DocsPageHeader({ title, description }) {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl mb-4">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-body">
            {description}
          </p>
        )}
      </div>

      <div className="my-10 border-t border-dashed border-border" />
    </>
  );
}
