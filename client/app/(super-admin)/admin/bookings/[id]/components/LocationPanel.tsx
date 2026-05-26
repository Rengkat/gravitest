import { MapPin, Navigation, DollarSign, Target } from "lucide-react";
import { InfoBlock, SectionCard } from "./Primitives";
import type { Booking } from "../types";

interface Props {
  booking: Booking;
}

export function LocationPanel({ booking }: Props) {
  if (booking.type !== "physical" || !booking.location) return null;

  return (
    <SectionCard title="Location Details">
      <div className="grid grid-cols-2 gap-4">
        <InfoBlock
          icon={MapPin}
          label="Tutor Location"
          value={booking.locationAddress ?? booking.location}
        />
        <InfoBlock
          icon={Navigation}
          label="Student Address"
          value={booking.studentAddress ?? "—"}
        />
        {booking.travelFee != null && (
          <InfoBlock
            icon={DollarSign}
            label="Travel Fee"
            value={`₦${booking.travelFee.toLocaleString()}`}
          />
        )}
        {booking.distance != null && (
          <InfoBlock icon={Target} label="Distance" value={`${booking.distance} km`} />
        )}
      </div>
    </SectionCard>
  );
}
