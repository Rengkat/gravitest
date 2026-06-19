import { FileText } from "lucide-react";
import { FinanceRow, SectionCard } from "./Primitives";
import type { Booking } from "../types";

interface Props {
  booking: Booking;
}

export function FinancialTab({ booking }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SectionCard title="Payment Details">
        <div className="space-y-1">
          <FinanceRow label="Invoice ID"       value={booking.invoiceId} />
          <FinanceRow label="Session Price"    value={`₦${booking.price.toLocaleString()}`} />
          {booking.discount > 0 && (
            <FinanceRow
              label="Discount"
              value={`-₦${booking.discount.toLocaleString()}`}
              isNegative
            />
          )}
          <FinanceRow
            label="Total Paid"
            value={`₦${booking.totalPaid.toLocaleString()}`}
            isBold
          />
          <FinanceRow label="Payment Method"  value={booking.paymentMethod} />
          <FinanceRow label="Payment Status"  value={booking.paymentStatus} isStatus />

          <div className="border-t pt-3 mt-3" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <FinanceRow
              label="Platform Fee (20%)"
              value={`₦${booking.platformFee.toLocaleString()}`}
            />
            <FinanceRow
              label="Tutor Earning"
              value={`₦${booking.tutorEarning.toLocaleString()}`}
              isBold
            />
          </div>
        </div>

        <button className="w-full mt-4 py-2.5 rounded-lg border-2 border-green-800 text-green-800 text-[13px] font-semibold hover:bg-green-50 transition-all flex items-center justify-center gap-2">
          <FileText size={14} /> Download Invoice
        </button>
      </SectionCard>
    </div>
  );
}
