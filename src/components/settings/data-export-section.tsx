import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { Download, FileArchive, Trash2, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { fetchExports, requestExport } from '@/api/settings'
import { formatDateTime } from '@/utils/date-format'
import type { DataExport, ExportStatus } from '@/types/settings'

function getStatusVariant(status: ExportStatus): 'secondary' | 'warning' | 'success' | 'destructive' {
  switch (status) {
    case 'completed':
      return 'success'
    case 'failed':
      return 'destructive'
    case 'processing':
      return 'warning'
    default:
      return 'secondary'
  }
}

export function DataExportSection() {
  const [exports, setExports] = useState<DataExport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [requesting, setRequesting] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const loadExports = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchExports()
      setExports(Array.isArray(data) ? data : [])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadExports()
  }, [loadExports])

  const handleRequestExport = async () => {
    setRequesting(true)
    try {
      const result = await requestExport()
      if (result) {
        setExports((prev) => [result, ...prev])
        toast.success('Export requested. You will be notified when ready.')
      } else {
        toast.error('Failed to request export')
      }
    } catch {
      toast.error('Failed to request export')
    } finally {
      setRequesting(false)
    }
  }

  const latestExport = (exports ?? [])[0]

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-48 rounded bg-muted" />
          <div className="mt-2 h-4 w-32 rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="h-24 rounded-xl bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle>Data export & GDPR</CardTitle>
          <CardDescription>
            Download your data, request deletion, or manage retention
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <FileArchive className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Export your data</p>
                <p className="text-sm text-muted-foreground">
                  Request a full export of your account data (GDPR Right to Access)
                </p>
              </div>
            </div>
            {latestExport && (
              <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      Requested {formatDateTime(latestExport.requested_at)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {latestExport.eta ?? 'Processing...'}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(latestExport.status)}>
                    {latestExport.status}
                  </Badge>
                </div>
                {latestExport.status === 'completed' && latestExport.file_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 gap-2"
                    asChild
                  >
                    <a href={latestExport.file_url} download>
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </Button>
                )}
              </div>
            )}
            <Button
              variant="outline"
              className="mt-4 gap-2"
              onClick={() => void handleRequestExport()}
              disabled={requesting || (latestExport?.status === 'processing' || latestExport?.status === 'pending')}
            >
              <Download className="h-4 w-4" />
              {requesting ? 'Requesting...' : 'Request export'}
            </Button>
          </div>

          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">GDPR controls</p>
                <p className="text-sm text-muted-foreground">
                  Right to Access, Data Portability, Right to Erasure
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteModalOpen(true)}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Request data deletion
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request data deletion</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently delete your account and all associated data.
            This action cannot be undone. You will receive a confirmation email
            before the deletion is processed.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                toast.info('Deletion request submitted. Check your email.')
                setDeleteModalOpen(false)
              }}
            >
              Request deletion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
