export function StepSection({ steps = [] }) {
  return (
    <div className="space-y-8 my-8 relative">
      <div className="absolute left-[15px] top-4 bottom-4 w-px bg-border-strong -z-10" />
      {steps.map((step, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-border bg-page text-primary text-sm font-semibold">
            {index + 1}
          </div>
          <div className="pt-1">
            <h3 className="text-lg font-medium text-heading mb-2">{step.title}</h3>
            <div className="text-body leading-relaxed">{step.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
