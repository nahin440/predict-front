'use client';

interface FullPredictionModalProps {
  prediction: any;
  onClose: () => void;
}

export default function FullPredictionModal({ prediction, onClose }: FullPredictionModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Complete Raw Data</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <pre className="modal-pre">{JSON.stringify(prediction, null, 2)}</pre>
      </div>
    </div>
  );
}