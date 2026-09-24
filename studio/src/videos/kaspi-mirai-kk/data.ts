// Данные ролика. Всё, что видно на экранах, — выдумано: настоящие ИИН и ФИО с фотографий владельца
// не переносятся (videos/kaspi-mirai-kk/research.md).
export const FPS = 60;
export const DURATION = 2040; // 34 с

// Экран рисуется в точках iOS и увеличивается в кадр множителем SCALE.
export const PT_W = 393, PT_H = 852;
export const SCALE = 1440 / PT_W;
export const VIEW_PT = 2560 / SCALE; // сколько точек экрана влезает в кадр по высоте

export const SCHOOL = {name: '«Mirai School» на Аскарова', addr: 'г. Алматы, ул. Аскарова, 4А', city: 'Алматы'};

export const PUPIL = {
  name: 'ЕРБОЛАТ АЙША НҰРЛАНҚЫЗЫ',
  iin: '1203-1560-0142',
  grade: '4',
  period: 'Қазан',
  payer: 'Ерболатов Нұрлан Серікұлы',
  payerIin: '8506-2130-0157',
  sum: '350 000 ₸',
};

export const SEARCH_QUERY = 'Mirai School на Аскарова';

// Цвета интерфейса — со снимков владельца.
export const UI = {
  page: '#F2F2F7', field: '#E9E9EB', fieldDeep: '#E3E3E8', white: '#FFFFFF',
  ink: '#000000', dim: '#8A8A8E', line: 'rgba(60,60,67,.20)',
  red: '#F14635', blue: '#1266CC', green: '#24B24C', yellow: '#FFD400',
};

// Палитра студии — для подписей поверх экрана.
export const ONAI = {ink: '#0B0D10', text: '#F2F3F5', dim: '#B6BDC6', mint: '#3DEDC3', mintInk: '#05231D'};

export type Step = {
  from: number; to: number;      // кадры
  n: number | null;              // номер шага в капсуле
  title: string;                 // подпись на казахском
  hints: string[];               // мелкие подсказки под подписью
  captionTop: boolean;           // капсула наверху вместо низа
};

export const STEPS: Step[] = [
  {from: 156, to: 468, n: 1, title: 'Kaspi.kz-ті ашып, «Платежи» бөлімін басыңыз', hints: [], captionTop: false},
  {from: 468, to: 756, n: 2, title: 'Іздеу жолағын басыңыз', hints: ['«Что хотите оплатить?»'], captionTop: false},
  {from: 756, to: 1068, n: 3, title: '«Mirai School на Аскарова» деп теріңіз', hints: [], captionTop: false},
  {from: 1068, to: 1584, n: 4, title: 'Оқушының аты-жөнін, ЖСН-ін және сыныбын жазыңыз',
    hints: ['ЖСН — 12 сан', 'Төлеушінің деректері өзі толады'], captionTop: false},
  {from: 1584, to: 1884, n: 5, title: 'Соманы тексеріп, «К оплате» батырмасын басыңыз',
    hints: ['Кезең — төленетін ай'], captionTop: true},
];

export const HOOK = 'Мектеп төлемі — Kaspi-де бар болғаны 5 қадам';
export const OUTRO = 'Болды! Осылай ай сайын төлейсіз';
export const CTA = 'Бұл нұсқаулықты сақтап қойыңыз';

// Ключевые моменты, кадры.
export const T = {
  hookEnd: 156,
  tapPayments: 414,   // 6,9 с — касание плитки «Платежи»
  tapSearch: 702,     // 11,7 с — касание строки поиска
  typeFrom: 792, typeTo: 960,  // 13,2–16,0 с — набор запроса
  resultAt: 876,      // 14,6 с — школа находится прямо во время набора, как в жизни
  tapResult: 1050,    // 17,5 с — касание результата
  payerGlow: 1152,    // 19,2 с — подсветка полей плательщика
  nameFrom: 1200, nameTo: 1332,
  iinFrom: 1356, iinTo: 1476,
  gradeFrom: 1500, gradeTo: 1536,
  panDown: 1476,      // камера пошла вниз
  periodFlash: 1644,  // 27,4 с
  sumFlash: 1704,     // 28,4 с
  tapPay: 1812,       // 30,2 с
  outroAt: 1884,
  ctaAt: 1968,
};

// Ход камеры по экрану, в точках.
export const CAM = [
  {at: 0, y: 0},
  {at: T.panDown, y: 0},
  {at: T.panDown + 72, y: 60},
  {at: 1584, y: 60},
  {at: 1644, y: PT_H - VIEW_PT},
];
