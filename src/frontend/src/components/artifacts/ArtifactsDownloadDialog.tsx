import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileArchive, FileText, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useStaticArtifactAvailability } from '@/hooks/useStaticArtifactAvailability';
import { t } from '@/lib/i18n';

interface ArtifactsDownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ArtifactsDownloadDialog({ open, onOpenChange }: ArtifactsDownloadDialogProps) {
  const { data: availability, isLoading } = useStaticArtifactAvailability();

  const artifacts = [
    {
      id: 'app-build',
      name: t('artifacts.app_build_name'),
      description: t('artifacts.app_build_description'),
      url: '/artifacts/app-build.zip',
      available: availability?.zipAvailable ?? false,
      icon: FileArchive,
    },
    {
      id: 'source-code-zip',
      name: t('artifacts.source_code_zip_name'),
      description: t('artifacts.source_code_zip_description'),
      url: '/artifacts/source-code.zip',
      available: availability?.sourceZipAvailable ?? false,
      icon: FileArchive,
    },
    {
      id: 'source-doc',
      name: t('artifacts.source_doc_name'),
      description: t('artifacts.source_doc_description'),
      url: '/artifacts/SOURCE_CODE.md',
      available: availability?.sourceDocAvailable ?? false,
      icon: FileText,
    },
  ];

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('artifacts.title')}</DialogTitle>
          <DialogDescription>{t('artifacts.description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            artifacts.map((artifact) => (
              <div
                key={artifact.id}
                className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="rounded-md bg-primary/10 p-2">
                  <artifact.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{artifact.name}</h4>
                    {artifact.available ? (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {t('artifacts.available')}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <XCircle className="h-3 w-3" />
                        {t('artifacts.unavailable')}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{artifact.description}</p>
                </div>
                <Button
                  size="sm"
                  disabled={!artifact.available}
                  onClick={() => handleDownload(artifact.url)}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  {t('artifacts.download')}
                </Button>
              </div>
            ))
          )}

          {!isLoading && artifacts.every((a) => !a.available) && (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="text-sm text-muted-foreground">{t('artifacts.none_available')}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('action.cancel')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
