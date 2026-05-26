interface Props {
  tutorName: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function SuspendModal({ tutorName, onConfirm, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h3 className="font-serif text-xl text-green-900 mb-3">Suspend Tutor</h3>
        <p className="text-[14px] text-text-muted mb-6">
          Are you sure you want to suspend <strong>{tutorName}</strong>? They will no longer be
          able to accept new sessions.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-[14px] font-semibold text-text-muted hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all text-[14px]">
            Suspend Tutor
          </button>
        </div>
      </div>
    </div>
  );
}
