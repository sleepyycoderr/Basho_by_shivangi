"use client";

interface Props {
  onClose: () => void;
}

export default function ReviewSuccessModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 text-center max-w-sm">
        <h3 className="text-xl mb-4 text-[var(--basho-dark)]">
          Review Submitted
        </h3>
        <p className="text-sm text-[var(--basho-brown)] mb-6">
          Your review request has been sent to the admin.  
          Thank you for sharing your experience 🤎
        </p>

        <button
          onClick={onClose}
          className="px-6 py-2 rounded-full bg-[var(--basho-terracotta)] text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
