import {UI} from './data';

// Примитивы экрана iPhone. Все размеры — в точках iOS (393 × 852), масштаб в кадр даёт Reel.tsx.
const F = 'Inter Tight';

export const StatusBar: React.FC<{time: string; battery?: number}> = ({time, battery = 22}) => (
  <div style={{position: 'relative', height: 54, flex: 'none'}}>
    <div style={{position: 'absolute', left: 30, top: 15, fontFamily: F, fontSize: 16, fontWeight: 600, color: UI.ink,
      letterSpacing: '.2px'}}>{time}</div>
    <div style={{position: 'absolute', left: '50%', top: 11, marginLeft: -59, width: 118, height: 35, borderRadius: 99, background: '#000'}} />
    <div style={{position: 'absolute', right: 26, top: 17, display: 'flex', alignItems: 'center', gap: 5}}>
      {/* связь */}
      <svg width={17} height={11} viewBox="0 0 17 11">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 4.4} y={8 - i * 2.4} width={3} height={3 + i * 2.4} rx={1} fill={UI.ink} />
        ))}
      </svg>
      {/* wi-fi */}
      <svg width={15} height={11} viewBox="0 0 15 11">
        <path d="M7.5 9.6 5.6 7.6a2.8 2.8 0 0 1 3.8 0Z" fill={UI.ink} />
        <path d="M3.6 5.6a5.7 5.7 0 0 1 7.8 0" stroke={UI.ink} strokeWidth={1.6} fill="none" strokeLinecap="round" />
        <path d="M1.4 3.2a8.9 8.9 0 0 1 12.2 0" stroke={UI.ink} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      </svg>
      {/* заряд с числом внутри */}
      <div style={{position: 'relative', width: 26, height: 13, borderRadius: 4, border: `1.2px solid rgba(0,0,0,.35)`,
        display: 'grid', placeItems: 'center'}}>
        <span style={{fontFamily: F, fontSize: 9, fontWeight: 700, color: UI.ink, lineHeight: 1}}>{battery}</span>
        <span style={{position: 'absolute', right: -3.2, top: 4, width: 2, height: 5, borderRadius: 1, background: 'rgba(0,0,0,.35)'}} />
      </div>
    </div>
  </div>
);

export const HomeBar: React.FC = () => (
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 9, display: 'grid', placeItems: 'center'}}>
    <div style={{width: 139, height: 5, borderRadius: 99, background: 'rgba(0,0,0,.85)'}} />
  </div>
);

export const Chevron: React.FC<{dir?: 'left' | 'right' | 'down'; size?: number; color?: string; weight?: number}> =
  ({dir = 'right', size = 17, color = UI.dim, weight = 2}) => {
    const deg = dir === 'left' ? 180 : dir === 'down' ? 90 : 0;
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={{transform: `rotate(${deg}deg)`, flex: 'none'}}>
        <path d="M9 5l7 7-7 7" stroke={color} strokeWidth={weight} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

export const NavBar: React.FC<{title: string; right?: React.ReactNode}> = ({title, right}) => (
  <div style={{position: 'relative', height: 44, flex: 'none', display: 'grid', placeItems: 'center'}}>
    <div style={{position: 'absolute', left: 18, top: 12}}><Chevron dir="left" size={22} color={UI.ink} weight={2.4} /></div>
    <div style={{fontFamily: F, fontSize: 17, fontWeight: 600, color: UI.ink}}>{title}</div>
    <div style={{position: 'absolute', right: 20, top: 11}}>{right}</div>
  </div>
);

export const ShareIcon: React.FC = () => (
  <svg width={20} height={22} viewBox="0 0 20 22">
    <path d="M10 2v12M10 2 6.2 5.9M10 2l3.8 3.9" stroke={UI.ink} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 10H2.6v10h14.8V10H16" stroke={UI.ink} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BarcodeIcon: React.FC = () => (
  <svg width={22} height={22} viewBox="0 0 22 22">
    {[
      'M1 1h5M1 1v5', 'M21 1h-5M21 1v5', 'M1 21h5M1 21v-5', 'M21 21h-5M21 21v-5',
    ].map((d, i) => <path key={i} d={d} stroke={UI.red} strokeWidth={1.6} fill="none" strokeLinecap="round" />)}
    {[6.5, 9, 11.5, 14, 16.5].map((x, i) => (
      <rect key={i} x={x} y={5.5} width={i % 2 ? 1 : 1.6} height={11} fill={UI.red} />
    ))}
  </svg>
);

export const SearchIcon: React.FC<{color?: string; size?: number}> = ({color = UI.dim, size = 17}) => (
  <svg width={size} height={size} viewBox="0 0 20 20" style={{flex: 'none'}}>
    <circle cx={8.6} cy={8.6} r={6.4} stroke={color} strokeWidth={2} fill="none" />
    <path d="M13.4 13.4 18 18" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />
  </svg>
);

// Клавиатура с казахским рядом — как на снимке владельца.
const KEY_ROWS = [
  ['ә', 'і', 'ң', 'ғ', 'ү', 'ұ', 'қ', 'ө', 'һ'],
  ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х'],
  ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э'],
  ['я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю'],
];

const Key: React.FC<{label: string; w: number; grey?: boolean; small?: boolean}> = ({label, w, grey, small}) => (
  <div style={{width: w, height: 42, borderRadius: 5, background: grey ? '#ACB3BC' : UI.white,
    boxShadow: '0 1px 0 rgba(0,0,0,.28)', display: 'grid', placeItems: 'center',
    fontFamily: F, fontSize: small ? 13 : 22, fontWeight: small ? 600 : 400, color: UI.ink}}>{label}</div>
);

// bottom — отступ от низа экрана: клавиатура прижимается к нижнему краю кадра, а не «экрана под срезом».
export const Keyboard: React.FC<{bottom?: number}> = ({bottom = 0}) => (
  <div style={{position: 'absolute', left: 0, right: 0, bottom, height: 300, background: '#D1D4DB',
    padding: '8px 3px 0', boxSizing: 'border-box'}}>
    {KEY_ROWS.map((row, i) => (
      <div key={i} style={{display: 'flex', justifyContent: 'center', gap: 5, marginBottom: 10,
        paddingLeft: i === 3 ? 0 : 0}}>
        {i === 3 ? <Key label="⇧" w={40} grey /> : null}
        {row.map((k) => <Key key={k} label={k} w={i === 0 ? 38 : 31} />)}
        {i === 3 ? <Key label="⌫" w={40} grey /> : null}
      </div>
    ))}
    <div style={{display: 'flex', justifyContent: 'center', gap: 5}}>
      <Key label="123" w={44} grey small />
      <Key label="☺" w={40} grey />
      <Key label="бос орын" w={188} small />
      <div style={{width: 76, height: 42, borderRadius: 5, background: UI.blue, display: 'grid', placeItems: 'center',
        fontFamily: F, fontSize: 14, fontWeight: 600, color: UI.white, boxShadow: '0 1px 0 rgba(0,0,0,.28)'}}>Іздеу</div>
    </div>
  </div>
);
