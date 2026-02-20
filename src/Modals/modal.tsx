import "./Modal.css";

type ModalType = "success" | "error" | "confirm" | "info";

interface ModalProps {
  open: boolean;
  type?: ModalType;
  title: string;
  message?: string;
  onConfirm?: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function Modal({
  open,
  type = "info",
  title,
  message,
  onConfirm,
  onClose,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className={`modal-box ${type}`}>
        <h3>{title}</h3>
        {message && <p>{message}</p>}

        <div className="modal-actions">
          {onConfirm && (
            <button className="confirm" onClick={onConfirm}>
              {confirmText}
            </button>
          )}

          <button className="close" onClick={onClose}>
            {onConfirm ? cancelText : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}