import { subDays } from 'date-fns';
import { dkey, uid } from './utils';
import { calcStreak, type Data, type Habit, type Priority, type Task } from './store';

type L = [string, string];
const pick = (l: L, lang: string) => (lang === 'ar' ? l[1] : l[0]);
interface Tpl { label: L; icon: string; tasks: [L, string, Priority][]; habits: [L, string, string][]; goal: [L, number, L[]] }

export const TPL: Record<string, Tpl> = {
  baccalaureate_engineering: {
    label: ['Baccalaureate – Engineering Track', 'بكالوريا – مسار الهندسة 🏗️'],
    icon: '🎓',
    tasks: [
      [['عربي | الوحدة الأولى: العلم والضمير — العلم بين القانون والضمير', 'عربي | الوحدة الأولى: العلم والضمير — العلم بين القانون والضمير'], 'study', 'urgent'],
      [['عربي | الوحدة الأولى: الخلق جوهر الفضيلة — المنفلوطي', 'عربي | الوحدة الأولى: الخلق جوهر الفضيلة — المنفلوطي'], 'study', 'high'],
      [['عربي | الوحدة الأولى: العلم نور — معروف الرصافي', 'عربي | الوحدة الأولى: العلم نور — معروف الرصافي'], 'study', 'high'],
      [['عربي | الوحدة الثانية: التقنية وصناعة الرأي العام', 'عربي | الوحدة الثانية: التقنية وصناعة الرأي العام'], 'study', 'high'],
      [['عربي | الوحدة الثانية: بين الذوق والعقل', 'عربي | الوحدة الثانية: بين الذوق والعقل'], 'study', 'med'],
      [['عربي | الوحدة الثانية: أثر الكلمة وحفظ اللسان', 'عربي | الوحدة الثانية: أثر الكلمة وحفظ اللسان'], 'study', 'med'],
      [['عربي | الوحدة الثالثة: حقوق الإنسان بين العالمية والخصوصية', 'عربي | الوحدة الثالثة: حقوق الإنسان بين العالمية والخصوصية'], 'study', 'high'],
      [['عربي | الوحدة الثالثة: الحرية الفكرية', 'عربي | الوحدة الثالثة: الحرية الفكرية'], 'study', 'med'],
      [['عربي | الوحدة الثالثة: يا أخي الإنسان', 'عربي | الوحدة الثالثة: يا أخي الإنسان'], 'study', 'med'],
      [['عربي | نحو: الأسماء الخمسة وشروط إعرابها', 'عربي | نحو: الأسماء الخمسة وشروط إعرابها'], 'study', 'urgent'],
      [['عربي | النواسخ: كان وكاد وإن وأخواتها', 'عربي | النواسخ: كان وكاد وإن وأخواتها'], 'study', 'urgent'],
      [['عربي | المنصوبات: المفعول لأجله والحال', 'عربي | المنصوبات: المفعول لأجله والحال'], 'study', 'high'],
      [['عربي | المنصوبات: المفعول المطلق والظرف', 'عربي | المنصوبات: المفعول المطلق والظرف'], 'study', 'high'],
      [['عربي | التوابع: النعت والبدل والعطف', 'عربي | التوابع: النعت والبدل والعطف'], 'study', 'high'],
      [['عربي | الممنوع من الصرف', 'عربي | الممنوع من الصرف'], 'study', 'high'],
      [['عربي | أسلوبا المدح والذم ونائب الفاعل', 'عربي | أسلوبا المدح والذم ونائب الفاعل'], 'study', 'med'],
      [['عربي | البلاغة: المحسنات اللفظية والمعنوية', 'عربي | البلاغة: المحسنات اللفظية والمعنوية'], 'study', 'high'],
      [['عربي | البلاغة: الصور البيانية والتشبيه والاستعارة', 'عربي | البلاغة: الصور البيانية والتشبيه والاستعارة'], 'study', 'high'],
      [['عربي | القصة: حكايات الغريب — قراءة ومراجعة الفصول المقررة', 'عربي | القصة: حكايات الغريب — قراءة ومراجعة الفصول المقررة'], 'study', 'med'],
      [['عربي | حل تدريبات ومراجعة على الوحدة الأولى', 'عربي | حل تدريبات ومراجعة على الوحدة الأولى'], 'study', 'high'],
      [['عربي | حل تدريبات ومراجعة على الوحدة الثانية', 'عربي | حل تدريبات ومراجعة على الوحدة الثانية'], 'study', 'high'],
      [['عربي | حل تدريبات ومراجعة على الوحدة الثالثة', 'عربي | حل تدريبات ومراجعة على الوحدة الثالثة'], 'study', 'high'],
      [['عربي | اختبار شامل: النصوص والنحو والبلاغة والقصة', 'عربي | اختبار شامل: النصوص والنحو والبلاغة والقصة'], 'study', 'med'],
      [['إنجليزي | Unit 1.1: Social Media and Self-Image', 'إنجليزي | Unit 1.1: Social Media and Self-Image'], 'study', 'urgent'],
      [['إنجليزي | Unit 1.2: Exploring Modern Lifestyle — اليقظة الذهنية', 'إنجليزي | Unit 1.2: Exploring Modern Lifestyle — اليقظة الذهنية'], 'study', 'high'],
      [['إنجليزي | Unit 1.3: Whose Responsibility Is It? — المسؤولية المشتركة', 'إنجليزي | Unit 1.3: Whose Responsibility Is It? — المسؤولية المشتركة'], 'study', 'high'],
      [['إنجليزي | Unit 1.4: Understanding Mental Health + Story Chapter 1', 'إنجليزي | Unit 1.4: Understanding Mental Health + Story Chapter 1'], 'study', 'high'],
      [['إنجليزي | Unit 2.1: Screen Time and Young People', 'إنجليزي | Unit 2.1: Screen Time and Young People'], 'study', 'high'],
      [['إنجليزي | Unit 2.2: Creative Arts as Leisure Activities', 'إنجليزي | Unit 2.2: Creative Arts as Leisure Activities'], 'study', 'med'],
      [['إنجليزي | Unit 2.3: Sport and Physical Activity as Leisure', 'إنجليزي | Unit 2.3: Sport and Physical Activity as Leisure'], 'study', 'med'],
      [['إنجليزي | Unit 2.4: Not Exactly a Relaxing Day + Story Chapter 2', 'إنجليزي | Unit 2.4: Not Exactly a Relaxing Day + Story Chapter 2'], 'study', 'high'],
      [['إنجليزي | Unit 3.1: Sites of Memory', 'إنجليزي | Unit 3.1: Sites of Memory'], 'study', 'med'],
      [['إنجليزي | Unit 3.2: The Museum as a Storyteller', 'إنجليزي | Unit 3.2: The Museum as a Storyteller'], 'study', 'med'],
      [['إنجليزي | Unit 3.3: The Viral Past', 'إنجليزي | Unit 3.3: The Viral Past'], 'study', 'med'],
      [['إنجليزي | Unit 3.4: Social Media and Historical Events', 'إنجليزي | Unit 3.4: Social Media and Historical Events'], 'study', 'med'],
      [['إنجليزي | Grammar: If conditionals 0, 1, 2, 3 and Mixed', 'إنجليزي | Grammar: If conditionals 0, 1, 2, 3 and Mixed'], 'study', 'urgent'],
      [['إنجليزي | Grammar: Unless and In case', 'إنجليزي | Grammar: Unless and In case'], 'study', 'high'],
      [['إنجليزي | Grammar: Relative Clauses and participle reduction', 'إنجليزي | Grammar: Relative Clauses and participle reduction'], 'study', 'high'],
      [['إنجليزي | Grammar: Gerunds and Infinitives', 'إنجليزي | Grammar: Gerunds and Infinitives'], 'study', 'high'],
      [['إنجليزي | مراجعة مفردات الوحدات وحل التدريبات', 'إنجليزي | مراجعة مفردات الوحدات وحل التدريبات'], 'study', 'high'],
      [['إنجليزي | اختبار شامل على الوحدات والقواعد والقصة', 'إنجليزي | اختبار شامل على الوحدات والقواعد والقصة'], 'study', 'med'],
      [['تاريخ | الوحدة الأولى — الدرس 1: بناء الدولة المصرية واستمرارها عبر التاريخ', 'تاريخ | الوحدة الأولى — الدرس 1: بناء الدولة المصرية واستمرارها عبر التاريخ'], 'study', 'urgent'],
      [['تاريخ | الوحدة الأولى — الدرس 2: الدولة المصرية القديمة ومقاومة الاحتلال', 'تاريخ | الوحدة الأولى — الدرس 2: الدولة المصرية القديمة ومقاومة الاحتلال'], 'study', 'high'],
      [['تاريخ | الوحدة الأولى — الدرس 3: التحولات الكبرى في مصر (العصر الوسيط)', 'تاريخ | الوحدة الأولى — الدرس 3: التحولات الكبرى في مصر (العصر الوسيط)'], 'study', 'high'],
      [['تاريخ | الوحدة الأولى — الدرس 4: التحولات الكبرى في مصر (العصر الحديث)', 'تاريخ | الوحدة الأولى — الدرس 4: التحولات الكبرى في مصر (العصر الحديث)'], 'study', 'high'],
      [['تاريخ | الوحدة الثانية — الدرس 1: سياسات الاحتلال بمصر في العصر الحديث', 'تاريخ | الوحدة الثانية — الدرس 1: سياسات الاحتلال بمصر في العصر الحديث'], 'study', 'urgent'],
      [['تاريخ | الوحدة الثانية — الدرس 2: صمود الشعب المصري ومقاومة الاحتلال', 'تاريخ | الوحدة الثانية — الدرس 2: صمود الشعب المصري ومقاومة الاحتلال'], 'study', 'high'],
      [['تاريخ | الوحدة الثانية — الدرس 3: ثورة 23 يوليو والتحولات الكبرى في مصر', 'تاريخ | الوحدة الثانية — الدرس 3: ثورة 23 يوليو والتحولات الكبرى في مصر'], 'study', 'high'],
      [['تاريخ | الوحدة الثانية — الدرس 4: الهوية الوطنية في مواجهة الاستعمار الجديد', 'تاريخ | الوحدة الثانية — الدرس 4: الهوية الوطنية في مواجهة الاستعمار الجديد'], 'study', 'high'],
      [['تاريخ | الوحدة الثالثة — الدرس 1: حركات التحرر ضد الاحتلال الفرنسي والإيطالي في العالم العربي', 'تاريخ | الوحدة الثالثة — الدرس 1: حركات التحرر ضد الاحتلال الفرنسي والإيطالي في العالم العربي'], 'study', 'high'],
      [['تاريخ | الوحدة الثالثة — الدرس 2: حركات التحرر ضد الاحتلال البريطاني والإسباني في العالم العربي', 'تاريخ | الوحدة الثالثة — الدرس 2: حركات التحرر ضد الاحتلال البريطاني والإسباني في العالم العربي'], 'study', 'high'],
      [['تاريخ | الوحدة الثالثة — الدرس 3: مرتكزات الدور المصري إقليميًا ودوليًا', 'تاريخ | الوحدة الثالثة — الدرس 3: مرتكزات الدور المصري إقليميًا ودوليًا'], 'study', 'med'],
      [['تاريخ | الوحدة الثالثة — الدرس 4: دور مصر في دعم حركات التحرر الوطني', 'تاريخ | الوحدة الثالثة — الدرس 4: دور مصر في دعم حركات التحرر الوطني'], 'study', 'high'],
      [['تاريخ | مراجعة الجزء الأول: الوحدات 1–3 وحل الأسئلة', 'تاريخ | مراجعة الجزء الأول: الوحدات 1–3 وحل الأسئلة'], 'study', 'high'],
      [['تاريخ | الترم الثاني — الوحدة 4: الحربان العالميتان وتحولات النظام الدولي', 'تاريخ | الترم الثاني — الوحدة 4: الحربان العالميتان وتحولات النظام الدولي'], 'study', 'med'],
      [['تاريخ | الترم الثاني — الوحدة 5: القضية الفلسطينية', 'تاريخ | الترم الثاني — الوحدة 5: القضية الفلسطينية'], 'study', 'high'],
      [['تاريخ | الترم الثاني — الوحدة 6: السلام العالمي', 'تاريخ | الترم الثاني — الوحدة 6: السلام العالمي'], 'study', 'med'],
      [['تاريخ | مراجعة شاملة: الشخصيات والأحداث والأسباب والنتائج والتواريخ', 'تاريخ | مراجعة شاملة: الشخصيات والأحداث والأسباب والنتائج والتواريخ'], 'study', 'high'],
      [['تاريخ | اختبار شامل على الوحدات المقررة', 'تاريخ | اختبار شامل على الوحدات المقررة'], 'study', 'med'],
      [['برمجة وذكاء اصطناعي | 1-1 تطور تكنولوجيا المعلومات والتحول الاجتماعي', 'برمجة وذكاء اصطناعي | 1-1 تطور تكنولوجيا المعلومات والتحول الاجتماعي'], 'study', 'urgent'],
      [['برمجة وذكاء اصطناعي | 1-2 كيف يعمل الذكاء الاصطناعي (AI vs ML vs DL)', 'برمجة وذكاء اصطناعي | 1-2 كيف يعمل الذكاء الاصطناعي (AI vs ML vs DL)'], 'study', 'high'],
      [['برمجة وذكاء اصطناعي | 1-3 الذكاء الاصطناعي في الحياة اليومية والصناعة', 'برمجة وذكاء اصطناعي | 1-3 الذكاء الاصطناعي في الحياة اليومية والصناعة'], 'study', 'high'],
      [['برمجة وذكاء اصطناعي | 1-4 القضايا الأخلاقية للذكاء الاصطناعي: التحيز والصندوق الأسود والهلوسة', 'برمجة وذكاء اصطناعي | 1-4 القضايا الأخلاقية للذكاء الاصطناعي: التحيز والصندوق الأسود والهلوسة'], 'study', 'high'],
      [['برمجة وذكاء اصطناعي | 2-1 تقنيات التشفير والمصادقة', 'برمجة وذكاء اصطناعي | 2-1 تقنيات التشفير والمصادقة'], 'study', 'urgent'],
      [['برمجة وذكاء اصطناعي | 2-2 تصميم أمن الشبكات', 'برمجة وذكاء اصطناعي | 2-2 تصميم أمن الشبكات'], 'study', 'high'],
      [['برمجة وذكاء اصطناعي | 2-3 الاستجابة للحوادث وإدارة المخاطر', 'برمجة وذكاء اصطناعي | 2-3 الاستجابة للحوادث وإدارة المخاطر'], 'study', 'high'],
      [['برمجة وذكاء اصطناعي | 3-1 البنية العامة لتطبيقات الويب', 'برمجة وذكاء اصطناعي | 3-1 البنية العامة لتطبيقات الويب'], 'study', 'high'],
      [['برمجة وذكاء اصطناعي | 3-2 طرق الاتصال في تطبيقات الويب', 'برمجة وذكاء اصطناعي | 3-2 طرق الاتصال في تطبيقات الويب'], 'study', 'high'],
      [['برمجة وذكاء اصطناعي | 3-3 أساسيات تكنولوجيا الواجهة الأمامية Frontend', 'برمجة وذكاء اصطناعي | 3-3 أساسيات تكنولوجيا الواجهة الأمامية Frontend'], 'study', 'high'],
      [['برمجة وذكاء اصطناعي | 4-1 أنواع الوسائط وخصائصها', 'برمجة وذكاء اصطناعي | 4-1 أنواع الوسائط وخصائصها'], 'study', 'med'],
      [['برمجة وذكاء اصطناعي | 4-2 تصميم المعلومات وتجربة المستخدم UX', 'برمجة وذكاء اصطناعي | 4-2 تصميم المعلومات وتجربة المستخدم UX'], 'study', 'high'],
      [['برمجة وذكاء اصطناعي | 4-3 أساليب تقييم المواقع الإلكترونية', 'برمجة وذكاء اصطناعي | 4-3 أساليب تقييم المواقع الإلكترونية'], 'study', 'med'],
      [['برمجة وذكاء اصطناعي | 4-4 عملية التحسين التكراري للمواقع', 'برمجة وذكاء اصطناعي | 4-4 عملية التحسين التكراري للمواقع'], 'study', 'high'],
      [['برمجة وذكاء اصطناعي | 5-1 طرق جمع البيانات', 'برمجة وذكاء اصطناعي | 5-1 طرق جمع البيانات'], 'study', 'high'],
      [['برمجة وذكاء اصطناعي | 5-2 تنقية البيانات وتحويلها', 'برمجة وذكاء اصطناعي | 5-2 تنقية البيانات وتحويلها'], 'study', 'high'],
      [['برمجة وذكاء اصطناعي | 5-3 البيانات المفتوحة وواجهات برمجة التطبيقات APIs', 'برمجة وذكاء اصطناعي | 5-3 البيانات المفتوحة وواجهات برمجة التطبيقات APIs'], 'study', 'high'],
      [['برمجة وذكاء اصطناعي | 6-1 الاستدلال الإحصائي', 'برمجة وذكاء اصطناعي | 6-1 الاستدلال الإحصائي'], 'study', 'high'],
      [['برمجة وذكاء اصطناعي | 6-2 استخدام تحليل الانحدار وتقييمه', 'برمجة وذكاء اصطناعي | 6-2 استخدام تحليل الانحدار وتقييمه'], 'study', 'high'],
      [['برمجة وذكاء اصطناعي | 6-3 تمثيل البيانات المرئي والتواصل', 'برمجة وذكاء اصطناعي | 6-3 تمثيل البيانات المرئي والتواصل'], 'study', 'high'],
      [['برمجة وذكاء اصطناعي | 7-1 أساسيات التعلم الآلي', 'برمجة وذكاء اصطناعي | 7-1 أساسيات التعلم الآلي'], 'study', 'urgent'],
      [['برمجة وذكاء اصطناعي | 7-2 الشبكات العصبية والتعلم العميق', 'برمجة وذكاء اصطناعي | 7-2 الشبكات العصبية والتعلم العميق'], 'study', 'high'],
      [['برمجة وذكاء اصطناعي | 7-3 نماذج اللغة الكبيرة والذكاء الاصطناعي التوليدي', 'برمجة وذكاء اصطناعي | 7-3 نماذج اللغة الكبيرة والذكاء الاصطناعي التوليدي'], 'study', 'high'],
      [['برمجة وذكاء اصطناعي | تطبيق عملي ومراجعة شاملة للفصول السبعة', 'برمجة وذكاء اصطناعي | تطبيق عملي ومراجعة شاملة للفصول السبعة'], 'study', 'high'],
      [['برمجة وذكاء اصطناعي | اختبار شامل على الدروس الـ23', 'برمجة وذكاء اصطناعي | اختبار شامل على الدروس الـ23'], 'study', 'med'],
    ],
    habits: [
      [['Read Arabic daily', 'قراءة عربي يوميًا'], '📖', '#7c3aed'],
      [['Practice English daily', 'تدريب إنجليزي يوميًا'], '🇬🇧', '#2563eb'],
      [['Review history timeline', 'مراجعة خط زمني للتاريخ'], '🏛️', '#d97706'],
      [['Code a little every day', 'كتابة كود يوميًا'], '💻', '#059669'],
    ],
    goal: [['Complete the Engineering Track study plan', 'إنهاء خطة مذاكرة مسار الهندسة'], 100, [['Arabic units, grammar and rhetoric completed', 'إنهاء وحدات العربي والنحو والبلاغة'], ['English Units 1–3 and grammar completed', 'إنهاء وحدات الإنجليزي 1–3 والقواعد'], ['History Part 1 and Term 2 units reviewed', 'مراجعة الجزء الأول ووحدات الترم الثاني تاريخ'], ['All 23 Programming and AI lessons completed', 'إنهاء دروس البرمجة والذكاء الاصطناعي الـ23']]],
  },
  student: { label: ['Student', 'طالب'], icon: '🎓',
    tasks: [[['Review today’s lecture notes', 'مراجعة ملاحظات محاضرة اليوم'], 'study', 'high'], [['Finish assignment draft', 'إنهاء مسودة الواجب'], 'study', 'urgent'], [['Plan the weekly study schedule', 'تخطيط جدول المذاكرة الأسبوعي'], 'personal', 'med']],
    habits: [[['Study for 1 hour', 'مذاكرة ساعة'], '📚', '#7c3aed'], [['Drink water', 'شرب الماء'], '💧', '#06b6d4']],
    goal: [['Finish the semester strong', 'إنهاء الفصل بتفوق'], 100, [['Midterms done', 'إنهاء الميدتيرم'], ['Projects submitted', 'تسليم المشاريع'], ['Final exams', 'الامتحانات النهائية']]] },
  employee: { label: ['Employee', 'موظف'], icon: '💼',
    tasks: [[['Reply to pending emails', 'الرد على الإيميلات المعلقة'], 'work', 'med'], [['Prepare the weekly report', 'تجهيز التقرير الأسبوعي'], 'work', 'high'], [['Pick top 3 priorities for the week', 'تحديد أهم 3 أولويات للأسبوع'], 'work', 'med']],
    habits: [[['Plan the day each morning', 'تخطيط اليوم كل صباح'], '✍️', '#3b82f6'], [['Walk 20 minutes', 'المشي 20 دقيقة'], '🏃', '#10b981']],
    goal: [['Hit the quarterly objective', 'تحقيق هدف الربع'], 100, [['Kickoff done', 'بدء التنفيذ'], ['Mid-quarter review', 'مراجعة منتصف الربع'], ['Delivered', 'التسليم']]] },
  freelancer: { label: ['Freelancer', 'فريلانسر'], icon: '🧑‍💻',
    tasks: [[['Send a proposal to a new client', 'إرسال عرض لعميل جديد'], 'work', 'high'], [['Invoice finished work', 'إصدار فاتورة للعمل المنتهي'], 'work', 'urgent'], [['Add a recent project to the portfolio', 'إضافة مشروع حديث للبورتفوليو'], 'personal', 'med']],
    habits: [[['2-hour deep work block', 'جلسة عمل عميق ساعتين'], '💻', '#7c3aed'], [['Reach out to one lead', 'التواصل مع عميل محتمل'], '📨', '#f59e0b']],
    goal: [['Land 3 new clients', 'الحصول على 3 عملاء جدد'], 3, [['First reply', 'أول رد'], ['Call booked', 'حجز مكالمة'], ['Contract signed', 'توقيع العقد']]] },
};
const EXTRA: Record<string, { task: [L, string, Priority]; habit: [L, string, string] }> = {
  focus: { task: [['Run your first focus session', 'ابدأ أول جلسة تركيز'], 'personal', 'med'], habit: [['One 25-minute focus session', 'جلسة تركيز 25 دقيقة'], '🎯', '#f43f5e'] },
  consistency: { task: [['Pick one habit to track daily', 'اختر عادة واحدة لتتبعها يوميًا'], 'personal', 'med'], habit: [['Daily check-in', 'مراجعة يومية'], '✅', '#10b981'] },
  planning: { task: [['Plan tomorrow tonight', 'خطط ليوم الغد الليلة'], 'personal', 'med'], habit: [['Evening review', 'مراجعة المساء'], '🌙', '#3b82f6'] },
};
const mkTask = (title: string, category: string, priority: Priority, dueDate?: string): Task => ({ id: uid(), title, description: '', priority, category, dueDate, completed: false, createdAt: new Date().toISOString() });
const mkHabit = (name: string, icon: string, color: string): Habit => ({ id: uid(), name, icon, color, streak: 0, completions: [] });
const E: Data = { tasks: [], habits: [], goals: [], notes: [], sessions: [] };

export function buildTemplate(key: string, lang: string): Data {
  const t = TPL[key], today = dkey();
  return { ...E, tasks: t.tasks.map(([n, c, p], i) => mkTask(pick(n, lang), c, p, i < 2 ? today : undefined)), habits: t.habits.map(([n, i, c]) => mkHabit(pick(n, lang), i, c)),
    goals: [{ id: uid(), title: pick(t.goal[0], lang), target: t.goal[1], current: 0, milestones: t.goal[2].map((m) => ({ id: uid(), title: pick(m, lang), done: false })) }] };
}
export function buildExtra(kind: string, lang: string): Data {
  const x = EXTRA[kind]; if (!x) return E;
  return { ...E, tasks: [mkTask(pick(x.task[0], lang), x.task[1], x.task[2], dkey())], habits: [mkHabit(pick(x.habit[0], lang), x.habit[1], x.habit[2])] };
}

export function buildSample(lang: string): Data {
  const r = (i: number) => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
  const now = new Date(), ago = (d: number, h = 10) => { const x = subDays(now, d); x.setHours(h, 0, 0, 0); return x.toISOString(); };
  const names: L[] = [['Finish project report', 'إنهاء تقرير المشروع'], ['Study chapter 4', 'مذاكرة الفصل الرابع'], ['Gym session', 'تمرين الجيم'], ['Pay electricity bill', 'دفع فاتورة الكهرباء'], ['Call the client', 'الاتصال بالعميل'], ['Clean the workspace', 'ترتيب مساحة العمل'], ['Read 30 pages', 'قراءة 30 صفحة'], ['Plan next week', 'تخطيط الأسبوع القادم'], ['Update CV', 'تحديث السيرة الذاتية'], ['Buy groceries', 'شراء احتياجات المنزل'], ['Prepare presentation', 'تجهيز العرض'], ['Reply to messages', 'الرد على الرسائل']];
  const pr: Priority[] = ['high', 'med', 'low', 'urgent'], cats = ['work', 'study', 'personal', 'health'];
  const tasks: Task[] = names.map((n, i) => {
    const done = i < 8, d = Math.floor(r(i) * 50) + 1;
    return { id: `demo_t${i}`, title: pick(n, lang), description: '', priority: pr[i % 4], category: cats[i % 4], completed: done, createdAt: ago(d + 2), completedAt: done ? ago(d) : undefined, dueDate: done ? undefined : dkey(subDays(now, i === 8 ? 1 : i === 9 ? 0 : -(i - 9))) };
  });
  const hs: [L, string, string, number][] = [[['Study 1 hour', 'مذاكرة ساعة'], '📚', '#7c3aed', 0.85], [['Workout', 'تمرين'], '💪', '#10b981', 0.65], [['Read', 'قراءة'], '📖', '#f59e0b', 0.45]];
  const habits: Habit[] = hs.map(([n, ic, c, p], h) => {
    const comp = Array.from({ length: 180 }, (_, d) => d).filter((d) => (h === 0 && d < 14) || r(h * 1000 + d) < p).map((d) => dkey(subDays(now, d)));
    return { id: `demo_h${h}`, name: pick(n, lang), icon: ic, color: c, completions: comp, streak: calcStreak(comp) };
  });
  const gs: [L, number, number, L[]][] = [[['Save 5000', 'ادخار 5000'], 5000, 3200, [['First 1000', 'أول 1000'], ['Half way', 'نصف المبلغ'], ['Goal reached', 'تحقيق الهدف']]], [['Read 12 books', 'قراءة 12 كتاب'], 12, 7, [['3 books', '3 كتب'], ['6 books', '6 كتب'], ['12 books', '12 كتاب']]], [['Learn React', 'تعلم React'], 100, 45, [['Basics', 'الأساسيات'], ['First app', 'أول تطبيق'], ['Deploy', 'النشر']]]];
  const goals = gs.map(([n, target, current, ms], i) => ({ id: `demo_g${i}`, title: pick(n, lang), target, current, milestones: ms.map((m, j) => ({ id: `demo_m${i}${j}`, title: pick(m, lang), done: (current / target) * 3 > j })) }));
  const notes = [{ id: 'demo_n0', title: pick(['Ideas', 'أفكار'], lang), content: '# Ideas\n- Weekly review\n- **Deep work** mornings', pinned: true, tags: ['ideas'], updatedAt: ago(1) }, { id: 'demo_n1', title: pick(['Meeting notes', 'ملاحظات اجتماع'], lang), content: '## Notes\n1. Follow up\n2. Send summary', pinned: false, tags: ['work'], updatedAt: ago(3) }];
  const sessions = Array.from({ length: 21 }, (_, d) => d).flatMap((d) => Array.from({ length: d === 0 ? 2 : Math.floor(r(d + 7) * 4) + 1 }, (_, k) => ({ id: `demo_s${d}_${k}`, duration: 25, completedAt: ago(d, 9 + k * 2) })));
  return { tasks, habits, goals, notes, sessions };
}
