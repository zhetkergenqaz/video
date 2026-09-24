import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {useFit} from '../../ds';
import {PUPIL, SCHOOL, T, UI} from './data';
import {BarcodeIcon, Chevron, HomeBar, Keyboard, NavBar, SearchIcon, ShareIcon, StatusBar} from './ios';

// Пять экранов Kaspi.kz, перерисованных начисто по фотографиям владельца (videos/kaspi-mirai-kk/media).
// Рук, комнаты и бликов нет. Все данные ученика и плательщика выдуманы.
const F = 'Inter Tight';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Page: React.FC<{children: React.ReactNode; bg?: string}> = ({children, bg = UI.page}) => (
  <div style={{position: 'absolute', inset: 0, background: bg, display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
    {children}
  </div>
);

// Текст, который набирается по буквам, с мигающей кареткой.
export const typed = (text: string, frame: number, from: number, to: number) => {
  const n = Math.round(interpolate(frame, [from, to], [0, text.length], {...clamp}));
  return text.slice(0, n);
};
const Caret: React.FC<{frame: number; h?: number}> = ({frame, h = 20}) => (
  <span style={{display: 'inline-block', width: 2, height: h, background: UI.blue, marginLeft: 1,
    verticalAlign: 'text-bottom', opacity: Math.sin(frame / 5) > -0.2 ? 1 : 0}} />
);

// ───────────────────────── 1. Главная Kaspi.kz

const Tile: React.FC<{label: string; icon: React.ReactNode; badge?: string}> = ({label, icon, badge}) => (
  <div style={{width: 90, display: 'grid', justifyItems: 'center', gap: 6}}>
    <div style={{position: 'relative', width: 42, height: 42, display: 'grid', placeItems: 'center'}}>
      {icon}
      {badge ? (
        <span style={{position: 'absolute', top: -4, right: -12, background: UI.yellow, color: UI.ink, fontFamily: F,
          fontSize: 8, fontWeight: 800, borderRadius: 3, padding: '1px 3px'}}>{badge}</span>
      ) : null}
    </div>
    <span style={{fontFamily: F, fontSize: 11.5, fontWeight: 500, color: UI.ink}}>{label}</span>
  </div>
);

// Иконки — компоненты, а не готовые элементы: сборщик компилирует JSX в React.createElement,
// и на уровне модуля React ещё не определён (грабля этого репозитория).
const R = UI.red;
const IcoCart: React.FC = () => <svg width={34} height={34} viewBox="0 0 34 34"><path d="M4 6h5l4.4 15h13.2l3.4-10H11" stroke={R} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /><circle cx={14} cy={27} r={2.6} fill={R} /><circle cx={25} cy={27} r={2.6} fill={R} /></svg>;
const IcoBank: React.FC = () => <svg width={34} height={34} viewBox="0 0 34 34"><rect x={4} y={8} width={26} height={18} rx={3.4} stroke={R} strokeWidth={2.4} fill="none" /><path d="M4 14h26" stroke={R} strokeWidth={2.4} /><rect x={8} y={18} width={8} height={3} rx={1.5} fill={R} /></svg>;
const IcoPay: React.FC = () => <svg width={34} height={34} viewBox="0 0 34 34"><path d="M7 4h20v26l-4-2.6L19 30l-4-2.6L11 30l-4-2.6Z" stroke={R} strokeWidth={2.4} fill="none" strokeLinejoin="round" /><path d="M12 12h10M12 18h10" stroke={R} strokeWidth={2.4} strokeLinecap="round" /></svg>;
const IcoSend: React.FC = () => <svg width={34} height={34} viewBox="0 0 34 34"><path d="M6 11h20l-5-5M28 21H8l5 5" stroke={R} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const IcoMagnum: React.FC = () => <div style={{width: 34, height: 34, borderRadius: 8, background: R, display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 20, fontWeight: 800, color: '#fff'}}>m</div>;
const IcoTravel: React.FC = () => <svg width={34} height={34} viewBox="0 0 34 34"><path d="M3 20h24a3.4 3.4 0 0 0 0-6.8h-3l-5-6h-4l2.6 6H9l-2.6-3H3l2 6Z" fill={R} /><path d="M3 26h28" stroke={R} strokeWidth={2.2} strokeLinecap="round" /></svg>;
const IcoGov: React.FC = () => <svg width={34} height={34} viewBox="0 0 34 34"><path d="M17 4 4 11h26Z" fill={R} /><path d="M8 13v12M14 13v12M20 13v12M26 13v12" stroke={R} strokeWidth={2.4} strokeLinecap="round" /><path d="M4 28h26" stroke={R} strokeWidth={2.4} strokeLinecap="round" /></svg>;
const IcoWork: React.FC = () => <svg width={34} height={34} viewBox="0 0 34 34"><rect x={4} y={10} width={26} height={18} rx={3} stroke={R} strokeWidth={2.4} fill="none" /><path d="M12 10V7h10v3" stroke={R} strokeWidth={2.4} fill="none" strokeLinecap="round" /><circle cx={24} cy={24} r={4.6} stroke={R} strokeWidth={2.2} fill="none" /><path d="M27.4 27.4 30 30" stroke={R} strokeWidth={2.2} strokeLinecap="round" /></svg>;

const PromoRow: React.FC<{badge: string; badgeBg: string; text: string}> = ({badge, badgeBg, text}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 7, minWidth: 0}}>
    <span style={{background: badgeBg, color: UI.ink, fontFamily: F, fontSize: 9.5, fontWeight: 800, borderRadius: 3,
      padding: '2px 4px', flex: 'none'}}>{badge}</span>
    <span style={{fontFamily: F, fontSize: 12.5, fontWeight: 500, color: UI.ink, whiteSpace: 'nowrap', overflow: 'hidden'}}>{text}</span>
  </div>
);

const Product: React.FC<{name: string; price: string; bonus: string; bonusBadge: string; rating: string}> =
  ({name, price, bonus, bonusBadge, rating}) => (
    <div style={{width: 84, flex: 'none'}}>
      <div style={{position: 'relative', height: 84, borderRadius: 8, border: `1px solid ${UI.line}`,
        background: 'linear-gradient(160deg,#FBFBFD 0%,#E4E5EA 100%)'}}>
        <span style={{position: 'absolute', left: 4, bottom: 4, background: '#E6F6E9', color: '#1E7A34', fontFamily: F,
          fontSize: 8, fontWeight: 700, borderRadius: 3, padding: '1px 3px'}}>{bonusBadge}</span>
      </div>
      <div style={{fontFamily: F, fontSize: 12, fontWeight: 700, color: UI.ink, marginTop: 5}}>{price}</div>
      <div style={{fontFamily: F, fontSize: 9, fontWeight: 600, color: '#1E7A34', background: '#E6F6E9', borderRadius: 3,
        padding: '1px 3px', display: 'inline-block', marginTop: 2}}>{bonus}</div>
      <div style={{fontFamily: F, fontSize: 10, color: UI.ink, marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden'}}>{name}</div>
      <div style={{fontFamily: F, fontSize: 10, color: UI.dim, marginTop: 1}}>{rating}</div>
    </div>
  );

const TabBar: React.FC<{active: number}> = ({active}) => {
  const items = ['Главная', 'Kaspi QR', 'Сообщения', 'Сервисы'];
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 62, background: 'rgba(255,255,255,.96)',
      borderTop: `1px solid ${UI.line}`, display: 'flex', paddingTop: 7, boxSizing: 'border-box'}}>
      {items.map((t, i) => (
        <div key={t} style={{flex: 1, display: 'grid', justifyItems: 'center', gap: 3, position: 'relative'}}>
          <div style={{width: 22, height: 22, borderRadius: i === 1 ? 4 : 0,
            border: i === 1 ? `2px solid ${i === active ? R : UI.dim}` : 'none',
            background: i === 1 ? 'transparent' : i === active ? R : UI.dim,
            clipPath: i === 0 ? 'polygon(50% 0,100% 45%,100% 100%,0 100%,0 45%)' : i === 3 ? 'none' : undefined,
            opacity: i === 3 ? 0 : 1}} />
          {i === 3 ? (
            <svg width={22} height={22} viewBox="0 0 22 22" style={{position: 'absolute', top: 0}}>
              {[5, 11, 17].map((y) => <rect key={y} x={2} y={y - 1} width={18} height={2} rx={1} fill={UI.dim} />)}
            </svg>
          ) : null}
          {i === 2 ? (
            <span style={{position: 'absolute', top: -3, right: 22, background: R, color: '#fff', fontFamily: F,
              fontSize: 8.5, fontWeight: 700, borderRadius: 99, padding: '1px 4px'}}>22</span>
          ) : null}
          <span style={{fontFamily: F, fontSize: 10, fontWeight: 500, color: i === active ? R : UI.dim}}>{t}</span>
        </div>
      ))}
    </div>
  );
};

export const MainScreen: React.FC = () => (
  <Page>
    <StatusBar time="15:06" />
    {/* поиск и корзина */}
    <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', height: 42, flex: 'none'}}>
      <div style={{flex: 1, height: 34, borderRadius: 9, background: UI.field, display: 'flex', alignItems: 'center',
        gap: 7, padding: '0 10px', boxSizing: 'border-box'}}>
        <SearchIcon />
        <span style={{fontFamily: F, fontSize: 14, color: UI.dim}}>Поиск по Kaspi.kz</span>
      </div>
      <div style={{position: 'relative'}}>
        <svg width={24} height={24} viewBox="0 0 34 34"><path d="M4 6h5l4.4 15h13.2l3.4-10H11" stroke={UI.ink} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /><circle cx={14} cy={27} r={2.6} fill={UI.ink} /><circle cx={25} cy={27} r={2.6} fill={UI.ink} /></svg>
        <span style={{position: 'absolute', top: -3, right: -4, background: R, color: '#fff', fontFamily: F, fontSize: 8.5,
          fontWeight: 700, borderRadius: 99, padding: '0 3.4px'}}>1</span>
      </div>
    </div>
    {/* баннер */}
    <div style={{margin: '8px 16px 0', height: 84, borderRadius: 10, background: '#111214', position: 'relative',
      overflow: 'hidden', flex: 'none'}}>
      <div style={{position: 'absolute', left: 14, top: 12, fontFamily: F, fontSize: 17, fontWeight: 800, color: '#fff'}}>iPhone 18 Pro</div>
      <div style={{position: 'absolute', left: 14, top: 38, background: UI.yellow, color: UI.ink, fontFamily: F,
        fontSize: 12, fontWeight: 800, borderRadius: 4, padding: '2px 5px'}}>0·0·24</div>
      <div style={{position: 'absolute', left: 14, bottom: 11, fontFamily: F, fontSize: 11, color: '#C9CBCF'}}>Доступен к предзаказу</div>
      <div style={{position: 'absolute', right: 14, top: 14, fontFamily: F, fontSize: 15, fontWeight: 800, color: '#8E1B22',
        letterSpacing: '1px'}}>PRO</div>
      <div style={{position: 'absolute', right: 14, bottom: 11, display: 'flex', gap: 3}}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <span key={i} style={{width: 3.4, height: 3.4, borderRadius: 99, background: i === 0 ? '#fff' : 'rgba(255,255,255,.35)'}} />
        ))}
      </div>
    </div>
    {/* плитки */}
    <div style={{display: 'flex', justifyContent: 'space-between', padding: '14px 8px 0', flex: 'none'}}>
      <Tile label="Магазин" icon={<IcoCart />} badge="0·0·24" />
      <Tile label="Мой Банк" icon={<IcoBank />} />
      <Tile label="Платежи" icon={<IcoPay />} />
      <Tile label="Переводы" icon={<IcoSend />} />
    </div>
    <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px 8px 0', flex: 'none'}}>
      <Tile label="Magnum" icon={<IcoMagnum />} />
      <Tile label="Travel" icon={<IcoTravel />} badge="0·0·24" />
      <Tile label="Госуслуги" icon={<IcoGov />} />
      <Tile label="Работа" icon={<IcoWork />} />
    </div>
    <div style={{height: 1, background: UI.line, margin: '14px 16px 0', flex: 'none'}} />
    <div style={{display: 'flex', gap: 14, padding: '12px 16px 0', flex: 'none'}}>
      <div style={{flex: 1, minWidth: 0}}><PromoRow badge="0·0·24" badgeBg={UI.yellow} text="Рассрочка 0-0-24" /></div>
      <div style={{flex: 1, minWidth: 0}}><PromoRow badge="0·0·12" badgeBg={UI.yellow} text="Рассро" /></div>
    </div>
    <div style={{display: 'flex', gap: 14, padding: '12px 16px 0', flex: 'none'}}>
      <div style={{flex: 1, minWidth: 0}}><PromoRow badge="₸" badgeBg="#CFF3D8" text="Кредит Наличными" /></div>
      <div style={{flex: 1, minWidth: 0}}><PromoRow badge="◎" badgeBg={UI.yellow} text="Накопи" /></div>
    </div>
    <div style={{fontFamily: F, fontSize: 11, color: UI.dim, padding: '4px 16px 0', flex: 'none'}}>до 2,2 млн ₸ на Kaspi Gold</div>
    <div style={{fontFamily: F, fontSize: 15, fontWeight: 700, color: UI.ink, padding: '16px 16px 10px', flex: 'none'}}>Вы недавно смотрели</div>
    <div style={{display: 'flex', gap: 10, padding: '0 16px', flex: 'none'}}>
      <Product name="Epson L1110" price="7 129 ₸" bonus="6 916 ₸ с Бонусами" bonusBadge="213 Б" rating="5.0 ★ (143)" />
      <Product name="TADS DS-636" price="7 972 ₸" bonus="7 733 ₸ с Бонусами" bonusBadge="239 Б" rating="5.0 ★ (5)" />
      <Product name="Термометр" price="394 ₸" bonus="382 ₸ с Бонусами" bonusBadge="12 Б" rating="4.6 ★ (157)" />
      <Product name="Органайзер" price="3 306 ₸" bonus="3 207 ₸ с Бонусами" bonusBadge="99 Б" rating="4.8 ★ (61)" />
    </div>
    <TabBar active={0} />
    <HomeBar />
  </Page>
);

// ───────────────────────── 2. Раздел «Платежи»

const DueRow: React.FC<{title: string; sub: string; sum: string}> = ({title, sub, sum}) => {
  const ref = useFit(`due:${title}`);
  return (
    <div ref={ref as never} style={{display: 'flex', gap: 11, padding: '11px 16px', alignItems: 'flex-start', boxSizing: 'border-box'}}>
      <div style={{width: 32, height: 32, borderRadius: 7, border: `1.6px solid ${UI.dim}`, flex: 'none',
        display: 'grid', placeItems: 'center'}}>
        <svg width={16} height={16} viewBox="0 0 16 16"><rect x={1} y={3} width={14} height={10} rx={2} stroke={UI.dim} strokeWidth={1.6} fill="none" /><path d="M4 7h4" stroke={UI.dim} strokeWidth={1.6} strokeLinecap="round" /></svg>
      </div>
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
          <span style={{fontFamily: F, fontSize: 14.5, fontWeight: 600, color: UI.ink}}>{title}</span>
          <span style={{background: R, color: '#fff', fontFamily: F, fontSize: 8, fontWeight: 800, borderRadius: 3, padding: '1px 3px'}}>NEW</span>
        </div>
        <div style={{fontFamily: F, fontSize: 11.5, color: UI.dim, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden'}}>{sub}</div>
        <div style={{fontFamily: F, fontSize: 14.5, fontWeight: 700, color: UI.ink, marginTop: 4}}>{sum}</div>
      </div>
      <span style={{fontFamily: F, fontSize: 18, color: UI.dim, letterSpacing: '1px', flex: 'none'}}>···</span>
    </div>
  );
};

export const PaymentsScreen: React.FC = () => (
  <Page>
    <StatusBar time="15:06" />
    <NavBar title="Платежи" right={<span style={{fontFamily: F, fontSize: 15, fontWeight: 600, color: UI.blue}}>Алматы</span>} />
    <div style={{display: 'flex', margin: '6px 16px 0', height: 32, borderRadius: 8, background: UI.field, padding: 2,
      boxSizing: 'border-box', flex: 'none'}}>
      {['Все', 'Мои платежи', 'История'].map((t, i) => (
        <div key={t} style={{flex: 1, borderRadius: 6, display: 'grid', placeItems: 'center',
          background: i === 1 ? UI.white : 'transparent', boxShadow: i === 1 ? '0 1px 3px rgba(0,0,0,.12)' : 'none',
          fontFamily: F, fontSize: 13, fontWeight: i === 1 ? 600 : 500, color: UI.ink}}>{t}</div>
      ))}
    </div>
    <div style={{margin: '12px 16px 0', height: 36, borderRadius: 9, background: UI.field, display: 'flex',
      alignItems: 'center', gap: 8, padding: '0 11px', boxSizing: 'border-box', flex: 'none'}}>
      <SearchIcon />
      <span style={{fontFamily: F, fontSize: 14.5, color: UI.dim}}>Что хотите оплатить?</span>
    </div>
    <div style={{margin: '12px 16px 0', borderRadius: 10, background: UI.white, padding: '12px 14px', position: 'relative',
      boxSizing: 'border-box', flex: 'none'}}>
      <div style={{fontFamily: F, fontSize: 13.5, fontWeight: 700, color: UI.ink, maxWidth: 250, lineHeight: 1.25}}>
        Автоплатеж за платные парковки и дороги с Kaspi Gold
      </div>
      <div style={{fontFamily: F, fontSize: 11.5, color: UI.dim, marginTop: 4, maxWidth: 250, lineHeight: 1.25}}>
        При выезде оплата будет списываться автоматически.
      </div>
      <div style={{fontFamily: F, fontSize: 12, fontWeight: 600, color: UI.blue, marginTop: 4}}>Подробнее</div>
      <div style={{position: 'absolute', right: 14, top: 26, width: 44, height: 34, borderRadius: 7,
        background: 'linear-gradient(160deg,#FFE9A8,#F6C445)'}} />
      <div style={{position: 'absolute', right: 8, top: 8, width: 16, height: 16, borderRadius: 99, background: UI.field,
        display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 10, color: UI.dim}}>✕</div>
    </div>
    <div style={{fontFamily: F, fontSize: 15, fontWeight: 700, color: UI.ink, padding: '16px 16px 4px', flex: 'none'}}>К оплате</div>
    <DueRow title="АЛСЕКО - квитанции" sub="г. Алматы, ул. Жандосова, д. 58, кв. 12" sum="12 480,00 ₸" />
    <div style={{height: 1, background: UI.line, margin: '0 16px 0 59px'}} />
    <DueRow title="Алматы Су - вода" sub="г. Алматы, ул. Жандосова, д. 58, кв. 12" sum="3 250,00 ₸" />
    <TabBar active={0} />
    <HomeBar />
  </Page>
);

// ───────────────────────── 3. Поиск

const CaseIcon: React.FC = () => (
  <svg width={22} height={22} viewBox="0 0 22 22">
    <rect x={2} y={6} width={18} height={12} rx={2.4} stroke={UI.dim} strokeWidth={1.8} fill="none" />
    <path d="M8 6V4h6v2" stroke={UI.dim} strokeWidth={1.8} fill="none" strokeLinecap="round" />
  </svg>
);

const HistRow: React.FC<{text: string}> = ({text}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 11, padding: '9px 16px', flex: 'none'}}>
    <svg width={18} height={18} viewBox="0 0 18 18" style={{flex: 'none'}}>
      <circle cx={9} cy={9} r={7} stroke={UI.dim} strokeWidth={1.6} fill="none" />
      <path d="M9 5v4.4l2.8 1.8" stroke={UI.dim} strokeWidth={1.6} fill="none" strokeLinecap="round" />
    </svg>
    <span style={{fontFamily: F, fontSize: 14.5, color: UI.ink}}>{text}</span>
  </div>
);

export const SearchScreen: React.FC<{query: string; showResult: boolean; caretFrame: number; kbBottom: number}> =
  ({query, showResult, caretFrame, kbBottom}) => (
    <Page bg={UI.white}>
      <StatusBar time="15:07" />
      <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', height: 42, flex: 'none'}}>
        <Chevron dir="left" size={22} color={UI.ink} weight={2.4} />
        <div style={{flex: 1, height: 34, borderRadius: 9, background: UI.field, display: 'flex', alignItems: 'center',
          gap: 7, padding: '0 10px', boxSizing: 'border-box'}}>
          <SearchIcon />
          <span style={{fontFamily: F, fontSize: 14, color: UI.ink, whiteSpace: 'nowrap', overflow: 'hidden'}}>
            {query}<Caret frame={caretFrame} h={16} />
          </span>
          <span style={{marginLeft: 'auto', width: 16, height: 16, borderRadius: 99, background: '#C4C4CA',
            display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 10, color: UI.white, flex: 'none'}}>✕</span>
        </div>
      </div>
      {showResult ? (
        <>
          <div style={{fontFamily: F, fontSize: 15, fontWeight: 700, color: UI.ink, padding: '12px 16px 6px', flex: 'none'}}>Платежи</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 11, padding: '8px 16px', flex: 'none'}}>
            <div style={{width: 40, height: 40, borderRadius: 9, background: UI.field, display: 'grid', placeItems: 'center', flex: 'none'}}>
              <CaseIcon />
            </div>
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{fontFamily: F, fontSize: 14.5, fontWeight: 600, color: UI.ink}}>{SCHOOL.name}</div>
              <div style={{fontFamily: F, fontSize: 11.5, color: UI.dim, marginTop: 2}}>{SCHOOL.addr}</div>
            </div>
            <Chevron />
          </div>
        </>
      ) : null}
      {/* недавние запросы стоят всегда: под результатом белой пустоты в кадре не остаётся */}
      <div style={{fontFamily: F, fontSize: 15, fontWeight: 700, color: UI.ink, padding: '14px 16px 4px', flex: 'none'}}>Вы недавно искали</div>
      <HistRow text="Коммунальные платежи" />
      <HistRow text="Детский сад" />
      <HistRow text="Мобильная связь" />
      <Keyboard bottom={kbBottom} />
    </Page>
  );

// ───────────────────────── 4–5. Форма школы

const Field: React.FC<{label: string; value?: string; sub?: string; grey?: boolean; icon?: React.ReactNode;
  chevron?: boolean; glow?: number; caret?: number; name: string}> =
  ({label, value, sub, grey, icon, chevron, glow = 0, caret, name}) => {
    const ref = useFit(`field:${name}`);
    return (
      <div ref={ref as never} style={{position: 'relative', margin: '0 16px 6px', borderRadius: 10, background: UI.field,
        padding: '9px 14px', boxSizing: 'border-box', minHeight: 56, display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: glow > 0 ? `0 0 0 ${2 * glow}px rgba(18,102,204,${0.45 * glow})` : 'none'}}>
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{fontFamily: F, fontSize: 11.5, color: UI.dim, lineHeight: 1.2}}>{label}</div>
          {value ? (
            <div style={{fontFamily: F, fontSize: 15.5, fontWeight: 500, color: grey ? '#6E6E73' : UI.ink, marginTop: 3,
              whiteSpace: 'nowrap', overflow: 'hidden', lineHeight: 1.2}}>
              {value}{caret === undefined ? null : <Caret frame={caret} h={17} />}
            </div>
          ) : null}
          {sub ? <div style={{fontFamily: F, fontSize: 11, color: UI.dim, marginTop: 2, lineHeight: 1.2}}>{sub}</div> : null}
        </div>
        {icon}
        {chevron ? <Chevron dir="down" size={16} /> : null}
      </div>
    );
  };

export const FormScreen: React.FC<{frame: number}> = ({frame}) => {
  const name = typed(PUPIL.name, frame, T.nameFrom, T.nameTo);
  const iin = typed(PUPIL.iin, frame, T.iinFrom, T.iinTo);
  const grade = typed(PUPIL.grade, frame, T.gradeFrom, T.gradeTo);
  const filled = frame >= T.sumFlash;
  const payerGlow = interpolate(frame, [T.payerGlow, T.payerGlow + 20, T.payerGlow + 70, T.payerGlow + 90], [0, 1, 1, 0], {...clamp});
  const periodGlow = interpolate(frame, [T.periodFlash, T.periodFlash + 16, T.periodFlash + 60, T.periodFlash + 80], [0, 1, 1, 0], {...clamp});
  const sumGlow = interpolate(frame, [T.sumFlash, T.sumFlash + 16, T.sumFlash + 60, T.sumFlash + 80], [0, 1, 1, 0], {...clamp});
  const typingName = frame >= T.nameFrom && frame < T.nameTo;
  const typingIin = frame >= T.iinFrom && frame < T.iinTo;
  const typingGrade = frame >= T.gradeFrom && frame < T.gradeTo;
  const sumText = filled ? PUPIL.sum : '0 ₸';
  return (
    <Page>
      <StatusBar time="15:08" />
      <NavBar title="Школы" right={<ShareIcon />} />
      <div style={{height: 8, flex: 'none'}} />
      <Field name="city" label="Выберите город" value={SCHOOL.city} chevron />
      <Field name="school" label={SCHOOL.name} sub={SCHOOL.addr} chevron />
      <div style={{height: 10, flex: 'none'}} />
      <Field name="pupil" label="ФИО учащегося" value={name || undefined} caret={typingName ? frame : undefined} />
      <Field name="iin" label="ИИН учащегося" value={iin || undefined} caret={typingIin ? frame : undefined} icon={<BarcodeIcon />} />
      <Field name="payer" label="ФИО плательщика" value={PUPIL.payer} grey glow={payerGlow} />
      <Field name="payerIin" label="ИИН плательщика" value={PUPIL.payerIin} grey glow={payerGlow} />
      <div style={{height: 10, flex: 'none'}} />
      <Field name="grade" label="Класс" value={grade || undefined} caret={typingGrade ? frame : undefined} />
      <Field name="period" label="Период" value={filled ? PUPIL.period : undefined} glow={periodGlow} />
      <Field name="sum" label="" value={sumText} glow={sumGlow} />
      <div style={{margin: '10px 16px 0', height: 52, borderRadius: 11, background: UI.blue, display: 'grid',
        placeItems: 'center', flex: 'none'}}>
        <span style={{fontFamily: F, fontSize: 16.5, fontWeight: 700, color: UI.white}}>К оплате {sumText}</span>
      </div>
      <HomeBar />
    </Page>
  );
};

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const useF = () => useCurrentFrame();
