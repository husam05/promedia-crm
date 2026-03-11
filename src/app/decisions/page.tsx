'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/ui/sidebar'
import AlertBadge from '@/components/ui/alert-badge'
import { DecisionRule, AlertSeverity } from '@/types'

interface Decision {
  type: string
  severity: AlertSeverity
  title: string
  message: string
  clientId?: string
  action: string
}

interface DecisionData {
  decisions: Decision[]
  rules: DecisionRule[]
  collectionRate: number
  monthlyRevenue: number
  monthlyExpenses: number
}

const emergencyScenarios = [
  { id: 'multiple_missed_payments', label: 'تأخر سداد متعدد', icon: '💳' },
  { id: 'expenses_exceed_revenue', label: 'المصروفات تتجاوز الإيرادات', icon: '📉' },
  { id: 'large_client_cancellation', label: 'إلغاء عميل رئيسي', icon: '🚨' },
  { id: 'employee_leaves', label: 'مغادرة موظف', icon: '👤' },
]

export default function DecisionsPage() {
  const [data, setData] = useState<DecisionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'decisions' | 'rules' | 'emergency'>('decisions')
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [emergencyResult, setEmergencyResult] = useState<{ actions: string[]; impact: string; recommendations: string[] } | null>(null)

  useEffect(() => {
    fetch('/api/decisions')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  const simulateEmergency = (scenarioId: string) => {
    setSelectedScenario(scenarioId)
    // Simulate emergency response
    const responses: Record<string, { actions: string[]; impact: string; recommendations: string[] }> = {
      multiple_missed_payments: {
        actions: ['تجميد الخدمات للعملاء المتأخرين', 'إرسال إنذار نهائي', 'تفعيل خطة التحصيل الطارئة'],
        impact: 'خسارة متوقعة: 10,500 ر.س من 4 عملاء',
        recommendations: ['مراجعة شروط الدفع', 'تفعيل الدفع المسبق للعملاء الجدد', 'تنويع قاعدة العملاء'],
      },
      expenses_exceed_revenue: {
        actions: ['تجميد المصروفات غير الضرورية', 'مراجعة العقود مع الموردين', 'تأجيل المشاريع غير العاجلة'],
        impact: 'الشركة تعمل بخسارة - يجب التصرف خلال 48 ساعة',
        recommendations: ['إعادة التفاوض على العقود', 'خفض المصروفات التشغيلية 20%', 'زيادة أسعار الخدمات'],
      },
      large_client_cancellation: {
        actions: ['محاولة استرجاع العميل', 'تنشيط خطة الطوارئ', 'البحث عن عملاء بديلين'],
        impact: 'خسارة إيرادات شهرية: 12,000 ر.س',
        recommendations: ['تعويض الإيراد خلال 30 يوم', 'تحليل أسباب الإلغاء', 'تحسين برنامج الاحتفاظ بالعملاء'],
      },
      employee_leaves: {
        actions: ['قفل صلاحيات الوصول فوراً', 'إعادة تعيين العملاء', 'نقل المعرفة والملفات'],
        impact: 'خطر فقدان بيانات العملاء وتأخر المشاريع',
        recommendations: ['توثيق جميع العمليات', 'تفعيل نظام النسخ الاحتياطي', 'تعيين بديل مؤقت'],
      },
    }
    setEmergencyResult(responses[scenarioId] || null)
  }

  if (loading || !data) {
    return (
      <div className="flex min-h-screen bg-gray-950">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-800 rounded w-48" />
            <div className="h-64 bg-gray-800 rounded-2xl" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">محرك القرارات الآلي</h1>
          <p className="text-sm text-gray-400">نظام اتخاذ القرارات التلقائي والتنبيهات الذكية</p>
        </div>

        {/* Status Bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <p className="text-xs text-gray-400">معدل التحصيل</p>
            <p className={`text-2xl font-bold ${data.collectionRate >= 70 ? 'text-emerald-400' : 'text-red-400'}`}>{data.collectionRate}%</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <p className="text-xs text-gray-400">قرارات نشطة</p>
            <p className="text-2xl font-bold text-amber-400">{data.decisions.length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <p className="text-xs text-gray-400">نسبة المصروفات/الإيرادات</p>
            <p className={`text-2xl font-bold ${data.monthlyExpenses / data.monthlyRevenue > 0.8 ? 'text-red-400' : 'text-emerald-400'}`}>
              {Math.round((data.monthlyExpenses / data.monthlyRevenue) * 100)}%
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'decisions' as const, label: 'القرارات النشطة' },
            { id: 'rules' as const, label: 'قواعد الأتمتة' },
            { id: 'emergency' as const, label: 'بروتوكول الطوارئ' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-gray-900 text-gray-400 border border-gray-800 hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Decisions */}
        {activeTab === 'decisions' && (
          <div className="space-y-3">
            {data.decisions.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
                <p className="text-gray-400">لا توجد قرارات نشطة حالياً</p>
              </div>
            ) : (
              data.decisions.map((decision, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertBadge severity={decision.severity} />
                        <h3 className="text-white font-medium">{decision.title}</h3>
                      </div>
                      <p className="text-sm text-gray-400">{decision.message}</p>
                    </div>
                    <button className="bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-xs hover:bg-emerald-500/30 transition-colors">
                      {decision.action === 'trigger_payment_campaign' ? 'إطلاق الحملة' :
                       decision.action === 'escalate_manager' ? 'تصعيد' :
                       decision.action === 'renewal_reminder' ? 'إرسال تذكير' :
                       decision.action === 'flag_high_risk' ? 'تفعيل المراقبة' :
                       decision.action === 'financial_emergency' ? 'خطة طوارئ' : 'تنفيذ'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Automation Rules */}
        {activeTab === 'rules' && (
          <div className="space-y-3">
            {data.rules.map(rule => (
              <div key={rule.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">{rule.name}</h3>
                    <div className="mt-2 flex gap-4 text-xs">
                      <span className="text-gray-400">الشرط: <span className="text-blue-400">{rule.condition}</span></span>
                      <span className="text-gray-400">الإجراء: <span className="text-emerald-400">{rule.action}</span></span>
                    </div>
                    <div className="mt-1 flex gap-4 text-xs text-gray-500">
                      {rule.lastTriggered && <span>آخر تنفيذ: {rule.lastTriggered}</span>}
                      <span>عدد مرات التنفيذ: {rule.triggerCount}</span>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${rule.isActive ? 'bg-emerald-500' : 'bg-gray-700'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform mt-0.5 ${rule.isActive ? 'mr-0.5' : 'mr-[26px]'}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Emergency Protocol */}
        {activeTab === 'emergency' && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {emergencyScenarios.map(scenario => (
                <button
                  key={scenario.id}
                  onClick={() => simulateEmergency(scenario.id)}
                  className={`p-4 rounded-2xl border text-right transition-all ${
                    selectedScenario === scenario.id
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <span className="text-2xl">{scenario.icon}</span>
                  <p className="text-sm text-white mt-2">{scenario.label}</p>
                  <p className="text-xs text-gray-400 mt-1">اضغط للمحاكاة</p>
                </button>
              ))}
            </div>

            {emergencyResult && (
              <div className="bg-gray-900 border border-red-500/20 rounded-2xl p-5">
                <h3 className="text-lg font-bold text-red-400 mb-4">نتيجة المحاكاة</h3>

                <div className="bg-red-500/5 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-400 mb-1">التأثير المتوقع</p>
                  <p className="text-white font-medium">{emergencyResult.impact}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-amber-400 mb-2">الإجراءات الفورية</h4>
                    <div className="space-y-2">
                      {emergencyResult.actions.map((action, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">{i + 1}</span>
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-400 mb-2">التوصيات</h4>
                    <div className="space-y-2">
                      {emergencyResult.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                          <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">{i + 1}</span>
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
