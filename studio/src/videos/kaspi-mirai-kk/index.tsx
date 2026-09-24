import {Composition, registerRoot} from 'remotion';
import '../../index.css';
import '../../fonts';
import {DURATION, FPS} from './data';
import {Reel} from './Reel';

// Своя точка входа ролика: общий Root.tsx не трогаем.
// Проверка: cd studio && ENTRY=src/videos/kaspi-mirai-kk/index.tsx node scripts/qa-fit.mjs kaspi-mirai-kk
// Кадры:    cd studio && ENTRY=src/videos/kaspi-mirai-kk/index.tsx node scripts/review.mjs kaspi-mirai-kk
// Рендер:   cd studio && npx remotion render src/videos/kaspi-mirai-kk/index.tsx kaspi-mirai-kk ../videos/kaspi-mirai-kk/renders/raw.mp4
const Root: React.FC = () => (
  <Composition id="kaspi-mirai-kk" component={Reel} durationInFrames={DURATION} fps={FPS} width={1440} height={2560} />
);
registerRoot(Root);
