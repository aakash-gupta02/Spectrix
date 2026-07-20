import DashboardButton from '@/components/ui/DashboardButton'
import RowActionsMenu from '@/components/common/RowActionsMenu'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import React from 'react'

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

const healthToneClasses = {
  healthy: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300',
  degraded: 'border-amber-500/35 bg-amber-500/10 text-amber-300',
  down: 'border-rose-500/35 bg-rose-500/10 text-rose-300',
  paused: 'border-slate-500/35 bg-slate-500/10 text-slate-300',
  unknown: 'border-border bg-white/5 text-body',
}

const formatNumber = (value, fallback = '-') => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return fallback
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(Number(value))
}

const EndpointTable = ({
  apis,
  isLoading,
  isError,
  errorMessage,
  hasActiveFilter,
  onEdit,
  onDelete,
  onMonitor,
}) => {
  return (
    <div className="overflow-hidden border border-dashed border-border bg-surface-1">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="text-sm uppercase tracking-[0.12em] text-heading">All apis</h2>
        <span className="text-[0.6875rem] text-body">{apis.length} total</span>
      </div>

      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-2 text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
            <th className="px-4 py-3 font-normal">API</th>
            <th className="px-4 py-3 font-normal">Method</th>
            <th className="px-4 py-3 font-normal">Uptime</th>
            <th className="px-4 py-3 font-normal">Avg latency</th>
            <th className="px-4 py-3 font-normal">Status</th>
            <th className="px-4 py-3 font-normal">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td className="px-4 py-6 text-body" colSpan={6}>
                Loading apis...
              </td>
            </tr>
          ) : null}

          {isError ? (
            <tr>
              <td className="px-4 py-6 text-red-300" colSpan={6}>
                {errorMessage || 'Could not load apis.'}
              </td>
            </tr>
          ) : null}

          {!isLoading && !isError && apis.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-body" colSpan={6}>
                {hasActiveFilter
                  ? 'No apis found for the selected service.'
                  : 'No apis yet. Create your first api above.'}
              </td>
            </tr>
          ) : null}

          {apis.map((api) => {
            const healthStatus = api?.metrics?.healthStatus || 'unknown'
            const serviceName = api?.service?.name || '-'

            return (
              <tr
                key={api._id || api.id || `${api.method}-${api.path}`}
                className="border-b border-border/60 last:border-b-0"
              >
                <td className="px-4 py-3">
                  <p className="truncate text-heading">{api.name || '-'}</p>
                  <p className="mt-1 truncate text-[0.6875rem] text-body">{serviceName}</p>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex border px-2 py-1 text-[0.6875rem] font-mono uppercase ${getMethodBadgeClass(api.method)}`}
                  >
                    {api.method || '-'}
                  </span>
                </td>

                <td className="px-4 py-3 text-heading">
                  {api?.metrics?.totalChecks
                    ? `${formatNumber(api.metrics.uptime)}%`
                    : '-'}
                </td>

                <td className="px-4 py-3 text-heading">
                  {api?.metrics?.totalChecks
                    ? `${formatNumber(api.metrics.avgLatency)} ms`
                    : '-'}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex border px-2 py-1 text-[0.6875rem] capitalize ${healthToneClasses[healthStatus] || healthToneClasses.unknown}`}
                  >
                    {healthStatus}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <DashboardButton
                      type="button"
                      variant="secondary"
                      className="hover:border-primary/40 hover:bg-primary-soft hover:text-primary"
                      onClick={() => onMonitor(api)}
                    >
                      <Eye size={13} />
                      Monitor
                    </DashboardButton>
                    <RowActionsMenu
                      actions={[
                        {
                          label: 'Edit',
                          icon: <Pencil size={14} />,
                          onClick: () => onEdit(api),
                        },
                        {
                          label: 'Delete',
                          icon: <Trash2 size={14} />,
                          variant: 'danger',
                          onClick: () => onDelete(api),
                        },
                      ]}
                    />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default EndpointTable
