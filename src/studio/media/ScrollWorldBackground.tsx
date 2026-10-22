import React, { useState } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useMotionValueEvent,
  useReducedMotion,
  MotionValue,
} from 'motion/react';
import type { PhotorealShowcaseProduct } from './PhotorealProductShowcase';
import { isVerifiedGlbPath } from './MediaPipeline';

export interface ScrollWorldBackgroundProps {
  products: PhotorealShowcaseProduct[];
  activeProductId: string;
  onSelectProduct: (product: PhotorealShowcaseProduct) => void;
  onInspectProduct: (product: PhotorealShowcaseProduct) => void;
}

interface StoryBeat {
  index: number;
  product: PhotorealShowcaseProduct;
  lane: 'left' | 'right';
  start: number;
  peak: number;
  end: number;
  stageCode: string;
  diveLabel: string;
}

const EDITORIAL_STILLS = [
  {
    url: '/images/hero-campaign-editorial.jpg',
    label: 'STILL 01 · MILANO STONE STEPS',
    range: [0, 0.18, 0.35] as [number, number, number],
  },
  {
    url: '/images/editorial-coat-drape.jpg',
    label: 'STILL 02 · BIELLA CASHMERE DRAPE',
    range: [0.22, 0.42, 0.62] as [number, number, number],
  },
  {
    url: '/images/editorial-coat-detail.jpg',
    label: 'STILL 03 · MINERAL FLEECE ARCHIVE',
    range: [0.48, 0.68, 0.86] as [number, number, number],
  },
  {
    url: '/images/editorial-bomber-studio.jpg',
    label: 'STILL 04 · FUKUI TECHNICAL SILK',
    range: [0.72, 0.88, 1.0] as [number, number, number],
  },
];

function EditorialStillPlane({
  still,
  worldTime,
}: {
  still: (typeof EDITORIAL_STILLS)[number];
  worldTime: MotionValue<number>;
}) {
  const [start, peak, end] = still.range;
  const opacity = useTransform(
    worldTime,
    [Math.max(0, start - 0.08), start, peak, end, Math.min(1, end + 0.08)],
    [0, 0.22, 0.34, 0.2, 0],
  );
  const scale = useTransform(worldTime, [start, peak, end], [1.16, 1.04, 0.94]);
  const y = useTransform(worldTime, [start, end], ['6%', '-8%']);

  return (
    <motion.div
      className="mv-scrollworld__still-layer"
      style={{ opacity, scale, y }}
      aria-hidden="true"
    >
      <img src={still.url} alt="" loading="lazy" />
    </motion.div>
  );
}

function ScrollWorldProductOrbiter({
  beat,
  worldTime,
  smoothVelocity,
  isSelected,
  onSelect,
  onInspect,
}: {
  beat: StoryBeat;
  worldTime: MotionValue<number>;
  smoothVelocity: MotionValue<number>;
  isSelected: boolean;
  onSelect: (p: PhotorealShowcaseProduct) => void;
  onInspect: (p: PhotorealShowcaseProduct) => void;
}) {
  const { product, lane, start, peak, end, index, diveLabel } = beat;
  const hasGlb = isVerifiedGlbPath(product.modelPath);

  // Continuous Scroll-World trajectory (Scroll = Time camera dive)
  const y = useTransform(
    worldTime,
    [0, start, peak, end, 1],
    ['52vh', '32vh', '0vh', '-34vh', '-56vh'],
  );

  const x = useTransform(
    worldTime,
    [start, peak, end],
    lane === 'left' ? ['-6vw', '1.5vw', '-4vw'] : ['6vw', '-1.5vw', '4vw'],
  );

  // Z-depth scale simulation: emerges from deep field, peaks at focal plane, dives past lens
  const scale = useTransform(
    worldTime,
    [0, start, peak, end, 1],
    [0.64, 0.78, 1.02, 1.16, 0.85],
  );

  const opacity = useTransform(
    worldTime,
    [
      0,
      Math.max(0, start - 0.08),
      start,
      peak,
      end,
      Math.min(1, end + 0.09),
      1,
    ],
    [0.14, 0.24, 0.58, 0.92, 0.58, 0.22, 0.12],
  );

  const rotateZ = useTransform(
    worldTime,
    [start, peak, end],
    lane === 'left' ? [-4.5, 0, 3.5] : [4.5, 0, -3.5],
  );

  // Velocity-sensitive pitch & bank from motion/react useVelocity
  const velocityTiltX = useTransform(smoothVelocity, [-1.5, 0, 1.5], [8, 0, -8]);
  const velocityShiftY = useTransform(smoothVelocity, [-1.5, 0, 1.5], [-26, 0, 26]);

  return (
    <motion.div
      className={`mv-scrollworld__orbiter mv-scrollworld__orbiter--${lane} ${
        isSelected ? 'is-selected' : ''
      }`}
      style={{
        y,
        x,
        scale,
        opacity,
        rotateZ,
        rotateX: velocityTiltX,
      }}
    >
      <motion.div
        className="mv-scrollworld__orbiter-inner"
        style={{ y: velocityShiftY }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <div className="mv-scrollworld__orbiter-kicker">
          <span>
            0{index + 1} · {diveLabel}
          </span>
          <span className="mv-scrollworld__orbiter-medium">
            {hasGlb ? '3D PBR GLB' : '2.35× LOUPE'}
          </span>
        </div>

        <button
          type="button"
          className="mv-scrollworld__orbiter-media"
          onClick={() => onSelect(product)}
          onDoubleClick={() => onInspect(product)}
          title={`Focus ${product.name} in Atelier Stage`}
        >
          <img src={product.image} alt={product.name} loading="lazy" />
          <div className="mv-scrollworld__orbiter-shimmer" />
        </button>

        <div className="mv-scrollworld__orbiter-meta">
          <div>
            <small>{product.category}</small>
            <strong>{product.name}</strong>
          </div>
          <span className="mv-scrollworld__orbiter-price">{product.price}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export const ScrollWorldBackground: React.FC<ScrollWorldBackgroundProps> = ({
  products,
  activeProductId,
  onSelectProduct,
  onInspectProduct,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [motionPaused, setMotionPaused] = useState(false);
  const [timecodeText, setTimecodeText] = useState('00:00.00');
  const [activeBeatIndex, setActiveBeatIndex] = useState(0);
  const [velocityReadout, setVelocityReadout] = useState(0);

  const { scrollYProgress } = useScroll();

  // Motion division spring physics for "Scroll = Time" continuous camera scrubbing
  const worldTime = useSpring(scrollYProgress, {
    stiffness: 56,
    damping: 22,
    mass: 0.55,
    restDelta: 0.0004,
  });

  const rawVelocity = useVelocity(worldTime);
  const smoothVelocity = useSpring(rawVelocity, {
    stiffness: 90,
    damping: 26,
  });

  // Horizon connector grid parallax transforms
  const gridY = useTransform(worldTime, [0, 1], ['0%', '-28%']);
  const gridScale = useTransform(worldTime, [0, 0.5, 1], [1, 1.08, 1.16]);
  const horizonGlowY = useTransform(worldTime, [0, 1], ['12vh', '82vh']);

  const beats: StoryBeat[] = React.useMemo(() => {
    const count = Math.max(1, products.length);
    const diveLabels = [
      'STILL → DIVE I',
      'CONNECTOR → DIVE II',
      'HOROLOGY MACRO DIVE',
      'OPTICAL AXIS DIVE',
      'PAVILION LIGHT DIVE',
      'ATELIER FINALE DIVE',
    ];
    return products.map((product, index) => {
      const span = 1 / count;
      const start = Math.max(0, index * span - 0.06);
      const peak = Math.min(1, (index + 0.5) * span);
      const end = Math.min(1, (index + 1) * span + 0.06);
      return {
        index,
        product,
        lane: index % 2 === 0 ? 'left' : 'right',
        start,
        peak,
        end,
        stageCode: `SW-0${index + 1}`,
        diveLabel: diveLabels[index % diveLabels.length],
      };
    });
  }, [products]);

  useMotionValueEvent(worldTime, 'change', (latest) => {
    const clamped = Math.max(0, Math.min(1, latest));
    const totalSeconds = clamped * 60;
    const secs = Math.floor(totalSeconds);
    const hundredths = Math.floor((totalSeconds - secs) * 100);
    setTimecodeText(
      `00:${String(secs).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`,
    );

    const idx = Math.min(
      beats.length - 1,
      Math.max(0, Math.floor(clamped * beats.length)),
    );
    if (idx !== activeBeatIndex) {
      setActiveBeatIndex(idx);
    }
  });

  useMotionValueEvent(smoothVelocity, 'change', (v) => {
    setVelocityReadout(Math.min(9.9, Math.abs(v * 10)));
  });

  const handleScrubToBeat = (beat: StoryBeat) => {
    if (typeof window === 'undefined') return;
    const maxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    window.scrollTo({
      top: beat.peak * maxScroll,
      behavior: 'smooth',
    });
    onSelectProduct(beat.product);
  };

  const isDisabled = Boolean(prefersReducedMotion || motionPaused);
  const currentBeat = beats[activeBeatIndex] || beats[0];

  return (
    <>
      {/* FIXED BACKGROUND SCROLL-WORLD STAGE */}
      <div
        className={`mv-scrollworld ${isDisabled ? 'is-paused' : ''}`}
        aria-hidden="true"
      >
        {/* STAGE 1: DEEP ATMOSPHERIC STILLS */}
        <div className="mv-scrollworld__stills">
          {!isDisabled &&
            EDITORIAL_STILLS.map((still) => (
              <EditorialStillPlane
                key={still.url}
                still={still}
                worldTime={worldTime}
              />
            ))}
          <div className="mv-scrollworld__vignette" />
        </div>

        {/* STAGE 2: HORIZON CONNECTORS & PERSPECTIVE RAILS */}
        <motion.div
          className="mv-scrollworld__connectors"
          style={isDisabled ? undefined : { y: gridY, scale: gridScale }}
        >
          <div className="mv-scrollworld__axis mv-scrollworld__axis--left" />
          <div className="mv-scrollworld__axis mv-scrollworld__axis--center" />
          <div className="mv-scrollworld__axis mv-scrollworld__axis--right" />
        </motion.div>

        {!isDisabled && (
          <motion.div
            className="mv-scrollworld__horizon-beam"
            style={{ top: horizonGlowY }}
          />
        )}

        {/* STAGE 3: CONTINUOUS PRODUCT DIVE CORRIDOR */}
        {!isDisabled && (
          <div className="mv-scrollworld__corridor">
            {beats.map((beat) => (
              <ScrollWorldProductOrbiter
                key={beat.product.id}
                beat={beat}
                worldTime={worldTime}
                smoothVelocity={smoothVelocity}
                isSelected={activeProductId === beat.product.id}
                onSelect={onSelectProduct}
                onInspect={onInspectProduct}
              />
            ))}
          </div>
        )}
      </div>

      {/* INTERACTIVE SCROLL-WORLD TIME SCRUBBER RAIL (RIGHT EDGE) */}
      <aside
        className="mv-scrollworld-hud"
        aria-label="Scroll-World Product Motion Scrubber"
      >
        <div className="mv-scrollworld-hud__top">
          <span className="mv-scrollworld-hud__tag">SCROLL-WORLD · MOTION</span>
          <strong className="mv-scrollworld-hud__timecode">T+{timecodeText}</strong>
          <span className="mv-scrollworld-hud__vel">
            Δv {velocityReadout.toFixed(1)}
          </span>
        </div>

        <div className="mv-scrollworld-hud__track" role="navigation" aria-label="Scroll-World Story Beats">
          {beats.map((beat, idx) => {
            const isCurrent = idx === activeBeatIndex;
            return (
              <button
                key={beat.product.id}
                type="button"
                className={`mv-scrollworld-hud__node ${isCurrent ? 'is-active' : ''}`}
                onClick={() => handleScrubToBeat(beat)}
                title={`${beat.stageCode}: ${beat.product.name} (${beat.product.price})`}
              >
                <span className="mv-scrollworld-hud__dot" />
                <span className="mv-scrollworld-hud__label">
                  <small>{beat.stageCode}</small>
                  <strong>{beat.product.name.split(' ')[0]}</strong>
                </span>
              </button>
            );
          })}
        </div>

        {currentBeat && (
          <div className="mv-scrollworld-hud__active-beat">
            <img src={currentBeat.product.image} alt={currentBeat.product.name} />
            <div>
              <span>{currentBeat.diveLabel}</span>
              <strong>{currentBeat.product.name}</strong>
            </div>
          </div>
        )}

        <button
          type="button"
          className="mv-scrollworld-hud__toggle"
          onClick={() => setMotionPaused((prev) => !prev)}
        >
          {motionPaused ? 'Resume Scroll Motion' : 'Pause Ambient Motion'}
        </button>
      </aside>
    </>
  );
};

export default ScrollWorldBackground;
