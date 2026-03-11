export interface Activity {
  id: string
  type: 'client_added' | 'client_updated' | 'client_deleted' | 'receipt_created' | 'status_changed' | 'payment_received' | 'system'
  title: string
  description: string
  clientId?: string
  timestamp: string
  icon: string // lucide icon name for reference
}

// In-memory store with some initial activities
const activities: Activity[] = [
  { id: 'act-1', type: 'system', title: 'بدء تشغيل النظام', description: 'تم تشغيل نظام ProMedia CRM', timestamp: '2026-03-11T08:00:00', icon: 'Power' },
  { id: 'act-2', type: 'payment_received', title: 'دفعة مستلمة', description: 'شركة الفجر للتقنية - 10,000 د.ع', clientId: '1', timestamp: '2026-03-11T09:15:00', icon: 'Banknote' },
  { id: 'act-3', type: 'receipt_created', title: 'إيصال جديد', description: 'تم إنشاء إيصال REC-00001 لشركة البناء الذكي', clientId: '6', timestamp: '2026-03-11T09:30:00', icon: 'FileText' },
  { id: 'act-4', type: 'status_changed', title: 'تغيير حالة عميل', description: 'مصنع الحلول - تم الإيقاف بسبب عدم السداد', clientId: '10', timestamp: '2026-03-10T14:00:00', icon: 'UserX' },
  { id: 'act-5', type: 'client_updated', title: 'تحديث بيانات', description: 'تم تحديث بيانات مؤسسة الإبداع', clientId: '5', timestamp: '2026-03-10T11:00:00', icon: 'UserCog' },
  { id: 'act-6', type: 'payment_received', title: 'دفعة مستلمة', description: 'مؤسسة النور للدعاية - 8,000 د.ع', clientId: '2', timestamp: '2026-03-10T10:00:00', icon: 'Banknote' },
  { id: 'act-7', type: 'system', title: 'تقرير أسبوعي', description: 'تم إنشاء التقرير الأسبوعي تلقائياً', timestamp: '2026-03-09T08:00:00', icon: 'FileBarChart' },
  { id: 'act-8', type: 'receipt_created', title: 'إيصال جديد', description: 'تم إنشاء إيصال REC-00002 لأكاديمية التعليم المتقدم', clientId: '9', timestamp: '2026-03-09T13:00:00', icon: 'FileText' },
  { id: 'act-9', type: 'client_added', title: 'عميل جديد', description: 'تم إضافة متجر الأناقة إلى النظام', clientId: '12', timestamp: '2026-03-08T09:00:00', icon: 'UserPlus' },
  { id: 'act-10', type: 'payment_received', title: 'دفعة مستلمة', description: 'شركة البناء الذكي - 12,000 د.ع', clientId: '6', timestamp: '2026-03-08T10:30:00', icon: 'Banknote' },
]

export function getActivities(): Activity[] {
  return [...activities].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function addActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Activity {
  const newActivity: Activity = {
    ...activity,
    id: `act-${Date.now()}`,
    timestamp: new Date().toISOString(),
  }
  activities.unshift(newActivity)
  return newActivity
}
