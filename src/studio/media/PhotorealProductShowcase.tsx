import React, { useRef, useState } from 'react';
import ModelViewport, { CameraPreset, LightingPreset } from '../ModelViewport';
import { isVerifiedGlbPath } from './MediaPipeline';

export interface ShowcaseGalleryItem {
  url: string;
  label: string;
  detail: string;
}

export interface ShowcaseHotspot {
  id: string;
  label: string;
  specification: string;
  x: number;
  y: number;
}

export interface PhotorealShowcaseProduct {
  id: string;
  name: string;
  category: string;
  subtitle: string;
  price: string;
  url: string;
  image: string;
  modelPath: string | null;
  concept: string;
  accentColor: string;
  secondaryColor?: string;
  cameraPreset?: CameraPreset;
  lightingPreset?: LightingPreset;
  provenanceNote: string;
  glbSpecLabel?: string;
  gallery: ShowcaseGalleryItem[];
  hotspots: ShowcaseHotspot[];
  craftsmanshipNarrative: string;
  specs: { label: string; value: string }[];
  features: string[];
}

interface PhotorealProductShowcaseProps {
  product: PhotorealShowcaseProduct;
  activeLighting: LightingPreset;
  onLightingChange: (preset: LightingPreset) => void;
  onReserveProduct: (product: PhotorealShowcaseProduct) => void;
  onInspectProduct: (product: PhotorealShowcaseProduct) => void;
  scrollProgress: number;
}

const LIGHTING_OPTIONS: { id: LightingPreset; label: string; kTemp: string }[] = [
  { id: 'warm-gallery', label: 'Warm Atelier', kTemp: '3200K Tungsten' },
  { id: 'fashion', label: 'Runway Diffused', kTemp: '5200K Soft Fill' },
  { id: 'jewelry', label: 'Horology Macro', kTemp: '6500K Specular' },
];

export const PhotorealProductShowcase: React.FC<PhotorealProductShowcaseProps> = ({
  product,
  activeLighting,
  onLightingChange,
  onReserveProduct,
  onInspectProduct,
  scrollProgress,
}) => {
  const hasVerifiedGlb = isVerifiedGlbPath(product.modelPath);

  const [viewMode, setViewMode] = useState<'photography' | '3d-glb'>(
    hasVerifiedGlb ? '3d-glb' : 'photography',
  );
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<ShowcaseHotspot | null>(
    product.hotspots[0] || null,
  );
  const [loupeState, setLoupeState] = useState<{ active: boolean; x: number; y: number }>({
    active: false,
    x: 50,
    y: 50,
  });

  const photoContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setViewMode(isVerifiedGlbPath(product.modelPath) ? '3d-glb' : 'photography');
    setSelectedPhotoIndex(0);
    setActiveHotspot(product.hotspots[0] || null);
  }, [product.id, product.modelPath]);

  const currentGalleryItem =
    product.gallery[selectedPhotoIndex] || {
      url: product.image,
      label: 'Primary Studio Plate',
      detail: product.subtitle,
    };

  const handlePhotoPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!photoContainerRef.current) return;
    const rect = photoContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setLoupeState({ active: true, x, y });
  };

  return (
    <div className="mv-photoreal-showcase">
      <div className="mv-photoreal-showcase__stage-col">
        <div className="mv-photoreal-showcase__stage-header">
          <div className="mv-photoreal-showcase__provenance-tag">
            <span className="mv-dot-live" />
            <span>{product.provenanceNote}</span>
          </div>

          <div
            className="mv-photoreal-showcase__mode-tabs"
            role="tablist"
            aria-label="Inspection medium"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'photography'}
              className={viewMode === 'photography' ? 'is-active' : ''}
              onClick={() => setViewMode('photography')}
            >
              Editorial Photography (2.35× Loupe)
            </button>
            {hasVerifiedGlb && (
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === '3d-glb'}
                className={viewMode === '3d-glb' ? 'is-active' : ''}
                onClick={() => setViewMode('3d-glb')}
              >
                Interactive 3D GLB ({product.glbSpecLabel || 'PBR Studio'})
              </button>
            )}
          </div>
        </div>

        <div className="mv-photoreal-showcase__viewport-frame">
          {viewMode === '3d-glb' && hasVerifiedGlb ? (
            <div className="mv-photoreal-showcase__glb-wrap">
              <ModelViewport
                modelPath={product.modelPath}
                concept={product.concept}
                accentColor={product.accentColor}
                secondaryColor={product.secondaryColor || '#e8dfd1'}
                cameraPreset={product.cameraPreset || 'reveal'}
                lightingPreset={activeLighting}
                posterImage={product.image}
                title={product.name}
                subtitle={product.subtitle}
                scrollProgress={scrollProgress}
                allowProceduralConcept={false}
                provenanceLabel={product.provenanceNote}
              />

              <div className="mv-photoreal-showcase__lighting-bar">
                <span className="mv-lighting-bar__label">STUDIO IBL RIG</span>
                <div className="mv-lighting-bar__buttons">
                  {LIGHTING_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={activeLighting === opt.id ? 'is-active' : ''}
                      onClick={() => onLightingChange(opt.id)}
                    >
                      <span>{opt.label}</span>
                      <small>{opt.kTemp}</small>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              ref={photoContainerRef}
              className="mv-photoreal-showcase__photo-stage"
              onPointerMove={handlePhotoPointerMove}
              onPointerEnter={() => setLoupeState((prev) => ({ ...prev, active: true }))}
              onPointerLeave={() => setLoupeState((prev) => ({ ...prev, active: false }))}
            >
              <img
                src={currentGalleryItem.url}
                alt={`${product.name} — ${currentGalleryItem.label}`}
                className="mv-photoreal-showcase__photo-img"
                style={{
                  transform: loupeState.active ? 'scale(2.35)' : 'scale(1)',
                  transformOrigin: `${loupeState.x}% ${loupeState.y}%`,
                }}
              />
              <div className="mv-photoreal-showcase__photo-gradient" />

              {!loupeState.active &&
                product.hotspots.map((spot, idx) => (
                  <button
                    key={spot.id}
                    type="button"
                    className={`mv-hotspot-pin ${activeHotspot?.id === spot.id ? 'is-active' : ''}`}
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHotspot(spot);
                    }}
                    aria-label={`Inspect ${spot.label}`}
                  >
                    <span>0{idx + 1}</span>
                  </button>
                ))}

              <div className="mv-photoreal-showcase__photo-caption-bar">
                <div>
                  <span className="mv-mono-kicker">{currentGalleryItem.label}</span>
                  <p>{currentGalleryItem.detail}</p>
                </div>
                <span className="mv-loupe-indicator">
                  {loupeState.active
                    ? `OPTICAL LOUPE ACTIVE (${Math.round(loupeState.x)}%, ${Math.round(loupeState.y)}%)`
                    : 'HOVER FOR 2.35× TEXTILE / SURFACE LOUPE'}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mv-photoreal-showcase__substage">
          <div className="mv-photoreal-showcase__thumbs" role="list" aria-label="Photographic plates">
            {product.gallery.map((item, idx) => (
              <button
                key={`${item.url}-${idx}`}
                type="button"
                className={`mv-photo-thumb ${
                  viewMode === 'photography' && selectedPhotoIndex === idx ? 'is-active' : ''
                }`}
                onClick={() => {
                  setViewMode('photography');
                  setSelectedPhotoIndex(idx);
                }}
              >
                <img src={item.url} alt={item.label} loading="lazy" />
                <div>
                  <strong>Plate 0{idx + 1}</strong>
                  <span>{item.label}</span>
                </div>
              </button>
            ))}
          </div>

          {activeHotspot && (
            <div className="mv-photoreal-showcase__hotspot-card">
              <span className="mv-mono-kicker">MATERIAL CALLOUT · {activeHotspot.label}</span>
              <p>{activeHotspot.specification}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mv-photoreal-showcase__dossier-col">
        <div className="mv-dossier-eyebrow">
          <span>{product.category.toUpperCase()}</span>
          <span>REF. {product.id.toUpperCase()}</span>
        </div>

        <h3 className="mv-dossier-title">{product.name}</h3>
        <p className="mv-dossier-subtitle">{product.subtitle}</p>

        <div className="mv-dossier-price-row">
          <div>
            <span className="mv-mono-kicker">ATELIER ALLOCATION</span>
            <strong className="mv-dossier-price">{product.price}</strong>
          </div>
          <span className="mv-dossier-badge">
            {hasVerifiedGlb ? 'VERIFIED PBR GLB + PHOTOGRAPHY' : 'EDITORIAL PHOTOGRAPHY ARCHIVE'}
          </span>
        </div>

        <p className="mv-dossier-narrative">{product.craftsmanshipNarrative}</p>

        <dl className="mv-dossier-specs">
          {product.specs.map((spec) => (
            <div key={spec.label} className="mv-dossier-specs__row">
              <dt>{spec.label}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
        </dl>

        <ul className="mv-dossier-features">
          {product.features.map((feat) => (
            <li key={feat}>{feat}</li>
          ))}
        </ul>

        <div className="mv-dossier-actions">
          <button
            type="button"
            className="studio-button studio-button--primary"
            onClick={() => onReserveProduct(product)}
          >
            Reserve Piece — {product.price}
          </button>
          <button
            type="button"
            className="studio-button studio-button--ghost"
            onClick={() => onInspectProduct(product)}
          >
            Open Fullscreen Dossier
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotorealProductShowcase;
