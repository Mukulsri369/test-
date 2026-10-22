import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { AdaptiveLightingRig } from './experience/AdaptiveLightingRig';
import { CameraDirector } from './experience/CameraDirector';
import { CinematicAtmosphere } from './experience/CinematicAtmosphere';
import { ProductHotspots } from './experience/ProductHotspots';
import { ChairConcept, SneakerConcept, WatchConcept } from './experience/ConceptEnhancements';
import {
  BallConcept,
  ControllerConcept,
  CupConcept,
  EyewearConcept,
  GearConcept,
  SpeakerConcept,
} from './experience/SectorConcepts';
import type {
  CameraStyle,
  ExperiencePreset,
  LightingMood,
  ProductHotspot,
} from './experience/experience.types';

export type LightingPreset = LightingMood;
export type CameraPreset = CameraStyle;

export type ConceptType =
  | 'Orb'
  | 'Sneaker'
  | 'Shoe'
  | 'Watch'
  | 'Eyewear'
  | 'Chair'
  | 'Speaker'
  | 'Gear'
  | 'Cup'
  | 'Ball'
  | 'Controller'
  | 'Rings'
  | 'Fabric'
  | string;

export interface ModelViewportProps {
  modelPath?: string | null;
  concept?: ConceptType;
  accentColor?: string;
  accent?: string;
  secondaryColor?: string;
  autoRotate?: boolean;
  cameraPreset?: CameraStyle;
  lightingPreset?: LightingMood;
  hotspots?: ProductHotspot[];
  posterImage?: string;
  title?: string;
  label?: string;
  subtitle?: string;
  stage?: string;
  reducedMotion?: boolean;
  experience?: ExperiencePreset;
  interactive?: boolean;
  scrollProgress?: number;
  /**
   * When false (default in commercial storefront sections), products without a verified GLB
   * render the high-resolution Photographic Loupe Stage instead of primitive procedural geometry.
   */
  allowProceduralConcept?: boolean;
  provenanceLabel?: string;
}

class ModelErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidUpdate(prevProps: { fallback: React.ReactNode; children: React.ReactNode }) {
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function LoadedGLB({
  modelPath,
  autoRotate = true,
  scrollProgress = 0,
}: {
  modelPath: string;
  autoRotate?: boolean;
  scrollProgress?: number;
}) {
  const gltf = useGLTF(modelPath);
  const group = useRef<THREE.Group>(null);

  const normalizedScene = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    cloned.updateMatrixWorld(true);

    cloned.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            if ('envMapIntensity' in mat) {
              (mat as THREE.MeshStandardMaterial).envMapIntensity = 1.65;
            }
            mat.needsUpdate = true;
          });
        }
      }
    });

    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSpan = modelPath.includes('watch')
      ? 2.25
      : modelPath.includes('footwear')
        ? 2.35
        : 2.3;
    const scaleFactor = maxDim > 0 ? targetSpan / maxDim : 1;

    const wrapper = new THREE.Group();
    cloned.scale.setScalar(scaleFactor);
    cloned.updateMatrixWorld(true);

    const scaledBox = new THREE.Box3().setFromObject(cloned);
    const scaledCenter = new THREE.Vector3();
    scaledBox.getCenter(scaledCenter);
    cloned.position.set(-scaledCenter.x, -scaledCenter.y + 0.05, -scaledCenter.z);

    wrapper.add(cloned);
    if (modelPath.includes('footwear')) {
      wrapper.rotation.set(0.14, -0.55, 0);
    } else if (modelPath.includes('watch')) {
      wrapper.rotation.set(0.18, 0.35, 0);
    } else {
      wrapper.rotation.set(0.12, -0.35, 0);
    }
    return wrapper;
  }, [gltf.scene, modelPath]);

  const prevScrollRef = useRef(scrollProgress);
  const scrollBoostRef = useRef(0);

  useFrame((state, delta) => {
    if (!group.current) return;
    const scrollDelta = scrollProgress - prevScrollRef.current;
    prevScrollRef.current = scrollProgress;
    scrollBoostRef.current = THREE.MathUtils.damp(
      scrollBoostRef.current,
      scrollDelta * 18,
      6,
      delta,
    );

    if (autoRotate) {
      group.current.rotation.y += delta * 0.32 + scrollBoostRef.current * 0.28;
    }
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      Math.sin(scrollProgress * Math.PI * 2) * 0.08 + scrollBoostRef.current * 0.06,
      5,
      delta,
    );
    group.current.position.y =
      Math.sin(state.clock.elapsedTime * 1.1) * 0.02 +
      Math.cos(scrollProgress * Math.PI * 2) * 0.03;
  });

  return (
    <group ref={group}>
      <primitive object={normalizedScene} />
    </group>
  );
}

function ProceduralConcept({
  concept = 'Sneaker',
  accentColor = '#c9a46b',
  autoRotate = true,
}: {
  concept?: ConceptType;
  accentColor?: string;
  autoRotate?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (group.current && autoRotate) {
      group.current.rotation.y += dt * 0.35;
    }
  });

  const key = String(concept).toLowerCase();
  return (
    <group ref={group}>
      {key.includes('watch') ? (
        <WatchConcept accent={accentColor} />
      ) : key.includes('sneaker') || key.includes('shoe') ? (
        <SneakerConcept accent={accentColor} />
      ) : key.includes('chair') ? (
        <ChairConcept accent={accentColor} />
      ) : key.includes('eyewear') ? (
        <EyewearConcept accent={accentColor} />
      ) : key.includes('speaker') ? (
        <SpeakerConcept accent={accentColor} />
      ) : key.includes('gear') ? (
        <GearConcept accent={accentColor} />
      ) : key.includes('cup') ? (
        <CupConcept accent={accentColor} />
      ) : key.includes('ball') ? (
        <BallConcept accent={accentColor} />
      ) : key.includes('controller') ? (
        <ControllerConcept accent={accentColor} />
      ) : (
        <SneakerConcept accent={accentColor} />
      )}
    </group>
  );
}

function PhotographicLoupeFallback({
  posterImage,
  title,
  subtitle,
  provenanceLabel,
}: {
  posterImage?: string;
  title?: string;
  subtitle?: string;
  provenanceLabel?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loupe, setLoupe] = useState<{ active: boolean; x: number; y: number }>({
    active: false,
    x: 50,
    y: 50,
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setLoupe({ active: true, x, y });
  };

  return (
    <div
      ref={containerRef}
      className="studio-viewport-fallback studio-photographic-stage"
      role="img"
      aria-label={title || 'Atelier photographic inspection stage'}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setLoupe((prev) => ({ ...prev, active: true }))}
      onPointerLeave={() => setLoupe((prev) => ({ ...prev, active: false }))}
    >
      {posterImage ? (
        <>
          <img
            src={posterImage}
            alt={title || 'Atelier product photograph'}
            className="studio-photographic-stage__img"
            style={{
              transform: loupe.active ? 'scale(2.25)' : 'scale(1.01)',
              transformOrigin: `${loupe.x}% ${loupe.y}%`,
            }}
          />
          <div className="studio-photographic-stage__vignette" />
        </>
      ) : (
        <div className="studio-fallback-orb" />
      )}
      <div className="studio-fallback-copy">
        <span className="studio-badge">
          {provenanceLabel || 'ATELIER PHOTOGRAPHY · 2.25× OPTICAL LOUPE'}
        </span>
        {title && <strong>{title}</strong>}
        <p>
          {subtitle ||
            'Move cursor across garment or silhouette to inspect surface grain and stitch tension.'}
        </p>
      </div>
    </div>
  );
}

export function ModelViewport({
  modelPath,
  concept = 'Sneaker',
  accentColor,
  accent,
  autoRotate = true,
  cameraPreset = 'reveal',
  lightingPreset = 'warm-gallery',
  hotspots = [],
  posterImage,
  title,
  label,
  subtitle,
  interactive = true,
  scrollProgress = 0,
  allowProceduralConcept = false,
  provenanceLabel,
}: ModelViewportProps) {
  const resolvedAccent = accentColor || accent || '#c9a46b';
  const resolvedTitle = title || label;
  const [canRenderWebGL, setCanRenderWebGL] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  const normalizedModelPath = useMemo(() => {
    const trimmed = modelPath?.trim();
    return trimmed && /\.(glb|gltf)(\?.*)?$/i.test(trimmed) ? trimmed : null;
  }, [modelPath]);

  useEffect(() => {
    setCanRenderWebGL(detectWebGL());
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(Boolean(media?.matches));
    updateMotion();
    media?.addEventListener?.('change', updateMotion);

    const onVisibility = () => setTabVisible(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', onVisibility);

    let observer: IntersectionObserver | null = null;
    if (rootRef.current && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
        threshold: 0.05,
      });
      observer.observe(rootRef.current);
    }

    return () => {
      media?.removeEventListener?.('change', updateMotion);
      document.removeEventListener('visibilitychange', onVisibility);
      observer?.disconnect();
    };
  }, []);

  if (!normalizedModelPath && !allowProceduralConcept) {
    return (
      <PhotographicLoupeFallback
        posterImage={posterImage}
        title={resolvedTitle}
        subtitle={subtitle}
        provenanceLabel={provenanceLabel}
      />
    );
  }

  if (!canRenderWebGL) {
    return (
      <PhotographicLoupeFallback
        posterImage={posterImage}
        title={resolvedTitle}
        subtitle={subtitle}
        provenanceLabel={provenanceLabel}
      />
    );
  }

  const active = inView && tabVisible;
  const shouldRotate = autoRotate && !reducedMotion && active;

  return (
    <div
      ref={rootRef}
      className="studio-model-viewport"
      aria-label={resolvedTitle || `${concept} 3D viewport`}
    >
      <Canvas
        shadows
        frameloop={active ? 'always' : 'demand'}
        dpr={[1, 2]}
        camera={{ position: [0, 0.18, 3.25], fov: 35 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.18,
        }}
      >
        <CameraDirector
          style={cameraPreset}
          progress={scrollProgress}
          disabled={reducedMotion || interactive}
        />
        <AdaptiveLightingRig mood={lightingPreset} accent={resolvedAccent} quality="high" />
        {!normalizedModelPath && (
          <CinematicAtmosphere accent={resolvedAccent} animated={!reducedMotion && active} />
        )}

        <Suspense fallback={null}>
          <Float
            speed={reducedMotion || !active ? 0 : 0.9}
            rotationIntensity={reducedMotion || !active ? 0 : 0.08}
            floatIntensity={reducedMotion || !active ? 0 : 0.1}
          >
            <ModelErrorBoundary fallback={null}>
              {normalizedModelPath ? (
                <LoadedGLB
                  modelPath={normalizedModelPath}
                  autoRotate={shouldRotate}
                  scrollProgress={scrollProgress}
                />
              ) : (
                <ProceduralConcept
                  concept={concept}
                  accentColor={resolvedAccent}
                  autoRotate={shouldRotate}
                />
              )}
            </ModelErrorBoundary>
            {hotspots.length > 0 && <ProductHotspots points={hotspots} />}
          </Float>
          <ContactShadows
            position={[0, -0.95, 0]}
            opacity={0.38}
            scale={6.5}
            blur={2.4}
            far={3.2}
            color="#3d3226"
          />
        </Suspense>

        {interactive && (
          <OrbitControls
            makeDefault
            target={[0, 0, 0]}
            enablePan={false}
            enableZoom={true}
            enableDamping={true}
            dampingFactor={0.05}
            minDistance={1.85}
            maxDistance={5.2}
            maxPolarAngle={Math.PI / 1.75}
            minPolarAngle={Math.PI / 5}
          />
        )}
      </Canvas>
      <div className="studio-viewport-caption">
        <span>
          {normalizedModelPath
            ? provenanceLabel || 'VERIFIED PBR GLB · REAL-TIME WEBGL2 STUDIO'
            : `EXPERIMENTAL SILHOUETTE · ${String(concept).toUpperCase()}`}
        </span>
        <span>
          {interactive ? 'Drag to orbit · Scroll to inspect macro geometry' : 'Preset camera path'}
        </span>
      </div>
    </div>
  );
}

export default ModelViewport;
