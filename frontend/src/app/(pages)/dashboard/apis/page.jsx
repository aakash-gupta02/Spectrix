"use client"

import Container from '@/components/dashboard/common/Container'
import SectionHeading from '@/components/dashboard/common/SectionHeading'
import { endPointsAPI } from '@/lib/api/api'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import DashboardButton from '@/components/ui/DashboardButton'
import LocalServiceFilterDropdown from '@/components/dashboard/layout/LocalServiceFilterDropdown'
import CreateEndpointModal from './_components/CreateEndpointModal'
import EditEndpointPanel from './_components/EditEndpointPanel'
import DeleteEndpointModal from './_components/DeleteEndpointModal'
import EndpointTable from './_components/EndpointTable'
import useServiceFiltering from '@/hooks/useServiceFiltering'

const APIsPage = () => {
    const [successMessage, setSuccessMessage] = useState('')
    const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false)
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedApi, setSelectedApi] = useState(null)
    const {
        localServiceId,
        activeServiceFilter,
        setLocalFilter
    } = useServiceFiltering()

    const endpointQuery = useQuery({
        queryKey: ['apis', { serviceId: activeServiceFilter || 'all' }],
        queryFn: () => endPointsAPI.getEndPoints({ serviceId: activeServiceFilter })
    })

    const apis = useMemo(() => endpointQuery.data?.endpoints?.endpoints || [], [endpointQuery.data])

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
                    value={localServiceId}
                    onChange={setLocalFilter}
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

            <EndpointTable
                apis={apis}
                isLoading={endpointQuery.isLoading}
                isError={endpointQuery.isError}
                errorMessage={endpointQuery.error?.response?.data?.message}
                hasActiveFilter={Boolean(activeServiceFilter)}
                onEdit={(api) => {
                    setSelectedApi(api)
                    setIsCreatePanelOpen(false)
                    setIsEditPanelOpen(true)
                }}
                onDelete={(api) => {
                    setSelectedApi(api)
                    setIsCreatePanelOpen(false)
                    setIsEditPanelOpen(false)
                    setIsDeleteModalOpen(true)
                }}
            />


        </Container>
    )
}

export default APIsPage