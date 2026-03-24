import React from "react";
import {
    AlertTriangle,
    Cloud,
    Code2,
    Cpu,
    Database,
    Monitor,
    Network,
    Server,
    ShieldAlert,
    ShieldCheck,
} from "lucide-react";
import SectionHeading from "../common/SectionHeading";

export default function Capabilities() {
    return (
        <section className="border-b border-dashed border-white/10 bg-page py-24">
            <div className="mx-auto max-w-7xl px-6">

                <SectionHeading
                    eyebrow="02. Capabilities"
                    title="Precision in every request."
                    description="Trusted by engineering teams. We combine high-frequency polling with advanced anomaly analytics."
                />

                <section className="relative z-10 border-b border-dashed border-white/10 bg-page">
                    <div className="grid grid-cols-1 border-b border-dashed border-white/10 md:grid-cols-12">
                        <div className="group relative col-span-12 h-90 overflow-hidden border-b border-dashed border-white/10 md:col-span-4 md:border-b-0 md:border-r">
                            <div className="absolute inset-0 flex -translate-y-16 items-center justify-center opacity-80">
                                <div className="absolute h-70 w-70 rounded-full border border-white/5" />
                                <div className="absolute h-50 w-50 rounded-full border border-white/5" />
                                <div className="absolute h-30 w-30 rounded-full border border-white/5" />

                                <div className="absolute h-70 w-70 animate-[spin_4s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg_240deg,rgba(198,249,31,0.2)_360deg)]" />

                                <div className="absolute left-10 top-10 z-10 flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_#c6f91f]" />
                                    <span className="text-[10px] font-normal uppercase tracking-widest text-primary">
                                        Traffic Scan Active
                                    </span>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-page via-page/80 to-transparent p-8 pt-20">
                                <h3 className="mb-2 text-lg font-normal text-white">ANOMALY DETECTION</h3>
                                <p className="pr-4 text-xs leading-relaxed text-white/70">
                                    Continuous surveillance of traffic patterns to detect latency spikes and errors
                                    instantly.
                                </p>
                            </div>
                        </div>

                        <div className="col-span-12 flex h-90 flex-col border-b border-dashed border-white/10 p-8 md:col-span-4 md:border-b-0 md:border-r">
                            <div className="mb-6">
                                <h3 className="mb-2 text-lg font-normal text-white">REAL-TIME ALERTS</h3>
                                <p className="text-xs leading-relaxed text-white/70">
                                    Stay updated with instant notifications via Slack, PagerDuty, or custom Webhooks.
                                </p>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="group cursor-pointer">
                                    <div className="mb-2 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-7 w-7 items-center justify-center rounded border border-primary/20 bg-primary/10 text-primary">
                                                <AlertTriangle size={14} strokeWidth={1.5} />
                                            </div>
                                            <span className="text-[10px] font-medium uppercase tracking-wide text-primary">
                                                Latency Spike (auth/login)
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-600">NOW</span>
                                    </div>
                                    <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/5">
                                        <div className="h-full w-2/3 bg-primary shadow-[0_0_10px_#c6f91f]" />
                                    </div>
                                </div>

                                <div className="group cursor-pointer">
                                    <div className="mb-2 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-7 w-7 items-center justify-center rounded border border-white/10 bg-white/5 text-slate-500 transition-colors group-hover:border-white/20 group-hover:text-white">
                                                <Server size={14} strokeWidth={1.5} />
                                            </div>
                                            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500 transition-colors group-hover:text-white">
                                                Endpoint Down (api/v1)
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-600">2M AGO</span>
                                    </div>
                                    <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/5">
                                        <div className="h-full w-1/2 bg-slate-700 transition-colors group-hover:bg-slate-500" />
                                    </div>
                                </div>

                                <div className="group cursor-pointer">
                                    <div className="mb-2 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-7 w-7 items-center justify-center rounded border border-white/10 bg-white/5 text-slate-500 transition-colors group-hover:border-white/20 group-hover:text-white">
                                                <ShieldAlert size={14} strokeWidth={1.5} />
                                            </div>
                                            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500 transition-colors group-hover:text-white">
                                                SSL Cert Expiring
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-600">1D AGO</span>
                                    </div>
                                    <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/5">
                                        <div className="h-full w-1/4 bg-slate-700 transition-colors group-hover:bg-slate-500" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative col-span-12 h-90 bg-page md:col-span-4">
                            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 divide-x divide-y divide-white/5 border-b border-white/5">
                                <div className="bg-white/1" />
                                <div className="bg-white/1" />
                                <div className="flex items-center justify-center bg-white/1">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-600">
                                        <Code2 size={18} strokeWidth={1.5} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-center bg-white/1">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-600">
                                        <Database size={18} strokeWidth={1.5} />
                                    </div>
                                </div>

                                <div className="bg-white/1" />
                                <div className="flex items-center justify-center bg-white/1">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-600">
                                        <Cloud size={18} strokeWidth={1.5} />
                                    </div>
                                </div>
                                <div className="relative flex items-center justify-center">
                                    <div className="absolute inset-0 bg-primary/20 blur-[30px]" />
                                    <div className="relative z-10 text-primary">
                                        <Network size={48} strokeWidth={1.5} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-center bg-white/1">
                                    <div className="flex h-10 w-10 items-center justify-center rounded bg-[#15191E] text-[8px] font-medium tracking-wider text-slate-600">
                                        NODES
                                    </div>
                                </div>

                                <div className="flex items-center justify-center bg-white/1">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-600">
                                        <Cpu size={18} strokeWidth={1.5} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-center bg-white/1">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-600">
                                        <Monitor size={18} strokeWidth={1.5} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-center bg-white/1">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-600">
                                        <ShieldCheck size={18} strokeWidth={1.5} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-center bg-white/1" />

                                <div className="flex items-center justify-center bg-white/1" />
                                <div className="bg-white/1" />
                                <div className="flex items-center justify-center bg-white/1" />
                                <div className="flex items-center justify-center bg-white/1" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12">
                        <div className="relative col-span-12 overflow-hidden border-b border-dashed border-white/10 px-8 pb-8 pt-16 md:col-span-8 md:border-b-0 md:border-r">
                            <div className="pointer-events-none absolute bottom-0 right-0 flex h-full w-full items-end justify-end gap-px pr-8 opacity-100">
                                <div className="h-[20%] w-24 border-t border-l border-r border-dashed border-white/10 bg-white/2" />
                                <div className="h-[40%] w-24 border-t border-l border-r border-dashed border-white/10 bg-white/2" />
                                <div className="h-[60%] w-24 border-t border-l border-r border-dashed border-white/10 bg-white/2" />
                                <div className="relative h-[80%] w-24 border-t border-l border-r border-dashed border-primary/30 bg-primary/5">
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-primary">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            stroke="none"
                                        >
                                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 mt-12">
                                <div className="mb-2 text-[64px] leading-none tracking-tighter text-primary">50B+</div>
                                <h3 className="mb-2 text-lg font-normal uppercase tracking-wide text-white">
                                    Requests Processed Daily
                                </h3>
                                <p className="max-w-md text-sm leading-relaxed text-white/70">
                                    Empowering engineering teams worldwide. We monitor diverse architectures designed
                                    for high availability.
                                </p>
                            </div>
                        </div>

                        <div className="col-span-12 flex h-full min-h-75 flex-col justify-end p-8 pt-16 md:col-span-4">
                            <div className="mt-auto">
                                <h3 className="mb-2 text-lg font-normal uppercase tracking-wide text-white">
                                    Global Edge Network
                                </h3>
                                <p className="text-sm leading-relaxed text-white/70">
                                    Our testing nodes operate in major server hubs globally, ensuring accurate
                                    latency tracking from your users&apos; perspective.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );
}
