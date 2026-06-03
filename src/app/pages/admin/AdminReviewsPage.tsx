import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { deleteReview, updateReview } from '../../store/slices/catalogSlice';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { Button } from '../../components/common/Button';
import { toast } from 'sonner';

export const AdminReviewsPage: React.FC = () => {
  const dispatch = useDispatch();
  const reviews = useSelector((s: RootState) => s.catalog.reviews);

  return (
    <div className="admin-page">
      <AdminPageHeader title="Review Management" subtitle="Approve, reply, or remove reviews" />

      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white border rounded-2xl p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{r.productName}</p>
                <p className="text-sm text-gray-600">{r.customerName} · {'★'.repeat(r.rating)}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${r.approved ? 'bg-green-100' : 'bg-gray-100'}`}>
                {r.approved ? 'Visible' : 'Hidden'}
              </span>
            </div>
            <p className="mt-2 text-sm">{r.text}</p>
            {r.reply && <p className="mt-2 text-sm text-[var(--primary-dark)]">Reply: {r.reply}</p>}
            <div className="flex flex-wrap gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={() => dispatch(updateReview({ ...r, approved: !r.approved }))}>
                {r.approved ? 'Hide' : 'Show'}
              </Button>
              <Button size="sm" variant="outline" onClick={() => {
                const reply = prompt('Reply to review:', r.reply ?? '');
                if (reply != null) dispatch(updateReview({ ...r, reply }));
              }}>Reply</Button>
              <Button size="sm" variant="outline" onClick={() => dispatch(updateReview({ ...r, flagged: !r.flagged }))}>
                {r.flagged ? 'Unflag' : 'Flag'}
              </Button>
              <Button size="sm" variant="outline" onClick={() => { dispatch(deleteReview(r.id)); toast.success('Deleted'); }}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

