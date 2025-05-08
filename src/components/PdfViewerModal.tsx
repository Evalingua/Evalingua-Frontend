import { useEffect, useRef, useState } from 'react';
import Modal from './Modal';
import { ReporteService } from '../services/evaluacion/ReporteService';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  evaluacionId: string;
};

const reporteService = new ReporteService();

export const PdfViewerModal = ({ isOpen, onClose, evaluacionId }: Props) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isOpen && evaluacionId) {
      reporteService.getEvaluacionPdf(evaluacionId).then((blob) => {
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      });
    };
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [isOpen, evaluacionId]);

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `reporte_${evaluacionId}.pdf`;
    a.click();
  };

  const handlePrint = () => {
    if (iframeRef.current) iframeRef.current.contentWindow?.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="Reporte de Evaluación"
      closeOnClickOutside={false}
      footer={
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="border border-primary px-4 py-2 rounded text-primary">
            Cerrar
          </button>
          <button onClick={handleDownload} className="bg-primary text-white px-4 py-2 rounded">
            Descargar PDF
          </button>
          <button onClick={handlePrint} className="bg-secondary text-white px-4 py-2 rounded">
            Imprimir
          </button>
        </div>
      }
    >
      <div className="h-[400px]">
        {pdfUrl ? (
          <iframe
            ref={iframeRef}
            src={pdfUrl}
            title="Vista previa del PDF"
            className="w-full h-full border rounded"
          />
        ) : (
          <div className='flex flex-col items-center justify-center h-full'>
            <span className="text-gray-500">Cargando PDF...</span>
            <svg className="animate-spin w-10 h-10 mr-3 border-b-2 border-primary dark:border-white rounded-full" viewBox="0 0 24 24"></svg>
          </div>
        )}
      </div>
    </Modal>
  );
};
