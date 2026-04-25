"use client"
import Container from '@/components/dashboard/common/Container'
import SectionHeading from '@/components/dashboard/common/SectionHeading'
import LocalServiceFilterDropdown from '@/components/dashboard/layout/LocalServiceFilterDropdown'
import useServiceFiltering from '@/hooks/useServiceFiltering'
import { incidentAPI } from '@/lib/api/api'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import IncidentTable from './_components/IncidentTable'

const Page = () => {

    const {
        localServiceId,
        activeServiceFilter,
        setLocalFilter
    } = useServiceFiltering()

    const incidentQuery = useQuery({
        queryKey: ['incidents', activeServiceFilter],
        queryFn: async () => {
            return incidentAPI.getIncidents({ serviceId: activeServiceFilter });
        }
    });

    const incidents = useMemo(() => incidentQuery.data?.incidents?.incidents || [], [incidentQuery.data])


    return (
        <Container>
            <SectionHeading
                title="Incidents"
                description="Track ongoing and historical outages across APIs."
            >
                <LocalServiceFilterDropdown
                    value={localServiceId}
                    onChange={setLocalFilter}
                    allOptionLabel="All Services"
                />
            </SectionHeading>

            <IncidentTable 
                incidents={incidents}
                incidentsQuery={incidentQuery}
            />
        </Container>
    )
}

export default Page