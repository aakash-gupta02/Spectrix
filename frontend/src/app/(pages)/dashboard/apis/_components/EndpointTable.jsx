import DashboardButton from '@/components/ui/DashboardButton'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import React from 'react'
import { formatDate } from '../../services/page'

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

const EndpointTable = ({
  apis,
  isLoading,
  isError,
  errorMessage,
  hasActiveFilter,
  onEdit,
  onDelete
}) => {
  return (
    <div className="overflow-hidden border border-dashed border-border bg-surface-1">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="text-sm uppercase tracking-[0.12em] text-heading">All apis</h2>
        <span className="text-[0.6875rem] text-body">{apis.length} total</span>
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
            {isLoading ? (
              <tr>
                <td className="px-4 py-6 text-body" colSpan={7}>
                  Loading apis...
                </td>
              </tr>
            ) : null}

            {isError ? (
              <tr>
                <td className="px-4 py-6 text-red-300" colSpan={7}>
                  {errorMessage || 'Could not load apis.'}
                </td>
              </tr>
            ) : null}

            {!isLoading && !isError && apis.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-body" colSpan={7}>
                  {hasActiveFilter
                    ? 'No apis found for the selected service.'
                    : 'No apis yet. Create your first api above.'}
                </td>
              </tr>
            ) : null}

            {apis.map((api) => (
              <tr key={api._id || api.id || `${api.method}-${api.path}`} className="border-b border-border/60 last:border-b-0">
                <td className="px-4 py-3 text-heading">
                  <p>{api.name || '-'}</p>
                </td>

                <td className="px-4 py-3">
                  <span className={`inline-flex rounded border px-2 py-1 text-[0.6875rem] font-mono uppercase ${getMethodBadgeClass(api.method)}`}>
                    {api.method || '-'}
                  </span>
                </td>

                <td className="px-4 py-3 font-mono text-xs text-body">{api.path || '-'}</td>

                <td className="px-4 py-3 text-body">{Array.isArray(api.expectedStatus) ? api.expectedStatus.join(', ') : '-'}</td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded border px-2 py-1 text-[0.6875rem] ${api.active
                      ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300'
                      : 'border-rose-500/35 bg-rose-500/10 text-rose-300'
                      }`}
                  >
                    {api.active ? 'Active' : 'Inactive'}
                  </span>
                </td>

                <td className="px-4 py-3 text-body">{formatDate(api.createdAt)}</td>

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
                      onClick={() => onEdit(api)}
                    >
                      <Pencil size={13} />
                    </DashboardButton>
                    <DashboardButton
                      type="button"
                      variant="secondary"
                      className="hover:border-primary/40 hover:bg-primary-soft hover:text-primary"
                      onClick={() => onDelete(api)}
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
  )
}

export default EndpointTable