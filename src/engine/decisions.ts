import { Client, Alert, AlertSeverity, AlertType } from '@/types'
import { calculateRiskScore, calculateCollectionRate } from './financial'

interface DecisionContext {
  clients: Client[]
  collectionRate: number
  monthlyExpenses: number
  monthlyRevenue: number
  currentDay: number
}

interface Decision {
  type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  clientId?: string
  action: string
}

// Main decision engine - evaluates all rules
export function evaluateDecisions(context: DecisionContext): Decision[] {
  const decisions: Decision[] = []

  // Rule: Collection rate < 60% at day 15 -> trigger payment reminder campaign
  if (context.currentDay >= 15 && context.collectionRate < 60) {
    decisions.push({
      type: 'payment',
      severity: 'high',
      title: 'معدل التحصيل منخفض',
      message: `معدل التحصيل ${context.collectionRate}% في اليوم ${context.currentDay} من الشهر. يجب إطلاق حملة تذكير بالدفع.`,
      action: 'trigger_payment_campaign'
    })
  }

  // Rule: Monthly expenses > 80% revenue -> financial emergency
  if (context.monthlyExpenses > context.monthlyRevenue * 0.8) {
    const ratio = Math.round((context.monthlyExpenses / context.monthlyRevenue) * 100)
    decisions.push({
      type: 'financial',
      severity: ratio > 100 ? 'critical' : 'high',
      title: 'تنبيه مالي طارئ',
      message: `المصروفات تمثل ${ratio}% من الإيرادات. يجب اتخاذ إجراء فوري لخفض التكاليف.`,
      action: 'financial_emergency'
    })
  }

  // Per-client rules
  for (const client of context.clients) {
    // Client delay > 15 days -> escalate to manager
    if (client.avgDelayDays > 15 && client.status === 'active') {
      decisions.push({
        type: 'payment',
        severity: 'high',
        title: `تأخر عميل: ${client.name}`,
        message: `العميل ${client.name} متأخر بمتوسط ${client.avgDelayDays} يوم. يجب التصعيد للمدير.`,
        clientId: client.id,
        action: 'escalate_manager'
      })
    }

    // Contract expiry < 30 days -> auto renewal reminder
    if (client.contractEnd) {
      const daysToExpiry = Math.ceil((new Date(client.contractEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      if (daysToExpiry > 0 && daysToExpiry < 30) {
        decisions.push({
          type: 'contract',
          severity: 'medium',
          title: `عقد ينتهي قريباً: ${client.name}`,
          message: `عقد ${client.name} ينتهي خلال ${daysToExpiry} يوم. يجب التجديد.`,
          clientId: client.id,
          action: 'renewal_reminder'
        })
      }
    }

    // Risk score check
    const riskScore = calculateRiskScore(client)
    if (riskScore > 60) {
      decisions.push({
        type: 'payment',
        severity: riskScore > 80 ? 'critical' : 'high',
        title: `عميل عالي المخاطر: ${client.name}`,
        message: `درجة المخاطر للعميل ${client.name}: ${riskScore}. يحتاج متابعة خاصة.`,
        clientId: client.id,
        action: 'flag_high_risk'
      })
    }
  }

  return decisions
}

// Discount decision logic
export function evaluateDiscount(client: Client, requestedDiscount: number): { approved: boolean; maxDiscount: number; reason: string } {
  // Category A + delay < 5 days -> allow 5%
  if (client.category === 'A' && client.avgDelayDays < 5) {
    return {
      approved: requestedDiscount <= 5,
      maxDiscount: 5,
      reason: 'عميل مميز مع سجل دفع ممتاز'
    }
  }
  // Category C + delay > 15 days -> deny
  if (client.category === 'C' && client.avgDelayDays > 15) {
    return {
      approved: false,
      maxDiscount: 0,
      reason: 'عميل غير مؤهل للخصم بسبب تأخر الدفع المتكرر'
    }
  }
  // Category B -> allow up to 3%
  if (client.category === 'B') {
    return {
      approved: requestedDiscount <= 3,
      maxDiscount: 3,
      reason: 'عميل عادي - خصم محدود'
    }
  }
  // Default
  return {
    approved: requestedDiscount <= 2,
    maxDiscount: 2,
    reason: 'خصم افتراضي'
  }
}

// Emergency protocol handlers
export function handleEmergency(scenario: string, data: Record<string, unknown>): { actions: string[]; impact: string; recommendations: string[] } {
  switch (scenario) {
    case 'multiple_missed_payments': {
      const count = (data.count as number) || 4
      const totalImpact = (data.totalAmount as number) || 0
      return {
        actions: ['تجميد الخدمات للعملاء المتأخرين', 'إرسال إنذار نهائي', 'تفعيل خطة التحصيل الطارئة'],
        impact: `خسارة متوقعة: ${totalImpact.toLocaleString()} ر.س من ${count} عملاء`,
        recommendations: ['مراجعة شروط الدفع', 'تفعيل الدفع المسبق للعملاء الجدد', 'تنويع قاعدة العملاء']
      }
    }
    case 'expenses_exceed_revenue': {
      return {
        actions: ['تجميد المصروفات غير الضرورية', 'مراجعة العقود مع الموردين', 'تأجيل المشاريع غير العاجلة'],
        impact: 'الشركة تعمل بخسارة - يجب التصرف خلال 48 ساعة',
        recommendations: ['إعادة التفاوض على العقود', 'خفض المصروفات التشغيلية 20%', 'زيادة أسعار الخدمات']
      }
    }
    case 'large_client_cancellation': {
      const clientName = (data.clientName as string) || 'عميل رئيسي'
      const revenueLoss = (data.revenueLoss as number) || 0
      return {
        actions: ['محاولة استرجاع العميل', 'تنشيط خطة الطوارئ', 'البحث عن عملاء بديلين'],
        impact: `خسارة إيرادات شهرية: ${revenueLoss.toLocaleString()} ر.س`,
        recommendations: ['تعويض الإيراد خلال 30 يوم', 'تحليل أسباب الإلغاء', 'تحسين برنامج الاحتفاظ بالعملاء']
      }
    }
    case 'employee_leaves': {
      return {
        actions: ['قفل صلاحيات الوصول فوراً', 'إعادة تعيين العملاء', 'نقل المعرفة والملفات'],
        impact: 'خطر فقدان بيانات العملاء وتأخر المشاريع',
        recommendations: ['توثيق جميع العمليات', 'تفعيل نظام النسخ الاحتياطي', 'تعيين بديل مؤقت']
      }
    }
    default:
      return {
        actions: ['تحليل الوضع', 'إبلاغ الإدارة'],
        impact: 'غير محدد',
        recommendations: ['مراجعة الوضع يدوياً']
      }
  }
}
