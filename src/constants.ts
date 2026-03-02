export interface Subject {
  id: string;
  name: string;
  weeklyLectures: number;
  totalLectures: number;
  color: string;
}

export interface Session {
  id: string;
  time: string;
  subjects: {
    [key: string]: string; // day -> subject name (with count)
  };
}

export const SUBJECTS: Subject[] = [
  { id: 'arabic', name: 'عربي', weeklyLectures: 0, totalLectures: 0, color: '#ef4444' },
  { id: 'physics', name: 'فيزياء', weeklyLectures: 0, totalLectures: 0, color: '#3b82f6' },
  { id: 'biology', name: 'أحياء', weeklyLectures: 0, totalLectures: 0, color: '#10b981' },
  { id: 'english', name: 'إنجليزي', weeklyLectures: 0, totalLectures: 0, color: '#f59e0b' },
  { id: 'islamic', name: 'إسلامية', weeklyLectures: 0, totalLectures: 0, color: '#8b5cf6' },
  { id: 'chemistry', name: 'كيمياء', weeklyLectures: 0, totalLectures: 0, color: '#ec4899' },
  { id: 'review', name: 'مراجعة', weeklyLectures: 0, totalLectures: 0, color: '#6b7280' },
];

export const DAYS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

export const SCHEDULE: Session[] = [
  {
    id: 's1',
    time: '٨:٠٠ - ٩:٣٠',
    subjects: {
      'السبت': 'فيزياء (2)',
      'الأحد': 'عربي (2)',
      'الاثنين': 'فيزياء (2)',
      'الثلاثاء': 'عربي (2)',
      'الأربعاء': 'فيزياء (2)',
      'الخميس': 'عربي (2)',
      'الجمعة': '😴 راحة'
    }
  },
  {
    id: 's2',
    time: '٩:٤٥ - ١١:١٥',
    subjects: {
      'السبت': 'فيزياء (1)',
      'الأحد': 'عربي (2)',
      'الاثنين': 'فيزياء (1)',
      'الثلاثاء': 'عربي (2)',
      'الأربعاء': 'أحياء (2)',
      'الخميس': 'عربي (1)',
      'الجمعة': ''
    }
  },
  {
    id: 's3',
    time: '١١:٣٠ - ١٢:٤٥',
    subjects: {
      'السبت': 'أحياء (2)',
      'الأحد': 'إنجليزي (1)',
      'الاثنين': 'أحياء (2)',
      'الثلاثاء': 'إسلامية (1)',
      'الأربعاء': 'إنجليزي (1)',
      'الخميس': 'أحياء (1)',
      'الجمعة': ''
    }
  },
  {
    id: 's4',
    time: '١٢:٤٥ - ٢:٠٠',
    subjects: {
      'السبت': 'أحياء (1)',
      'الأحد': 'إنجليزي (1)',
      'الاثنين': 'أحياء (1)',
      'الثلاثاء': 'إسلامية (1)',
      'الأربعاء': 'مراجعة (1)',
      'الخميس': 'مراجعة (1)',
      'الجمعة': ''
    }
  }
];
