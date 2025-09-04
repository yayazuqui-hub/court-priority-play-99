import { SystemState, PriorityQueue, Booking } from '@/hooks/useRealtimeData';
import { SystemControls } from './admin/SystemControls';
import { QueueManagement } from './admin/QueueManagement';
import { BookingsManagement } from './admin/BookingsManagement';
import { ScheduleManagement } from './admin/ScheduleManagement';

interface AdminPanelProps {
  systemState: SystemState | null;
  priorityQueue: PriorityQueue[];
  bookings: Booking[];
}

export function AdminPanel({ systemState, priorityQueue, bookings }: AdminPanelProps) {
  return (
    <div className="space-y-6">
      <SystemControls systemState={systemState} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QueueManagement priorityQueue={priorityQueue} />
        <BookingsManagement bookings={bookings} />
      </div>

      <ScheduleManagement />
    </div>
  );
}