import React from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import DashboardButton from '@/components/ui/DashboardButton';
import { formatDate } from '../page';
import RowActionsMenu from '@/components/common/RowActionsMenu';
import { useAuth } from '@/contexts/AuthContext';

const ServiceTable = ({ services, servicesQuery, onEdit, onDelete }) => {
    return (
        <div className="overflow-hidden border border-dashed border-border bg-surface-1">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <h2 className="text-sm uppercase tracking-[0.12em] text-heading">All Services</h2>
                <span className="text-[0.6875rem] text-body">{services.length} total</span>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-border bg-surface-2 text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                            <th className="px-4 py-3 font-normal">Name</th>
                            <th className="px-4 py-3 font-normal">Base URL</th>
                            <th className="px-4 py-3 font-normal">Environment</th>
                            <th className="px-4 py-3 font-normal">Status</th>
                            <th className="px-4 py-3 font-normal">Created</th>
                            <th className="px-4 py-3 font-normal">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {servicesQuery.isLoading ? (
                            <tr>
                                <td className="px-4 py-6 text-body" colSpan={6}>
                                    Loading services...
                                </td>
                            </tr>
                        ) : null}

                        {servicesQuery.isError ? (
                            <tr>
                                <td className="px-4 py-6 text-red-300" colSpan={6}>
                                    {servicesQuery.error?.response?.data?.message ||
                                        "Could not load services."}
                                </td>
                            </tr>
                        ) : null}

                        {/* No Services Data Message */}
                        {!servicesQuery.isLoading && !servicesQuery.isError && services.length === 0 ? (
                            <tr>
                                <td className="px-4 py-6 text-body" colSpan={6}>
                                    No services yet. Create your first service above.
                                </td>
                            </tr>
                        ) : null}

                        {/* Service Rows */}
                        {services.map((service) => (
                            <tr key={service._id || service.id || service.baseUrl} className="border-b border-border/60 last:border-b-0">

                                {/* Service Name and Description */}
                                <td className="px-4 py-3 text-heading">
                                    <p>{service.name || "-"}</p>
                                    <p className="mt-1 text-xs text-body">{service.description || "No description"}</p>
                                </td>

                                {/* Base URL */}
                                <td className="px-4 py-3 font-mono text-xs text-body-strong">{service.baseUrl || "-"}</td>

                                {/* Environment */}
                                <td className="px-4 py-3 capitalize text-body">{service.environment || "-"}</td>

                                {/* Active Status */}
                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-flex rounded border px-2 py-1 text-[0.6875rem] ${service.active
                                            ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-300"
                                            : "border-rose-500/35 bg-rose-500/10 text-rose-300"
                                            }`}
                                    >
                                        {service.active ? "Active" : "Inactive"}
                                    </span>
                                </td>

                                {/* Date */}
                                <td className="px-4 py-3 text-body">{formatDate(service.createdAt)}</td>

                                {/* Actions */}
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {/* Monitor Button */}
                                        <DashboardButton
                                            type="button"
                                            variant="secondary"
                                            className="hover:border-primary/40 hover:bg-primary-soft hover:text-primary"
                                        >
                                            <Eye size={13} />
                                            Monitor
                                        </DashboardButton>

                                        {/* Row Actions Menu - edit & delete */}
                                        <RowActionsMenu
                                            actions={[
                                                {
                                                    label: 'Edit',
                                                    icon: <Pencil size={14} />,
                                                    onClick: () => onEdit(service),
                                                },
                                                {
                                                    label: 'Delete',
                                                    icon: <Trash2 size={14} />,
                                                    variant: 'danger',
                                                    onClick: () => onDelete(service),
                                                },
                                            ]}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>)
}

export default ServiceTable;