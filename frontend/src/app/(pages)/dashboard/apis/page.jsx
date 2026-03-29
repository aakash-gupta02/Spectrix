"use client"

import Container from '@/components/dashboard/common/Container'
import SectionHeading from '@/components/dashboard/common/SectionHeading'
import { endPointsAPI } from '@/lib/api/api'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo, useState } from 'react'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { formatDate } from '../services/page'
import DashboardButton from '@/components/ui/DashboardButton'
import LocalServiceFilterDropdown from '@/components/dashboard/layout/LocalServiceFilterDropdown'
import CreateEndpointModal from './_components/CreateEndpointModal'
import EditEndpointPanel from './_components/EditEndpointPanel'
import DeleteEndpointModal from './_components/DeleteEndpointModal'

const APIsPage = () => {
    const [successMessage, setSuccessMessage] = useState('')
    const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false)
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedApi, setSelectedApi] = useState(null)
    const [selectedServiceFilter, setSelectedServiceFilter] = useState('all')

    const endpointQuery = useQuery({
        queryKey: ['apis'],
        queryFn: endPointsAPI.getEndPoints
    })

    const apis = useMemo(() => endpointQuery.data?.endpoints?.endpoints || [], [endpointQuery.data])
    const filteredApis = useMemo(() => {
        if (selectedServiceFilter === 'all') {
            return apis
        }

        return apis.filter((api) => api.serviceId === selectedServiceFilter)
    }, [apis, selectedServiceFilter])

    const getMethodBadgeClass = (method) => {
        switch ((method || '').toUpperCase()) {
            case 'GET':
                return 'border-sky-500/35 bg-sky-500/10 text-sky-300'
            case 'POST':
                return 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300'
            case 'PUT':
                return 'border-amber-500/35 bg-amber-500/10 text-amber-300'
            case 'PATCH':
                return 'border-violet-500/35 bg-violet-500/10 text-violet-300'
            case 'DELETE':
                return 'border-rose-500/35 bg-rose-500/10 text-rose-300'
            default:
                return 'border-slate-500/35 bg-slate-500/10 text-slate-300'
        }
    }

    return (
        <Container>
            <SectionHeading
                title="APIs"
                description="Manage your API endpoints and configurations."
            >
                <LocalServiceFilterDropdown
                    value={selectedServiceFilter}
                    onChange={setSelectedServiceFilter}
                    allOptionLabel="All Services"
                />

                <DashboardButton
                    variant="primary"
                    onClick={() => {
                        setSuccessMessage('')
                        setIsCreatePanelOpen((prev) => !prev)
                    }}
                >
                    <Plus size={14} />
                    {isCreatePanelOpen ? 'Close form' : 'New API'}
                </DashboardButton>
            </SectionHeading>

            <CreateEndpointModal
                isOpen={isCreatePanelOpen}
                onClose={() => setIsCreatePanelOpen(false)}
                onCreated={(message) => {
                    setSuccessMessage(message)
                    setIsCreatePanelOpen(false)
                }}
            />

            <EditEndpointPanel
                isOpen={isEditPanelOpen}
                endpoint={selectedApi}
                onClose={() => {
                    setIsEditPanelOpen(false)
                    setSelectedApi(null)
                }}
                onUpdated={(message) => {
                    setSuccessMessage(message)
                    setIsEditPanelOpen(false)
                    setSelectedApi(null)
                }}
            />

            <DeleteEndpointModal
                isOpen={isDeleteModalOpen}
                endpoint={selectedApi}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setSelectedApi(null)
                }}
                onDeleted={(message) => {
                    setSuccessMessage(message)
                    setIsDeleteModalOpen(false)
                    setSelectedApi(null)
                }}
            />

            {successMessage ? (
                <div className="mb-6 border border-primary/40 bg-primary-soft px-3 py-2 text-sm text-primary">
                    {successMessage}
                </div>
            ) : null}

            <div className="overflow-hidden border border-dashed border-border bg-surface-1">
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                    <h2 className="text-sm uppercase tracking-[0.12em] text-heading">All apis</h2>
                    <span className="text-[0.6875rem] text-body">{filteredApis.length} total</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-border bg-surface-2 text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                                <th className="px-4 py-3 font-normal">Name</th>
                                <th className="px-4 py-3 font-normal">Method</th>
                                <th className="px-4 py-3 font-normal">Path</th>
                                <th className="px-4 py-3 font-normal">Expected</th>
                                <th className="px-4 py-3 font-normal">Status</th>
                                <th className="px-4 py-3 font-normal">Created</th>
                                <th className="px-4 py-3 font-normal">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {endpointQuery.isLoading ? (
                                <tr>
                                    <td className="px-4 py-6 text-body" colSpan={7}>
                                        Loading apis...
                                    </td>
                                </tr>
                            ) : null}

                            {endpointQuery.isError ? (
                                <tr>
                                    <td className="px-4 py-6 text-red-300" colSpan={7}>
                                        {endpointQuery.error?.response?.data?.message ||
                                            "Could not load apis."}
                                    </td>
                                </tr>
                            ) : null}

                            {/* No apis Data Message */}
                            {!endpointQuery.isLoading && !endpointQuery.isError && filteredApis.length === 0 ? (
                                <tr>
                                    <td className="px-4 py-6 text-body" colSpan={7}>
                                        {selectedServiceFilter === 'all'
                                            ? 'No apis yet. Create your first api above.'
                                            : 'No apis found for the selected service.'}
                                    </td>
                                </tr>
                            ) : null}

                            {/* api Rows */}
                            {filteredApis.map((api) => (
                                <tr key={api._id || api.id || `${api.method}-${api.path}`} className="border-b border-border/60 last:border-b-0">

                                    {/* api Name and Description */}
                                    <td className="px-4 py-3 text-heading">
                                        <p>{api.name || "-"}</p>
                                    </td>

                                    {/* Method */}
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex rounded border px-2 py-1 text-[0.6875rem] font-mono uppercase ${getMethodBadgeClass(api.method)}`}>
                                            {api.method || '-'}
                                        </span>
                                    </td>

                                    {/* Path */}
                                    <td className="px-4 py-3 font-mono text-xs text-body">{api.path || "-"}</td>

                                    {/* Expected Status */}
                                    <td className="px-4 py-3 text-body">{Array.isArray(api.expectedStatus) ? api.expectedStatus.join(", ") : "-"}</td>

                                    {/* Active Status */}
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex rounded border px-2 py-1 text-[0.6875rem] ${api.active
                                                ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-300"
                                                : "border-rose-500/35 bg-rose-500/10 text-rose-300"
                                                }`}
                                        >
                                            {api.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    {/* Date */}
                                    <td className="px-4 py-3 text-body">{formatDate(api.createdAt)}</td>

                                    {/* Actions */}
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <DashboardButton
                                                type="button"
                                                variant="secondary"
                                                className="hover:border-primary/40 hover:bg-primary-soft hover:text-primary"
                                            >
                                                <Eye size={13} />
                                                Monitor
                                            </DashboardButton>
                                            <DashboardButton
                                                type="button"
                                                variant="secondary"
                                                className="hover:border-primary/40 hover:bg-primary-soft hover:text-primary"
                                                onClick={() => {
                                                    setSelectedApi(api)
                                                    setIsCreatePanelOpen(false)
                                                    setIsEditPanelOpen(true)
                                                }}
                                            >
                                                <Pencil size={13} />

                                            </DashboardButton>
                                            <DashboardButton
                                                type="button"
                                                variant="secondary"
                                                className="hover:border-primary/40 hover:bg-primary-soft hover:text-primary"
                                                onClick={() => {
                                                    setSelectedApi(api)
                                                    setIsCreatePanelOpen(false)
                                                    setIsEditPanelOpen(false)
                                                    setIsDeleteModalOpen(true)
                                                }}
                                            >
                                                <Trash2 size={13} />
                                            </DashboardButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


        </Container>
    )
}

export default APIsPage