import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Play, 
  Pause, 
  RotateCcw, 
  Trophy, 
  BookOpen, 
  Info,
  Timer,
  BarChart3,
  Target,
  Plus,
  X,
  Sparkles,
  LayoutGrid,
  Settings,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, differenceInDays, startOfToday, addDays } from 'date-fns';
import confetti from 'canvas-confetti';
import { cn } from './lib/utils';
import { SUBJECTS, DAYS } from './constants';

// --- Types ---
interface PlanData {
  id: string;
  name: string;
  subjects: {
    name: string;
    totalLectures: number;
    color: string;
  }[];
  endDate: string;
  startDate: string;
}

interface CompletedSessions {
  [dateKey: string]: string[]; 
}

type TabType = 'today' | 'schedule' | 'timer' | 'stats';

const MOTIVATIONAL_QUOTES = [
  "النجاح هو مجموع جهود صغيرة تتكرر يوماً بعد يوم.",
  "كلما عملت بجد أكبر من أجل شيء ما، زاد شعورك بالعظمة عند تحقيقه.",
  "لا تتوقف عندما تتعب، توقف عندما تنتهي.",
  "بدايتك اليوم هي خطوتك الأولى نحو حلم الغد.",
  "أنت أقوى مما تعتقد، وأذكى مما تظن."
];

// --- Components ---

const ProgressBar = ({ progress, color = 'bg-indigo-600' }: { progress: number, color?: string }) => (
  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      className={cn("h-full rounded-full transition-all duration-500", color)}
    />
  </div>
);

const Card = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void, key?: React.Key }) => (
  <motion.div 
    whileHover={onClick ? { y: -2 } : undefined}
    whileTap={onClick ? { scale: 0.98 } : undefined}
    onClick={onClick}
    className={cn(
      "bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all",
      onClick && "cursor-pointer hover:shadow-md",
      className
    )}
  >
    {children}
  </motion.div>
);

const SetupWizard = ({ onComplete }: { onComplete: (data: PlanData) => void }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [endDate, setEndDate] = useState('2026-05-01');
  const [subjects, setSubjects] = useState(SUBJECTS.map(s => ({ name: s.name, totalLectures: 30, color: s.color })));

  const handleComplete = () => {
    const plan: PlanData = {
      id: Math.random().toString(36).substring(2, 11),
      name,
      subjects,
      endDate,
      startDate: format(new Date(), 'yyyy-MM-dd')
    };
    onComplete(plan);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100"
          >
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 mx-auto">
              <Sparkles className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 text-center mb-2">أهلاً بك في منظمك</h1>
            <p className="text-slate-500 text-center mb-10">لنقم بإعداد خطتك الدراسية في دقيقتين</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 mr-1">ما هو اسمك؟</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: محمد"
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 mr-1">متى ينتهي ماراثون الدراسة؟</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-lg"
                />
              </div>
              <button 
                disabled={!name}
                onClick={() => setStep(2)}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:shadow-none mt-4"
              >
                متابعة
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl w-full bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-2">حدد عدد المحاضرات</h2>
            <p className="text-slate-500 mb-8">كم محاضرة متبقية لك في كل مادة؟</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {subjects.map((sub, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sub.color }} />
                    <span className="font-bold text-slate-700">{sub.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        const newSubs = [...subjects];
                        newSubs[idx].totalLectures = Math.max(0, newSubs[idx].totalLectures - 1);
                        setSubjects(newSubs);
                      }}
                      className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600"
                    >-</button>
                    <span className="w-8 text-center font-mono font-bold">{sub.totalLectures}</span>
                    <button 
                      onClick={() => {
                        const newSubs = [...subjects];
                        newSubs[idx].totalLectures += 1;
                        setSubjects(newSubs);
                      }}
                      className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600"
                    >+</button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all"
              >
                رجوع
              </button>
              <button 
                onClick={handleComplete}
                className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
              >
                ابدأ رحلة النجاح 🚀
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TimerComponent = ({ activeSession, onFinish }: { activeSession: { id: string, name: string } | null, onFinish: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onFinish();
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onFinish]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-72 h-72 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="144"
            cy="144"
            r="130"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-100"
          />
          <motion.circle
            cx="144"
            cy="144"
            r="130"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray="816.8"
            animate={{ strokeDashoffset: 816.8 * (1 - timeLeft / (45 * 60)) }}
            className="text-indigo-600"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-mono font-bold text-slate-900">{formatTime(timeLeft)}</span>
          <span className="text-slate-400 mt-2 font-bold">{activeSession?.name || 'اختر جلسة'}</span>
        </div>
      </div>

      <div className="flex gap-6 mt-12">
        <button 
          onClick={() => setTimeLeft(45 * 60)}
          className="w-20 h-20 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all flex items-center justify-center"
        >
          <RotateCcw className="w-8 h-8" />
        </button>
        <button 
          onClick={() => setIsActive(!isActive)}
          className="w-24 h-24 rounded-full bg-indigo-600 text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center"
        >
          {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [planData, setPlanData] = useState<PlanData | null>(() => {
    const saved = localStorage.getItem('study_planner_plan');
    return saved ? JSON.parse(saved) : null;
  });

  const [completedSessions, setCompletedSessions] = useState<CompletedSessions>(() => {
    const saved = localStorage.getItem('study_planner_completed');
    return saved ? JSON.parse(saved) : {};
  });

  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [activeTimingSession, setActiveTimingSession] = useState<{ id: string; name: string } | null>(null);
  const [welcomeQuote] = useState(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);

  useEffect(() => {
    if (planData) localStorage.setItem('study_planner_plan', JSON.stringify(planData));
    localStorage.setItem('study_planner_completed', JSON.stringify(completedSessions));
  }, [planData, completedSessions]);

  const generatedSchedule = useMemo(() => {
    if (!planData) return [];
    const subjects = planData.subjects.filter(s => s.totalLectures > 0);
    if (subjects.length === 0) return [];
    const times = ['٨:٠٠ - ٩:٣٠', '٩:٤٥ - ١١:١٥', '١١:٣٠ - ١٢:٤٥', '١٢:٤٥ - ٢:٠٠'];
    
    return times.map((time, tIdx) => {
      const daySubjects: Record<string, string> = {};
      DAYS.forEach((day, dIdx) => {
        if (day === 'الجمعة') {
          daySubjects[day] = '😴 راحة';
        } else {
          const sIdx = (tIdx + dIdx * times.length) % subjects.length;
          daySubjects[day] = subjects[sIdx].name;
        }
      });
      return { id: `s${tIdx + 1}`, time, subjects: daySubjects };
    });
  }, [planData]);

  const stats = useMemo(() => {
    if (!planData) return { totalCompleted: 0, totalPossible: 1, percentage: 0, subjectProgress: [] };
    const sessionsList = Object.values(completedSessions) as string[][];
    const totalCompleted = sessionsList.reduce((acc, curr) => acc + (curr?.length || 0), 0);
    const totalPossible = planData.subjects.reduce((a, b) => a + (b?.totalLectures || 0), 0) || 1;
    
    const subjectProgress = planData.subjects.map(subject => {
      let completedCount = 0;
      Object.values(completedSessions).forEach((sessions) => {
        (sessions as string[]).forEach(sId => {
          const [sessionId, day] = sId.split('-');
          const session = generatedSchedule.find(s => s.id === sessionId);
          if (session && session.subjects[day]?.includes(subject.name)) completedCount++;
        });
      });
      return { ...subject, completed: completedCount, percent: Math.min(100, Math.round((completedCount / subject.totalLectures) * 100)) };
    });

    return { totalCompleted, totalPossible, percentage: Math.round((totalCompleted / totalPossible) * 100), subjectProgress };
  }, [completedSessions, planData, generatedSchedule]);

  const currentDate = startOfToday();
  const dayOfWeek = useMemo(() => {
    const mapping = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return mapping[currentDate.getDay()];
  }, [currentDate]);

  const toggleSession = (dateKey: string, sessionId: string) => {
    setCompletedSessions(prev => {
      const current = prev[dateKey] || [];
      const updated = current.includes(sessionId) ? current.filter(id => id !== sessionId) : [...current, sessionId];
      return { ...prev, [dateKey]: updated };
    });
  };

  const handleReset = () => {
    if (confirm('هل أنت متأكد من رغبتك في حذف كل البيانات والبدء من جديد؟')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!planData) {
    return <SetupWizard onComplete={setPlanData} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24" dir="rtl">
      {/* Header */}
      <header className="bg-white px-6 pt-8 pb-6 rounded-b-[2.5rem] shadow-sm border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">أهلاً، {planData.name}</h1>
              <p className="text-xs text-slate-400 font-medium">متبقي {differenceInDays(new Date(planData.endDate), currentDate)} يوم على النهاية</p>
            </div>
          </div>
          <button onClick={handleReset} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-red-500 transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="max-w-4xl mx-auto flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'today', label: 'اليوم', icon: Calendar },
            { id: 'schedule', label: 'الجدول', icon: LayoutGrid },
            { id: 'timer', label: 'المؤقت', icon: Timer },
            { id: 'stats', label: 'الإحصائيات', icon: BarChart3 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap",
                activeTab === tab.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'today' && (
            <motion.div key="today" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <Card className="bg-indigo-600 text-white border-none overflow-hidden relative">
                <div className="relative z-10">
                  <span className="text-indigo-200 text-xs font-bold uppercase tracking-wider">حكمة اليوم</span>
                  <p className="text-xl font-bold mt-2 leading-relaxed">"{welcomeQuote}"</p>
                </div>
                <Sparkles className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10" />
              </Card>

              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">مهام {dayOfWeek}</h2>
                <span className="text-xs font-bold text-slate-400">{format(currentDate, 'dd MMMM')}</span>
              </div>

              <div className="space-y-4">
                {generatedSchedule.map((session) => {
                  const subjectName = session.subjects[dayOfWeek];
                  const dateKey = format(currentDate, 'yyyy-MM-dd');
                  const isCompleted = completedSessions[dateKey]?.includes(session.id);
                  
                  if (subjectName === '😴 راحة') return null;

                  return (
                    <Card key={session.id} className={cn("flex items-center justify-between", isCompleted && "bg-slate-50 opacity-75")}>
                      <div className="flex items-center gap-4">
                        <button onClick={() => toggleSession(dateKey, session.id)} className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-all", isCompleted ? "bg-emerald-500 text-white" : "border-2 border-slate-200 text-slate-200")}>
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <div>
                          <h3 className={cn("font-bold text-lg", isCompleted && "line-through text-slate-400")}>{subjectName}</h3>
                          <p className="text-xs text-slate-400 font-medium">{session.time}</p>
                        </div>
                      </div>
                      <button onClick={() => { setActiveTimingSession({ id: session.id, name: subjectName }); setActiveTab('timer'); }} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all">
                        <Play className="w-5 h-5 fill-current" />
                      </button>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'schedule' && (
            <motion.div key="schedule" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="overflow-x-auto -mx-6 px-6 no-scrollbar">
                <table className="w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr>
                      <th className="text-right text-xs font-bold text-slate-400 pb-2 pr-4">الوقت</th>
                      {DAYS.map(day => <th key={day} className="text-center text-xs font-bold text-slate-400 pb-2">{day}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {generatedSchedule.map(session => (
                      <tr key={session.id}>
                        <td className="bg-white rounded-r-2xl p-4 text-xs font-bold text-slate-500 shadow-sm border-y border-r border-slate-100">{session.time}</td>
                        {DAYS.map(day => (
                          <td key={day} className={cn("bg-white p-4 text-center text-sm font-bold shadow-sm border-y border-slate-100 last:rounded-l-2xl last:border-l", day === dayOfWeek && "bg-indigo-50/50")}>
                            {session.subjects[day]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'timer' && (
            <motion.div key="timer" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <Card className="py-12">
                <TimerComponent activeSession={activeTimingSession} onFinish={() => { if (activeTimingSession) toggleSession(format(currentDate, 'yyyy-MM-dd'), activeTimingSession.id); setActiveTimingSession(null); }} />
              </Card>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div key="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-indigo-600 text-white border-none">
                  <Target className="w-6 h-6 mb-4 text-indigo-200" />
                  <span className="text-3xl font-bold">{stats.percentage}%</span>
                  <p className="text-xs text-indigo-200 mt-1">إجمالي الإنجاز</p>
                </Card>
                <Card>
                  <Trophy className="w-6 h-6 mb-4 text-amber-500" />
                  <span className="text-3xl font-bold">{stats.totalCompleted}</span>
                  <p className="text-xs text-slate-400 mt-1">جلسة مكتملة</p>
                </Card>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mt-8">تقدم المواد</h3>
              <div className="space-y-4">
                {stats.subjectProgress.map((sub, idx) => (
                  <Card key={idx} className="p-5">
                    <div className="flex justify-between mb-3">
                      <span className="font-bold">{sub.name}</span>
                      <span className="text-xs font-bold text-slate-400">{sub.completed} / {sub.totalLectures}</span>
                    </div>
                    <ProgressBar progress={sub.percent} color={sub.color.startsWith('#') ? undefined : sub.color} />
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
