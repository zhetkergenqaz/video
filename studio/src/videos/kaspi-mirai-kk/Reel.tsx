import {AbsoluteFill, Audio, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame} from 'remotion';
import {useFit} from '../../ds';
import {CAM, CTA, DURATION, FPS, HOOK, ONAI, OUTRO, PT_H, PT_W, SCALE, SEARCH_QUERY, STEPS, T, VIEW_PT} from './data';
import {FormScreen, MainScreen, PaymentsScreen, SearchScreen, typed} from './kaspi';

const F = 'Inter Tight';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);
const SFX = 0.37; // громкость эффектов от исходных нарезок

// Экраны идут встык: касание — причина каждой смены.
const SCREENS = [
  {id: 'main', from: 0, to: 432},
  {id: 'payments', from: 432, to: 720},
  {id: 'search', from: 720, to: 1068},
  {id: 'form', from: 1068, to: DURATION},
] as const;
const SWAP = 19; // 0,32 с

// Касания: кадр и точка на экране в точках iOS.
const TAPS = [
  {at: T.tapPayments, x: 244, y: 233},
  {at: T.tapSearch, x: 196, y: 166},
  {at: T.tapResult, x: 196, y: 160},
  {at: T.tapPay, x: 196, y: 720},
];

const camAt = (frame: number) => {
  for (let i = 1; i < CAM.length; i++) {
    if (frame <= CAM[i].at) {
      const a = CAM[i - 1], b = CAM[i];
      return interpolate(frame, [a.at, b.at], [a.y, b.y], {...clamp, easing: out});
    }
  }
  return CAM[CAM.length - 1].y;
};

const Screens: React.FC<{frame: number}> = ({frame}) => {
  const query = typed(SEARCH_QUERY, frame, T.typeFrom, T.typeTo);
  const body = (id: string) =>
    id === 'main' ? <MainScreen />
    : id === 'payments' ? <PaymentsScreen />
    : id === 'search' ? <SearchScreen query={query} showResult={frame >= T.resultAt} caretFrame={frame} kbBottom={PT_H - VIEW_PT} />
    : <FormScreen frame={frame} />;
  return (
    <>
      {SCREENS.map((s, i) => {
        const next = SCREENS[i + 1];
        // первый экран не выезжает: кадр 0 обязан быть не пустым
        const entering = i > 0 && frame >= s.from && frame < s.from + SWAP;
        const leaving = next && frame >= next.from && frame < next.from + SWAP;
        if (frame >= s.to && !leaving) return null;
        if (frame < s.from) return null;
        const k = entering ? interpolate(frame, [s.from, s.from + SWAP], [0, 1], {...clamp, easing: out}) : 1;
        const kOut = leaving ? interpolate(frame, [next.from, next.from + SWAP], [0, 1], {...clamp, easing: out}) : 0;
        return (
          <div key={s.id} style={{position: 'absolute', inset: 0,
            transform: `translateX(${entering ? (1 - k) * 90 : kOut * -90}px)`,
            opacity: entering ? k : 1 - kOut}}>
            {body(s.id)}
          </div>
        );
      })}
    </>
  );
};

const Tap: React.FC<{frame: number; camY: number}> = ({frame, camY}) => (
  <>
    {TAPS.map((t) => {
      const d = frame - t.at;
      if (d < -2 || d > 30) return null;
      const ring = interpolate(d, [0, 27], [0.35, 2.3], {...clamp, easing: out});
      const ringOp = interpolate(d, [0, 6, 27], [0, 0.55, 0], {...clamp});
      const dotOp = interpolate(d, [0, 5, 20, 30], [0, 1, 1, 0], {...clamp});
      const x = t.x * SCALE, y = (t.y - camY) * SCALE;
      return (
        <div key={t.at} style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)'}}>
          <div style={{position: 'absolute', left: '50%', top: '50%', width: 220, height: 220, marginLeft: -110,
            marginTop: -110, borderRadius: 999, border: `8px solid rgba(18,102,204,${ringOp})`,
            transform: `scale(${ring})`}} />
          {/* метка не закрывает то, по чему жмут: заливка полупрозрачная, читается кольцо */}
          <div style={{width: 104, height: 104, borderRadius: 999, background: `rgba(255,255,255,${0.32 * dotOp})`,
            border: `7px solid rgba(18,102,204,${0.75 * dotOp})`, boxShadow: `0 10px 30px rgba(0,0,0,${0.22 * dotOp})`}} />
        </div>
      );
    })}
  </>
);

const Caption: React.FC<{frame: number}> = ({frame}) => {
  const step = STEPS.find((s) => frame >= s.from && frame < s.to);
  const ref = useFit('caption');
  if (!step) return null;
  const k = interpolate(frame, [step.from, step.from + 14], [0, 1], {...clamp, easing: out});
  const kOut = interpolate(frame, [step.to - 12, step.to], [0, 1], {...clamp, easing: out});
  const shift = (1 - k) * 46 + kOut * -30;
  const op = k * (1 - kOut);
  const idx = STEPS.indexOf(step);
  return (
    <div style={{position: 'absolute', left: 80, width: 1280, ...(step.captionTop ? {top: 140} : {bottom: 180}),
      transform: `translateY(${shift}px)`, opacity: op}}>
      <div ref={ref as never} style={{boxSizing: 'border-box', width: '100%', padding: '46px 52px 50px', borderRadius: 56,
        background: 'linear-gradient(180deg, rgba(16,19,24,.94) 0%, rgba(10,12,15,.96) 100%)',
        border: '2px solid rgba(255,255,255,.10)', boxShadow: '0 34px 90px rgba(0,0,0,.5)'}}>
        {/* полоска прогресса: пять шагов */}
        <div style={{display: 'flex', gap: 12, marginBottom: 34}}>
          {STEPS.map((_, i) => (
            <span key={i} style={{flex: 1, height: 8, borderRadius: 99,
              background: i <= idx ? ONAI.mint : 'rgba(255,255,255,.16)'}} />
          ))}
        </div>
        <div style={{display: 'flex', gap: 30, alignItems: 'flex-start'}}>
          <div style={{width: 96, height: 96, flex: 'none', borderRadius: 30, background: ONAI.mint, display: 'grid',
            placeItems: 'center', fontFamily: F, fontSize: 58, fontWeight: 800, color: ONAI.mintInk,
            boxShadow: 'inset 0 3px 0 rgba(255,255,255,.5)'}}>{step.n}</div>
          <div style={{minWidth: 0}}>
            <div style={{fontFamily: F, fontSize: 60, fontWeight: 800, color: ONAI.text, lineHeight: 1.16,
              textShadow: '0 3px 10px rgba(0,0,0,.6)'}}>{step.title}</div>
            {step.hints.map((h) => (
              <div key={h} style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 20}}>
                <span style={{width: 12, height: 12, borderRadius: 99, background: ONAI.mint, flex: 'none'}} />
                <span style={{fontFamily: F, fontSize: 40, fontWeight: 500, color: ONAI.dim, lineHeight: 1.2}}>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Hook: React.FC<{frame: number}> = ({frame}) => {
  const ref = useFit('hook');
  if (frame >= T.hookEnd + 24) return null;
  const k = spring({frame, fps: FPS, config: {damping: 18, stiffness: 120}});
  const fade = interpolate(frame, [T.hookEnd, T.hookEnd + 24], [1, 0], {...clamp});
  return (
    <AbsoluteFill style={{background: `rgba(6,8,11,${0.55 * fade})`, display: 'grid', placeItems: 'center', opacity: 1}}>
      <div ref={ref as never} style={{boxSizing: 'border-box', width: 1240, padding: '60px 64px', borderRadius: 64,
        background: 'linear-gradient(180deg, rgba(16,19,24,.9) 0%, rgba(10,12,15,.94) 100%)',
        border: '2px solid rgba(255,255,255,.12)', boxShadow: '0 40px 110px rgba(0,0,0,.6)',
        transform: `translateY(${(1 - k) * 60}px) scale(${0.94 + k * 0.06})`, opacity: fade}}>
        <div style={{fontFamily: F, fontSize: 88, fontWeight: 800, color: ONAI.text, lineHeight: 1.1,
          textShadow: '0 4px 14px rgba(0,0,0,.6)'}}>{HOOK}</div>
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC<{frame: number}> = ({frame}) => {
  const ref = useFit('outro');
  if (frame < T.outroAt) return null;
  const k = spring({frame: frame - T.outroAt, fps: FPS, config: {damping: 17, stiffness: 130}});
  const dim = interpolate(frame, [T.outroAt, T.outroAt + 16], [0, 0.72], {...clamp});
  const ctaK = interpolate(frame, [T.ctaAt, T.ctaAt + 18], [0, 1], {...clamp, easing: out});
  return (
    <AbsoluteFill style={{background: `rgba(6,8,11,${dim})`, display: 'grid', placeItems: 'center'}}>
      <div style={{display: 'grid', justifyItems: 'center', gap: 56}}>
        <div style={{width: 260, height: 260, borderRadius: 999, background: ONAI.mint, display: 'grid',
          placeItems: 'center', transform: `scale(${0.6 + k * 0.4})`, boxShadow: '0 30px 80px rgba(61,237,195,.35)'}}>
          <svg width={140} height={140} viewBox="0 0 24 24">
            <path d="M4 12.5 9.5 18 20 7" stroke={ONAI.mintInk} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div ref={ref as never} style={{boxSizing: 'border-box', width: 1240, padding: '44px 56px', borderRadius: 52,
          background: 'rgba(12,14,18,.9)', border: '2px solid rgba(255,255,255,.12)', textAlign: 'center'}}>
          <div style={{fontFamily: F, fontSize: 68, fontWeight: 800, color: ONAI.text, lineHeight: 1.15}}>{OUTRO}</div>
          <div style={{fontFamily: F, fontSize: 44, fontWeight: 600, color: ONAI.mint, marginTop: 24,
            opacity: ctaK, transform: `translateY(${(1 - ctaK) * 20}px)`}}>{CTA}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Reel: React.FC = () => {
  const frame = useCurrentFrame();
  const camY = camAt(frame);
  return (
    <AbsoluteFill style={{background: '#0B0D10', overflow: 'hidden'}}>
      {/* экран телефона на весь кадр: рамки корпуса и рук нет */}
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: PT_W, height: PT_H, transformOrigin: 'top left',
          transform: `translateY(${-camY * SCALE}px) scale(${SCALE})`}}>
          <Screens frame={frame} />
        </div>
      </AbsoluteFill>
      <Tap frame={frame} camY={camY} />
      <Caption frame={frame} />
      <Hook frame={frame} />
      <Outro frame={frame} />
      {/* Звук. ui-click.wav, ui-pop.wav и ui-tap.wav в репозитории — цифровая тишина (−91 дБ),
          поэтому взяты живые нарезки. Громкие идут на ×0,37 по правилу репозитория,
          тихие в источнике (pop-warm −14 дБ, shimmer −13 дБ, ui-glass −21 дБ) — с добором до слышимости. */}
      {TAPS.filter((t) => t.at !== T.tapPay).map((t) => (
        <Sequence key={`s${t.at}`} from={t.at} durationInFrames={20}>
          <Audio src={staticFile('sfx/tick-soft.wav')} volume={SFX} />
        </Sequence>
      ))}
      {/* набор текста — клавиатура */}
      {[[T.typeFrom, T.typeTo], [T.nameFrom, T.nameTo], [T.iinFrom, T.iinTo]].map(([a, b]) => (
        <Sequence key={`t${a}`} from={a} durationInFrames={b - a}>
          <Audio src={staticFile('sfx/typing.wav')} volume={SFX * 0.8} loop />
        </Sequence>
      ))}
      <Sequence from={T.gradeFrom} durationInFrames={20}>
        <Audio src={staticFile('sfx/tick-soft.wav')} volume={SFX * 0.8} />
      </Sequence>
      {/* школа нашлась */}
      <Sequence from={T.resultAt} durationInFrames={30}>
        <Audio src={staticFile('sfx/ui-glass.wav')} volume={1} />
      </Sequence>
      {/* сумма подставилась */}
      <Sequence from={T.sumFlash} durationInFrames={60}>
        <Audio src={staticFile('sfx/counter.wav')} volume={SFX * 0.8} />
      </Sequence>
      {/* платёж отправлен: нажатие на «К оплате» */}
      <Sequence from={T.tapPay} durationInFrames={40}>
        <Audio src={staticFile('sfx/transform.wav')} volume={SFX} />
      </Sequence>
      {/* «оплачено»: галочка — тёплый аккорд с блеском */}
      <Sequence from={T.outroAt} durationInFrames={DURATION - T.outroAt}>
        <Audio src={staticFile('sfx/pop-warm.wav')} volume={1} />
      </Sequence>
      <Sequence from={T.outroAt + 6} durationInFrames={DURATION - T.outroAt - 6}>
        <Audio src={staticFile('sfx/shimmer.wav')} volume={0.8} />
      </Sequence>
    </AbsoluteFill>
  );
};
