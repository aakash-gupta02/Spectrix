import React from 'react'

const SectionHeading = ({ eyebrow, title, description, buttonTxt }) => {
    return (
        <div className="relative mb-16">
            <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                    <div className="mb-4 flex items-center gap-3">
                        <span className="text-xs font-medium uppercase tracking-widest text-primary">
                            {eyebrow || "01. Features"}
                        </span>
                    </div>

                    <h2 className="mb-4 text-4xl leading-[1.1] font-light tracking-tighter text-white md:text-5xl lg:text-6xl">
                        {title || "Comprehensive API observability."}
                    </h2>

                    <p className="max-w-md text-lg text-white/70">
                        {description || "From single endpoints to complex microservices, we provide the tools to ensure continuous reliability."}
                    </p>
                </div>

                <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <button className="w-full bg-white px-6 py-3 text-center font-normal text-black transition-colors hover:bg-slate-200 sm:w-auto">
                        {buttonTxt || "View Features"}
                    </button>
                </div>
            </div>

            <div className="mt-12 h-px w-full bg-linear-to-r from-slate-800 via-slate-700 to-transparent" />
        </div>
    )
}

export default SectionHeading