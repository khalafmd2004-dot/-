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
  fileInfo?: string;
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
  const [fileInfo, setFileInfo] = useState('');
  const [endDate, setEndDate] = useState('2026-05-01');
  const [subjects, setSubjects] = useState(SUBJECTS.map(s => ({ name: s.name, totalLectures: 30, color: s.color })));

  const handleComplete = () => {
    const plan: PlanData = {
      id: Math.random().toString(36).substring(2, 11),
      name,
      fileInfo,
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
                <label className="block text-sm font-bold text-slate-700 mb-2 mr-1">معلومات الملف (اختياري)</label>
                <input 
                  type="text" 
                  value={fileInfo}
                  onChange={(e) => setFileInfo(e.target.value)}
                  placeholder="مثال: دفعة 2026"
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

const TimerComponent = ({ activeSession, subjects, onFinish, onSelectSession }: { 
  activeSession: { id: string, name: string } | null, 
  subjects: { name: string, color: string }[],
  onFinish: () => void,
  onSelectSession: (session: { id: string, name: string }) => void
}) => {
  const [timeLeft, setTimeLeft] = useState(50 * 60); // 50 minutes
  const [isActive, setIsActive] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

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
    <div className="flex flex-col items-center justify-center py-8">
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
            animate={{ strokeDashoffset: 816.8 * (1 - timeLeft / (50 * 60)) }}
            className="text-indigo-600"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-mono font-bold text-slate-900">{formatTime(timeLeft)}</span>
          <button 
            onClick={() => setShowPicker(true)}
            className="text-indigo-600 mt-2 font-bold flex items-center gap-1 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-all"
          >
            {activeSession?.name || 'اختر مادة'}
            <Settings className="w-3 h-3" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showPicker && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-x-6 bottom-32 bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-[60]"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">اختر مادة الجلسة</h3>
              <button onClick={() => setShowPicker(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {subjects.map((sub, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectSession({ id: `manual-${idx}`, name: sub.name });
                    setShowPicker(false);
                  }}
                  className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 text-right flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sub.color }} />
                  <span className="text-sm font-bold">{sub.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-6 mt-12">
        <button 
          onClick={() => setTimeLeft(50 * 60)}
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
    const dayMapping = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    
    // Generate for all weeks
    const start = new Date(planData.startDate);
    const end = new Date(planData.endDate);
    const totalDays = differenceInDays(end, start) + 1;
    const weeks = [];
    
    for (let i = 0; i < totalDays; i += 7) {
      const weekSessions = times.map((time, tIdx) => {
        const daySubjects: Record<string, string> = {};
        DAYS.forEach((day, dIdx) => {
          const currentDayIndex = (i + dIdx);
          if (day === 'الجمعة') {
            daySubjects[day] = '😴 راحة';
          } else {
            const sIdx = (tIdx + currentDayIndex * times.length) % subjects.length;
            daySubjects[day] = subjects[sIdx].name;
          }
        });
        return { id: `s${tIdx + 1}`, time, subjects: daySubjects };
      });
      weeks.push({ weekNumber: Math.floor(i / 7) + 1, sessions: weekSessions });
    }
    return weeks;
  }, [planData]);

  const backlog = useMemo(() => {
    if (!planData || generatedSchedule.length === 0) return [];
    const start = new Date(planData.startDate);
    const today = startOfToday();
    const backlogItems: { date: string, dateKey: string, session: any, subject: string }[] = [];
    const dayMapping = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    for (let d = new Date(start); d < today; d.setDate(d.getDate() + 1)) {
      const dateKey = format(d, 'yyyy-MM-dd');
      const dayName = dayMapping[d.getDay()];
      const weekIdx = Math.floor(differenceInDays(d, start) / 7);
      const week = generatedSchedule[weekIdx];
      
      if (week) {
        week.sessions.forEach((session: any) => {
          const subject = session.subjects[dayName];
          if (subject && subject !== '😴 راحة') {
            const isCompleted = completedSessions[dateKey]?.includes(session.id);
            if (!isCompleted) {
              backlogItems.push({ date: format(d, 'dd MMMM'), dateKey, session, subject });
            }
          }
        });
      }
    }
    return backlogItems;
  }, [planData, generatedSchedule, completedSessions]);

  const stats = useMemo(() => {
    if (!planData) return { totalCompleted: 0, totalPossible: 1, percentage: 0, subjectProgress: [] };
    
    const progressSubjects = planData.subjects.filter(s => !s.name.includes('مراجعة'));
    const dayMapping = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    
    let totalCompleted = 0;
    const subjectCompletedCounts: Record<string, number> = {};
    planData.subjects.forEach(s => subjectCompletedCounts[s.name] = 0);

    Object.entries(completedSessions).forEach(([dateKey, sessions]) => {
      // Split YYYY-MM-DD to avoid timezone shifts
      const [year, month, dayNum] = dateKey.split('-').map(Number);
      const date = new Date(year, month - 1, dayNum);
      const day = dayMapping[date.getDay()];
      
      const start = new Date(planData.startDate);
      const weekIdx = Math.floor(differenceInDays(date, start) / 7);
      const week = generatedSchedule[weekIdx];

      (sessions as string[]).forEach(sId => {
        const session = week?.sessions.find((s: any) => s.id === sId);
        const subjectName = session?.subjects[day];
        if (subjectName) {
          // Increment subject specific count
          const baseSubject = planData.subjects.find(s => subjectName.includes(s.name));
          if (baseSubject) {
            subjectCompletedCounts[baseSubject.name]++;
          }
          
          // Increment total progress if not review
          if (!subjectName.includes('مراجعة')) {
            totalCompleted++;
          }
        }
      });
    });

    const totalPossible = progressSubjects.reduce((a, b) => a + (b?.totalLectures || 0), 0) || 1;
    
    const subjectProgress = planData.subjects.map(subject => {
      const completedCount = subjectCompletedCounts[subject.name] || 0;
      return { 
        ...subject, 
        completed: completedCount, 
        percent: Math.min(100, Math.round((completedCount / subject.totalLectures) * 100)) 
      };
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
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">أهلاً، {planData.name}</h1>
              <div className="flex items-center gap-2">
                <p className="text-xs text-slate-400 font-medium">متبقي {differenceInDays(new Date(planData.endDate), currentDate)} يوم</p>
                {planData.fileInfo && (
                  <>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <p className="text-xs text-indigo-500 font-bold">{planData.fileInfo}</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <button onClick={handleReset} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-red-500 transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
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
                {generatedSchedule[Math.floor(differenceInDays(currentDate, new Date(planData.startDate)) / 7)]?.sessions.map((session: any) => {
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

              {backlog.length > 0 && (
                <div className="mt-12 space-y-6">
                  <div className="flex items-center gap-2 text-red-500">
                    <Info className="w-5 h-5" />
                    <h2 className="text-xl font-bold">تراكمات سابقة</h2>
                  </div>
                  <div className="space-y-4">
                    {backlog.map((item, idx) => (
                      <Card key={idx} className="flex items-center justify-between border-red-50">
                        <div className="flex items-center gap-4">
                          <button onClick={() => toggleSession(item.dateKey, item.session.id)} className="w-8 h-8 rounded-full border-2 border-slate-200 text-slate-200 flex items-center justify-center transition-all">
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <div>
                            <h3 className="font-bold text-lg">{item.subject}</h3>
                            <p className="text-xs text-slate-400 font-medium">{item.date} • {item.session.time}</p>
                          </div>
                        </div>
                        <button onClick={() => { setActiveTimingSession({ id: item.session.id, name: item.subject }); setActiveTab('timer'); }} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all">
                          <Play className="w-5 h-5 fill-current" />
                        </button>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'schedule' && (
            <motion.div key="schedule" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
              {generatedSchedule.map((week) => (
                <div key={week.weekNumber} className="space-y-4">
                  <h3 className="text-lg font-bold text-indigo-600 bg-indigo-50 w-fit px-4 py-1 rounded-full">الأسبوع {week.weekNumber}</h3>
                  <div className="overflow-x-auto -mx-6 px-6 no-scrollbar">
                    <table className="w-full border-separate border-spacing-y-3">
                      <thead>
                        <tr>
                          <th className="text-right text-xs font-bold text-slate-400 pb-2 pr-4">الوقت</th>
                          {DAYS.map(day => <th key={day} className="text-center text-xs font-bold text-slate-400 pb-2">{day}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {week.sessions.map((session: any) => (
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
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'timer' && (
            <motion.div key="timer" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <Card className="py-12">
                <TimerComponent 
                  activeSession={activeTimingSession} 
                  subjects={planData.subjects}
                  onSelectSession={setActiveTimingSession}
                  onFinish={() => { if (activeTimingSession) toggleSession(format(currentDate, 'yyyy-MM-dd'), activeTimingSession.id); setActiveTimingSession(null); }} 
                />
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
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 z-50 flex justify-around items-center rounded-t-[2rem] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)]">
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
              "flex flex-col items-center gap-1 transition-all",
              activeTab === tab.id ? "text-indigo-600" : "text-slate-400"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-all",
              activeTab === tab.id ? "bg-indigo-50" : "bg-transparent"
            )}>
              <tab.icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
