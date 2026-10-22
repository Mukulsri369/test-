import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ModelViewport, { CameraPreset, LightingPreset } from './ModelViewport';
import ExperienceModules, { SiteProduct } from './modules/ExperienceModules';
import {
  PhotorealProductShowcase,
  PhotorealShowcaseProduct,
} from './media/PhotorealProductShowcase';
import { ExperimentalConceptLab } from './media/ExperimentalConceptLab';
import { ScrollWorldBackground } from './media/ScrollWorldBackground';
import { SmoothScroll } from '@/components/creative/SmoothScroll';
import { GEMINI_IMAGE_PIPELINE_STATUS, isVerifiedGlbPath } from './media/MediaPipeline';
import './studio.css';

gsap.registerPlugin(ScrollTrigger);

export const SITE_CONFIG = {
  brand: 'MAISON VÉRA',
  sector: 'Luxury Fashion, Footwear, Watches & Optical Atelier',
  tagline: 'Architectural silhouettes, rare textiles, and precision horology.',
  subtitle:
    'Autumn / Winter Atelier Collection — Photography-led editorial curation paired with real-time Khronos PBR 3D inspection.',
  templateId: 'fashion-runway',
  recipeId: 'fashion-runway',
  experiencePreset: 'fashion-runway',
  accentColor: '#c9a46b',
  secondaryColor: '#e6ddd0',
  cameraPreset: 'runway' as CameraPreset,
  lightingPreset: 'warm-gallery' as LightingPreset,
};

export const PRODUCTS: PhotorealShowcaseProduct[] = [
  {
    id: 'mv-footwear-01',
    name: 'Aether Sculpted Runner',
    category: 'Footwear',
    subtitle: 'Full-grain calfskin suede, technical ripstop mesh, and dual-density architectural sole',
    price: '$890',
    url: '#product-mv-footwear-01',
    image: '/images/product-sculpted-sneaker.jpg',
    modelPath: '/models/atelier-footwear-shoe.glb',
    concept: 'Sneaker',
    accentColor: '#c9a46b',
    secondaryColor: '#dfd5c6',
    cameraPreset: 'runway',
    lightingPreset: 'warm-gallery',
    provenanceNote: 'VERIFIED PBR GLB (13,540 VERTICES · 5 TEXTURES) + STUDIO PHOTOGRAPHY',
    glbSpecLabel: '13.5k Verts · 5 PBR Maps',
    craftsmanshipNarrative:
      'Constructed in our Veneto footwear workshop from vegetable-tanned suede and breathable ballistic mesh. The cantilevered midsole is compression-molded for torsional rigidity while preserving an unmistakable sculptural stance.',
    gallery: [
      {
        url: '/images/product-sculpted-sneaker.jpg',
        label: 'Monolith Plinth Study',
        detail: 'Three-quarter studio profile on architectural travertine plinth.',
      },
      {
        url: '/images/hero-campaign-editorial.jpg',
        label: 'Tailored Styling Context',
        detail: 'Paired with charcoal wool tailoring on architectural stone steps.',
      },
    ],
    hotspots: [
      {
        id: 'hs-fw-1',
        label: 'Cantilevered Heel Geometry',
        specification: 'Dual-density Pebax® core wrapped in micro-ribbed vulcanized rubber.',
        x: 28,
        y: 66,
      },
      {
        id: 'hs-fw-2',
        label: 'Paneled Calfskin Quarter',
        specification: '1.6 mm drum-dyed Italian suede with waxed Cotton-60 lockstitching.',
        x: 56,
        y: 48,
      },
      {
        id: 'hs-fw-3',
        label: 'Articulated Toe Box',
        specification: 'Reinforced multi-weave ballistic nylon engineered for crease resistance.',
        x: 74,
        y: 62,
      },
    ],
    specs: [
      { label: '3D Digital Twin', value: 'Khronos PBR GLB (13,540 Vertices)' },
      { label: 'Upper Material', value: 'Italian Calfskin Suede & Ripstop' },
      { label: 'Outsole Compound', value: 'High-Abrasion Vibram® Architectural' },
      { label: 'Origin', value: 'Montebelluna, Italy' },
    ],
    features: [
      'Hand-lasted upper with raw-edge suede paneling and recessed eyelet stays',
      'Anatomical cork-lined footbed that molds to the wearer over 48 hours',
      'Real-time WebGL2 PBR material inspection with 5 calibrated texture maps',
    ],
  },
  {
    id: 'mv-clothing-02',
    name: 'Nocturne Double-Faced Coat',
    category: 'Designer Clothing',
    subtitle: 'Hand-loomed camel cashmere-wool overcoat with wide peak lapels and horn hardware',
    price: '$3,450',
    url: '#product-mv-clothing-02',
    image: '/images/editorial-coat-drape.jpg',
    modelPath: null,
    concept: 'Fabric',
    accentColor: '#c9a46b',
    secondaryColor: '#d9c6b0',
    cameraPreset: 'sweep',
    lightingPreset: 'fashion',
    provenanceNote: 'EDITORIAL CAMPAIGN PHOTOGRAPHY · 2.35× OPTICAL TEXTILE LOUPE',
    craftsmanshipNarrative:
      'Cut from 640 gsm double-faced Biella cashmere and virgin wool. Every seam is hand-split and blind-stitched by master tailors over 26 hours, eliminating internal lining bulk so the coat drapes with fluid architectural gravity.',
    gallery: [
      {
        url: '/images/editorial-coat-drape.jpg',
        label: 'Architectural Stairway Lookbook',
        detail: 'Full-length camel drape showcasing wide peak lapels and belted waist tension.',
      },
      {
        url: '/images/editorial-coat-detail.jpg',
        label: 'Atelier Cashmere Archive',
        detail: 'Macro tonal study of brushed cashmere, camel wool, and espresso knitwear.',
      },
      {
        url: '/images/editorial-bomber-studio.jpg',
        label: 'Companion Technical Silk Blouson',
        detail: 'Terracotta-bronze technical silk blouson from the same Autumn/Winter capsule.',
      },
    ],
    hotspots: [
      {
        id: 'hs-cl-1',
        label: 'Hand-Picked Peak Lapel',
        specification: '7 mm Punto Mano hand-picked edge stitching along the structured lapel roll.',
        x: 48,
        y: 34,
      },
      {
        id: 'hs-cl-2',
        label: 'Double-Faced Cashmere Weave',
        specification: '640 gsm Biella virgin wool & Inner Mongolian cashmere (85% / 15% blend).',
        x: 54,
        y: 58,
      },
      {
        id: 'hs-cl-3',
        label: 'Cinch Waist Tie & Horn Buckle',
        specification: 'Detachable self-belt with hand-turned smoky buffalo horn hardware.',
        x: 46,
        y: 72,
      },
    ],
    specs: [
      { label: 'Presentation Medium', value: 'High-Resolution Editorial Plates + 2.35× Loupe' },
      { label: 'Textile Weight', value: '640 gsm Double-Faced Wool-Cashmere' },
      { label: 'Construction', value: 'Unlined Hand-Split Blind Seam (26 Hours)' },
      { label: 'Mill Provenance', value: 'Biella, Piedmont, Italy' },
    ],
    features: [
      'Zero cartoon 3D cloth approximations — inspected exclusively via authentic editorial photography',
      'Hand-basted canvas chest piece for permanent lapel roll memory',
      'Deep storm-welted pockets lined in brushed Bemberg cupro',
    ],
  },
  {
    id: 'mv-watch-03',
    name: 'Chronographe Calibre MV-01',
    category: 'Watches',
    subtitle: 'Column-wheel mechanical chronograph in brushed architecture with sapphire crystal',
    price: '$14,800',
    url: '#product-mv-watch-03',
    image: '/images/product-chronograph-watch.jpg',
    modelPath: '/models/atelier-chronograph-watch.glb',
    concept: 'Watch',
    accentColor: '#d4af7a',
    secondaryColor: '#c7cfd6',
    cameraPreset: 'macro',
    lightingPreset: 'jewelry',
    provenanceNote: 'VERIFIED 13-MESH HOROLOGICAL GLB (104,765 VERTICES · 8 PBR MAPS)',
    glbSpecLabel: '104.7k Verts · 13 Meshes',
    craftsmanshipNarrative:
      'Regulated in five positions at our Geneva partner manufacture, the Calibre MV-01 pairs an integrated column-wheel chronograph mechanism with hand-beveled bridges, diamond-polished indices, and a box-domed sapphire crystal.',
    gallery: [
      {
        url: '/images/product-chronograph-watch.jpg',
        label: 'Dress Case & Calfskin Study',
        detail: 'Warm rose-gold dress profile paired with pebble-grain taupe calfskin strap.',
      },
      {
        url: '/images/hero-campaign-editorial.jpg',
        label: 'Wrist Architecture under Cuff',
        detail: '10.8 mm case profile engineered to glide effortlessly beneath a tailored cuff.',
      },
    ],
    hotspots: [
      {
        id: 'hs-wt-1',
        label: 'Box-Domed Sapphire Crystal',
        specification: 'Double-sided anti-reflective coating over diamond-faceted hands.',
        x: 52,
        y: 46,
      },
      {
        id: 'hs-wt-2',
        label: 'Satin-Brushed Case Flank',
        specification: 'Alternating vertical satin brushing and mirror-polished 45° chamfers.',
        x: 64,
        y: 54,
      },
      {
        id: 'hs-wt-3',
        label: 'Hand-Stitched Calfskin Lug',
        specification: 'Curved spring-bar integration with vegetable-tanned saddle lining.',
        x: 42,
        y: 72,
      },
    ],
    specs: [
      { label: '3D Horological Model', value: '13-Mesh Khronos GLB (104,765 Vertices)' },
      { label: 'Calibre Frequency', value: '28,800 vph (4 Hz) · Column-Wheel' },
      { label: 'Power Reserve', value: '72 Hours Twin-Barrel Architecture' },
      { label: 'Case Dimensions', value: '40.0 mm × 10.8 mm · 10 ATM' },
    ],
    features: [
      'Inspectable 104,765-vertex 3D chronograph assembly with tachymeter bezel and sub-dials',
      'Free-sprung balance wheel with variable-inertia gold timing screws',
      'Delivered with bespoke walnut presentation vault and chronometer certificate',
    ],
  },
  {
    id: 'mv-accessory-04',
    name: 'Solstice Titanium Optical Frame',
    category: 'Accessories',
    subtitle: 'Japanese beta-titanium rim architecture with custom CR-39 warm gradient sun lenses',
    price: '$640',
    url: '#product-mv-accessory-04',
    image: '/images/product-titanium-eyewear.jpg',
    modelPath: '/models/atelier-titanium-eyewear.glb',
    concept: 'Eyewear',
    accentColor: '#c9a46b',
    secondaryColor: '#e4ddd3',
    cameraPreset: 'reveal',
    lightingPreset: 'warm-gallery',
    provenanceNote: 'VERIFIED 8-MESH EYEWEAR GLB (7,420 VERTICES) + CARRARA STUDIO PLATE',
    glbSpecLabel: '7.4k Verts · 8 Meshes',
    craftsmanshipNarrative:
      'Stamped and milled in Sabae, Japan from aerospace-grade beta-titanium. The ultra-light 18-gram chassis features custom-torqued monoblock hinges and optical-class nylon lenses with oleophobic and back-surface anti-reflective treatments.',
    gallery: [
      {
        url: '/images/product-titanium-eyewear.jpg',
        label: 'Carrara Marble Still Life',
        detail: 'Warm gold-titanium bridge and gradient lenses photographed on natural stone.',
      },
    ],
    hotspots: [
      {
        id: 'hs-ey-1',
        label: 'Sabae Beta-Titanium Bridge',
        specification: 'Coin-stamped titanium nose bridge with micro-fluted tension relief.',
        x: 50,
        y: 46,
      },
      {
        id: 'hs-ey-2',
        label: 'Nylon Gradient Sun Lens',
        specification: '100% UVA/UVB protection with internal anti-reflective coating.',
        x: 36,
        y: 52,
      },
    ],
    specs: [
      { label: '3D Digital Twin', value: '8-Mesh Khronos GLB (7,420 Vertices)' },
      { label: 'Chassis Alloy', value: 'Sabae Japanese Beta-Titanium (18 g)' },
      { label: 'Lens Optics', value: '2-Base Nylon with Back-AR Coating' },
      { label: 'Dimensions', value: '51 □ 20 — 145 mm' },
    ],
    features: [
      'Real-time 3D frame inspection alongside Carrara marble studio photography',
      'Screwless monoblock hinge tested to 25,000 open/close cycles',
      'Counter-weighted temple tips for zero nasal bridge pressure',
    ],
  },
  {
    id: 'mv-accessory-05',
    name: 'Obsidian Architectural Band Ring',
    category: 'Accessories',
    subtitle: 'Hand-forged 18k rose gold and platinum dual-channel band with flush-set diamond pavé',
    price: '$2,150',
    url: '#product-mv-accessory-05',
    image: '/images/product-signet-rings.jpg',
    modelPath: null,
    concept: 'Rings',
    accentColor: '#c9a46b',
    secondaryColor: '#d8d0c5',
    cameraPreset: 'macro',
    lightingPreset: 'jewelry',
    provenanceNote: 'MACRO STILL-LIFE PHOTOGRAPHY · 2.35× OPTICAL GEM & ALLOY LOUPE',
    craftsmanshipNarrative:
      'Forged from recycled 18k rose gold fused with a high-density 950 platinum inner sleeve. The stepped architectural bevels frame flush-set VVS1 brilliant-cut diamonds that catch ambient light with restrained precision.',
    gallery: [
      {
        url: '/images/product-signet-rings.jpg',
        label: 'Obsidian Leather Macro Plate',
        detail: 'Chiaroscuro studio macro highlighting brushed rose gold and flush diamond setting.',
      },
    ],
    hotspots: [
      {
        id: 'hs-rg-1',
        label: 'Flush-Set VVS1 Pavé Channel',
        specification: 'Microscope-set brilliant diamonds recessed within a 950 platinum bezel.',
        x: 49,
        y: 48,
      },
      {
        id: 'hs-rg-2',
        label: 'Comfort-Turned Interior Bore',
        specification: 'Court-profile interior chamfered for effortless daily wear.',
        x: 60,
        y: 58,
      },
    ],
    specs: [
      { label: 'Presentation Medium', value: 'Macro Still-Life Plate + 2.35× Loupe' },
      { label: 'Precious Alloys', value: '18k Rose Gold & 950 Platinum' },
      { label: 'Stone Specification', value: '0.42 ct tw VVS1 F-G Pavé' },
      { label: 'Hallmark', value: 'Assayed in Paris, France' },
    ],
    features: [
      'High-resolution macro photography reveals true alloy grain and stone refraction',
      'Seamless bi-metal sintered bond between rose gold and platinum',
      'Individually numbered inside the band with bespoke sizing guarantee',
    ],
  },
  {
    id: 'mv-accessory-06',
    name: 'Monolith Structured Weekender',
    category: 'Accessories',
    subtitle: 'Full-grain matte black calfskin & ballistic architectural carryall with anodized hardware',
    price: '$2,450',
    url: '#product-mv-accessory-06',
    image: '/images/product-leather-weekender.jpg',
    modelPath: null,
    concept: 'Gear',
    accentColor: '#b8945f',
    secondaryColor: '#9c968f',
    cameraPreset: 'architectural',
    lightingPreset: 'warm-gallery',
    provenanceNote: 'CHIAROSCURO STUDIO PHOTOGRAPHY · 2.35× LEATHER GRAIN LOUPE',
    craftsmanshipNarrative:
      'Engineered to retain its crisp architectural silhouette whether empty or fully packed for a 72-hour departure. Hand-edged matte black calfskin panels are reinforced with high-tenacity ballistic weave and matte-anodized solid brass closures.',
    gallery: [
      {
        url: '/images/product-leather-weekender.jpg',
        label: 'Chiaroscuro Monolith Study',
        detail: 'Low-key directional studio lighting emphasizing structured gussets and seam relief.',
      },
    ],
    hotspots: [
      {
        id: 'hs-wk-1',
        label: 'Hand-Painted Waxed Edges',
        specification: 'Five coats of heated Fenice edge paint sanded smooth between applications.',
        x: 45,
        y: 38,
      },
      {
        id: 'hs-wk-2',
        label: 'Structured Gusset Spine',
        specification: 'Internal memory-polymer framing maintains vertical posture under load.',
        x: 58,
        y: 64,
      },
    ],
    specs: [
      { label: 'Presentation Medium', value: 'Chiaroscuro Studio Plate + 2.35× Loupe' },
      { label: 'Exterior Hide', value: 'Full-Grain Matte Calfskin & Ballistic Cordura' },
      { label: 'Hardware', value: 'PVD Matte-Black Solid Brass' },
      { label: 'Cabin Volume', value: '38 Liters · IATA Carry-On Compliant' },
    ],
    features: [
      'Dedicated padded 16-inch folio vault and passport security pocket',
      'Hand-stitched load-bearing handle anchors reinforced with hidden titanium plates',
      'Includes waterproofed linen dust cover and serialized luggage tag',
    ],
  },
];

const CATEGORIES = ['All', 'Footwear', 'Designer Clothing', 'Watches', 'Accessories'] as const;

export function AutoCinematicSite() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProduct, setActiveProduct] = useState<PhotorealShowcaseProduct>(PRODUCTS[0]);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>(SITE_CONFIG.cameraPreset);
  const [activeLighting, setActiveLighting] = useState<LightingPreset>(SITE_CONFIG.lightingPreset);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [inspectProduct, setInspectProduct] = useState<PhotorealShowcaseProduct | null>(null);
  const [cartItems, setCartItems] = useState<{ product: PhotorealShowcaseProduct; qty: number }[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [heroStageMode, setHeroStageMode] = useState<'editorial-photo' | 'live-3d-glb'>(
    'editorial-photo',
  );
  const [reservationConfirmed, setReservationConfirmed] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      setScrollProgress(Math.min(1, Math.max(0, window.scrollY / maxScroll)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.mv-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 86%',
              toggleActions: 'play none none none',
            },
          },
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const matchesQuery =
        !searchQuery.trim() ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    }).sort((a, b) => {
      const parsePrice = (p: string) => Number(p.replace(/[^0-9.]/g, '')) || 0;
      if (sortBy === 'price-asc') return parsePrice(a.price) - parsePrice(b.price);
      if (sortBy === 'price-desc') return parsePrice(b.price) - parsePrice(a.price);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const siteProductsForModules: SiteProduct[] = useMemo(
    () =>
      PRODUCTS.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.subtitle,
        imagePath: p.image,
        modelPath: p.modelPath,
        price: Number(p.price.replace(/[^0-9.]/g, '')) || 0,
        currency: 'USD',
        concept: p.concept,
        category: p.category,
        specs: Object.fromEntries(p.specs.map((s) => [s.label, s.value])),
      })),
    [],
  );

  const handleSelectDiscipline = (category: string) => {
    setSelectedCategory(category);
    const match =
      category === 'All'
        ? PRODUCTS[0]
        : PRODUCTS.find((p) => p.category === category) || PRODUCTS[0];
    setActiveProduct(match);
    if (match.cameraPreset) setActiveCamera(match.cameraPreset);
    if (match.lightingPreset) setActiveLighting(match.lightingPreset);
  };

  const handleReserve = (product: PhotorealShowcaseProduct) => {
    setReservationConfirmed(false);
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prev, { product, qty: 1 }];
    });
    setIsDrawerOpen(true);
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalAllocationValue = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const numeric = Number(item.product.price.replace(/[^0-9.]/g, '')) || 0;
      return sum + numeric * item.qty;
    }, 0);
  }, [cartItems]);

  const totalBagCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.qty, 0),
    [cartItems],
  );

  return (
    <SmoothScroll>
      <div ref={rootRef} className="studio-page mv-luxury-root">
        <ScrollWorldBackground
          products={PRODUCTS}
          activeProductId={activeProduct.id}
          onSelectProduct={(product) => {
            setActiveProduct(product);
            if (product.cameraPreset) setActiveCamera(product.cameraPreset);
            if (product.lightingPreset) setActiveLighting(product.lightingPreset);
          }}
          onInspectProduct={(product) => setInspectProduct(product)}
        />
        <header className="studio-nav mv-header">
        <div className="mv-header__left">
          <a href="#top" className="mv-brand-mark">
            <span className="mv-brand-mark__name">{SITE_CONFIG.brand}</span>
            <span className="mv-brand-mark__sub">PARIS · MILANO · GENÈVE</span>
          </a>
        </div>

        <nav className="studio-nav-links" aria-label="Maison navigation">
          <a href="#campaign-lookbook">Campaign</a>
          <a href="#atelier-showcase">Interactive Atelier</a>
          <a href="#craftsmanship-triptych">Savoir-Faire</a>
          <a href="#collection-archive">Collection ({PRODUCTS.length})</a>
        </nav>

        <div className="mv-header__actions">
          <button
            type="button"
            className="mv-bag-trigger"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open Atelier Allocation Bag"
          >
            <span>ATELIER BAG</span>
            <strong className="mv-bag-count">{totalBagCount}</strong>
          </button>
        </div>
      </header>

      <main id="top">
        {/* SECTION 1: PHOTOGRAPHY-LED EDITORIAL CAMPAIGN HERO */}
        <section className="mv-hero" aria-label="Autumn Winter Atelier Campaign">
          <div className="mv-hero__grid">
            <div className="mv-hero__editorial-col">
              <div className="mv-hero__eyebrow-row">
                <span className="mv-mono-kicker">AUTUMN / WINTER ARCHIVE · EDITION 06</span>
                <span className="mv-hero__verified-pill">PHOTOGRAPHY + KHRONOS PBR GLB</span>
              </div>

              <h1 className="mv-hero__headline">
                Architectural form, <em>unapologetic</em> material truth.
              </h1>

              <p className="mv-hero__lead">
                Created for collectors who reject synthetic compromises. Inspect double-faced
                Biella cashmere through high-resolution campaign plates, or orbit 104,765-vertex
                horological and footwear digital twins under physically calibrated studio light.
              </p>

              <div className="mv-hero__cta-row">
                <a href="#atelier-showcase" className="studio-button studio-button--primary">
                  Enter Interactive Atelier
                </a>
                <a href="#collection-archive" className="studio-button studio-button--ghost">
                  Explore 6 Archive Pieces
                </a>
              </div>

              <div className="mv-hero__disciplines" role="navigation" aria-label="House disciplines">
                {(['Footwear', 'Designer Clothing', 'Watches', 'Accessories'] as const).map(
                  (disc, idx) => {
                    const rep = PRODUCTS.find((p) => p.category === disc)!;
                    const hasGlb = isVerifiedGlbPath(rep.modelPath);
                    return (
                      <a
                        key={disc}
                        href="#atelier-showcase"
                        className={`mv-discipline-card ${
                          activeProduct.category === disc ? 'is-active' : ''
                        }`}
                        onClick={() => handleSelectDiscipline(disc)}
                      >
                        <div className="mv-discipline-card__top">
                          <span className="mv-mono-kicker">0{idx + 1}</span>
                          <span className="mv-discipline-card__medium">
                            {hasGlb ? '3D GLB + PHOTO' : '2.35× PHOTO LOUPE'}
                          </span>
                        </div>
                        <strong>{disc}</strong>
                        <span>{rep.name}</span>
                      </a>
                    );
                  },
                )}
              </div>
            </div>

            <div className="mv-hero__visual-col">
              <div className="mv-hero__stage-switcher">
                <button
                  type="button"
                  className={heroStageMode === 'editorial-photo' ? 'is-active' : ''}
                  onClick={() => setHeroStageMode('editorial-photo')}
                >
                  Campaign Photography Plate
                </button>
                <button
                  type="button"
                  className={heroStageMode === 'live-3d-glb' ? 'is-active' : ''}
                  onClick={() => setHeroStageMode('live-3d-glb')}
                >
                  Live 3D Horology &amp; Footwear GLB
                </button>
              </div>

              {heroStageMode === 'editorial-photo' ? (
                <div className="mv-hero__photo-composition">
                  <figure className="mv-hero__primary-plate">
                    <img
                      src="/images/hero-campaign-editorial.jpg"
                      alt="Tailored navy-charcoal wool suiting and chronograph watch on architectural stone stairs"
                    />
                    <figcaption className="mv-hero__plate-caption">
                      <div>
                        <span className="mv-mono-kicker">CAMPAIGN PLATE I · MILANO</span>
                        <strong>Tailored Wool &amp; Calibre MV-01 Chronograph</strong>
                      </div>
                      <button
                        type="button"
                        className="mv-inline-link"
                        onClick={() => {
                          const watch = PRODUCTS.find((p) => p.id === 'mv-watch-03')!;
                          setActiveProduct(watch);
                          setHeroStageMode('live-3d-glb');
                        }}
                      >
                        Inspect Watch in 3D GLB →
                      </button>
                    </figcaption>
                  </figure>

                  <figure className="mv-hero__secondary-plate">
                    <img
                      src="/images/editorial-coat-drape.jpg"
                      alt="Nocturne Double-Faced Camel Cashmere Coat on architectural granite steps"
                    />
                    <figcaption>
                      <span className="mv-mono-kicker">LOOK 02 · BIELLA CASHMERE</span>
                      <strong>Nocturne Double-Faced Coat — $3,450</strong>
                    </figcaption>
                  </figure>
                </div>
              ) : (
                <div className="mv-hero__live-glb-frame">
                  <ModelViewport
                    modelPath={
                      isVerifiedGlbPath(activeProduct.modelPath)
                        ? activeProduct.modelPath
                        : '/models/atelier-chronograph-watch.glb'
                    }
                    concept={activeProduct.concept}
                    accentColor={activeProduct.accentColor}
                    secondaryColor={activeProduct.secondaryColor}
                    cameraPreset={activeCamera}
                    lightingPreset={activeLighting}
                    posterImage={activeProduct.image}
                    title={
                      isVerifiedGlbPath(activeProduct.modelPath)
                        ? activeProduct.name
                        : 'Chronographe Calibre MV-01'
                    }
                    subtitle="Verified Khronos PBR GLB · Real-Time Studio IBL"
                    scrollProgress={scrollProgress}
                    allowProceduralConcept={false}
                    provenanceLabel="VERIFIED KHRONOS PBR GLB · CC-BY-4.0"
                  />
                  <div className="mv-hero__glb-quickpick">
                    {PRODUCTS.filter((p) => isVerifiedGlbPath(p.modelPath)).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className={activeProduct.id === p.id ? 'is-active' : ''}
                        onClick={() => setActiveProduct(p)}
                      >
                        <span>{p.category}</span>
                        <strong>{p.name}</strong>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 2: BESPOKE CATEGORY SHOWCASE (FOOTWEAR / CLOTHING / WATCHES / ACCESSORIES) */}
        <section
          id="atelier-showcase"
          className="mv-section mv-reveal"
          aria-label="Interactive Discipline Showcase"
        >
          <div className="mv-section__header">
            <div>
              <span className="mv-mono-kicker">
                DISCIPLINE-SPECIFIC INSPECTION · REAL GLB &amp; 2.35× OPTICAL LOUPE
              </span>
              <h2 className="mv-section__title">
                Four disciplines, four bespoke visual mediums.
              </h2>
            </div>
            <p className="mv-section__desc">
              Select a piece below. Footwear, Horology, and Optical frames load verified PBR{' '}
              <code>.glb</code> assets with dynamic IBL studio lighting; Designer Clothing, Fine
              Jewelry, and Leather Goods engage our 2.35× optical photography loupe.
            </p>
          </div>

          <div className="mv-product-strip" role="tablist" aria-label="Select archive piece">
            {PRODUCTS.map((item, idx) => {
              const hasGlb = isVerifiedGlbPath(item.modelPath);
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={activeProduct.id === item.id}
                  className={`mv-strip-tab ${activeProduct.id === item.id ? 'is-active' : ''}`}
                  onClick={() => setActiveProduct(item)}
                >
                  <img src={item.image} alt={item.name} loading="lazy" />
                  <div className="mv-strip-tab__meta">
                    <span className="mv-mono-kicker">
                      0{idx + 1} · {item.category.toUpperCase()}
                    </span>
                    <strong>{item.name}</strong>
                    <small>{hasGlb ? 'Verified 3D GLB + Photo' : 'Editorial Photo + Loupe'}</small>
                  </div>
                </button>
              );
            })}
          </div>

          <PhotorealProductShowcase
            product={activeProduct}
            activeLighting={activeLighting}
            onLightingChange={setActiveLighting}
            onReserveProduct={handleReserve}
            onInspectProduct={(p) => setInspectProduct(p)}
            scrollProgress={scrollProgress}
          />
        </section>

        {/* SECTION 3: EDITORIAL SAVOIR-FAIRE & CRAFTSMANSHIP TRIPTYCH */}
        <section
          id="craftsmanship-triptych"
          className="mv-section mv-triptych-section mv-reveal"
          aria-label="Editorial Savoir-Faire Triptych"
        >
          <div className="mv-section__header">
            <div>
              <span className="mv-mono-kicker">SAVOIR-FAIRE · MATERIAL PROVENANCE</span>
              <h2 className="mv-section__title">
                Photographed in natural shadow, never simulated.
              </h2>
            </div>
            <p className="mv-section__desc">
              True luxury rests in the tension of a hand-picked lapel, the brushed grain of
              double-faced cashmere, and the mirror bevel of a chronograph bridge.
            </p>
          </div>

          <div className="mv-triptych-grid" id="campaign-lookbook">
            <article className="mv-triptych-card mv-triptych-card--tall">
              <div className="mv-triptych-card__media">
                <img
                  src="/images/editorial-coat-drape.jpg"
                  alt="Camel double-faced wool-cashmere coat with wide peak lapels"
                  loading="lazy"
                />
              </div>
              <div className="mv-triptych-card__body">
                <span className="mv-mono-kicker">CHAPTER I · BIELLA MILL ARCHIVE</span>
                <h3>Unlined Double-Faced Cashmere Architecture</h3>
                <p>
                  By splitting two ply-woven layers of virgin wool and Inner Mongolian cashmere by
                  hand, our tailors fold and blind-stitch every seam edge internally—yielding a
                  640 gsm overcoat that moves like liquid shadow.
                </p>
                <button
                  type="button"
                  className="mv-inline-link"
                  onClick={() => {
                    const coat = PRODUCTS.find((p) => p.id === 'mv-clothing-02')!;
                    setActiveProduct(coat);
                    document
                      .getElementById('atelier-showcase')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Inspect Coat in 2.35× Textile Loupe →
                </button>
              </div>
            </article>

            <article className="mv-triptych-card">
              <div className="mv-triptych-card__media">
                <img
                  src="/images/editorial-coat-detail.jpg"
                  alt="Warm tonal cashmere and wool knitwear archive on atelier rail"
                  loading="lazy"
                />
              </div>
              <div className="mv-triptych-card__body">
                <span className="mv-mono-kicker">CHAPTER II · TONAL PALETTE</span>
                <h3>Undyed Camel, Espresso &amp; Raw Travertine</h3>
                <p>
                  Our colour library draws exclusively from raw mineral and fleece tones, ensuring
                  every garment ages with quiet patina across decades.
                </p>
              </div>
            </article>

            <article className="mv-triptych-card">
              <div className="mv-triptych-card__media">
                <img
                  src="/images/editorial-bomber-studio.jpg"
                  alt="Terracotta-bronze technical silk jacket on wooden hanger"
                  loading="lazy"
                />
              </div>
              <div className="mv-triptych-card__body">
                <span className="mv-mono-kicker">CHAPTER III · TECHNICAL SILK</span>
                <h3>High-Twist Japanese Filament Outerwear</h3>
                <p>
                  Woven in Fukui from high-density memory silk-nylon that repels mist while
                  holding sculptural sleeve volume under directional studio light.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* SECTION 4: PRE-COLLECTION TOOLKIT EXPERIENCE MODULES */}
        <ExperienceModules slot="pre-collection"
          modules={['editorial', 'process', 'compare', 'metrics']}
          brand={SITE_CONFIG.brand}
          category="fashion"
          summary={SITE_CONFIG.subtitle}
          chapters={[
            'Photogrammetry-grade 3D footwear with Italian suede and Vibram architecture',
            'Double-faced 640 gsm Biella cashmere inspected via 2.35x optical textile loupe',
            '13-mesh column-wheel horology and Sabae beta-titanium optical engineering',
          ]}
          products={siteProductsForModules}
          onOpen={(idx) => setInspectProduct(PRODUCTS[idx] || PRODUCTS[0])}
          reducedMotion={false}
        />

        {/* SECTION 5: COMPLETE COLLECTION ARCHIVE & DISCOVERY GRID */}
        <section
          id="collection-archive"
          className="mv-section mv-archive-section mv-reveal"
          aria-label="Complete Collection Archive"
        >
          <div className="mv-section__header">
            <div>
              <span className="mv-mono-kicker">AUTUMN / WINTER ARCHIVE · 06 PIECES</span>
              <h2 className="mv-section__title">Complete Collection &amp; Provenance Index</h2>
            </div>

            <div className="mv-archive-controls">
              <div className="mv-category-pills" role="tablist" aria-label="Filter by discipline">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={selectedCategory === cat}
                    className={selectedCategory === cat ? 'is-active' : ''}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="mv-search-sort">
                <input
                  type="search"
                  placeholder="Search silhouette or material..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search archive pieces"
                />
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'name')
                  }
                  aria-label="Sort collection"
                >
                  <option value="featured">Curated Order</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mv-collection-grid">
            {filteredProducts.map((product) => {
              const hasGlb = isVerifiedGlbPath(product.modelPath);
              return (
                <article key={product.id} className="mv-archive-card">
                  <div
                    className="mv-archive-card__media"
                    onClick={() => setInspectProduct(product)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setInspectProduct(product);
                    }}
                  >
                    <img src={product.image} alt={product.name} loading="lazy" />
                    <div className="mv-archive-card__badges">
                      <span className="mv-badge-category">{product.category}</span>
                      <span className={`mv-badge-medium ${hasGlb ? 'is-glb' : 'is-photo'}`}>
                        {hasGlb ? `3D GLB (${product.glbSpecLabel})` : '2.35× Photo Loupe'}
                      </span>
                    </div>
                  </div>

                  <div className="mv-archive-card__body">
                    <div className="mv-archive-card__title-row">
                      <h3>{product.name}</h3>
                      <strong className="mv-archive-card__price">{product.price}</strong>
                    </div>
                    <p className="mv-archive-card__sub">{product.subtitle}</p>

                    <div className="mv-archive-card__specs-mini">
                      {product.specs.slice(0, 2).map((s) => (
                        <div key={s.label}>
                          <span>{s.label}</span>
                          <strong>{s.value}</strong>
                        </div>
                      ))}
                    </div>

                    <div className="mv-archive-card__actions">
                      <button
                        type="button"
                        className="studio-button studio-button--primary"
                        onClick={() => handleReserve(product)}
                      >
                        Reserve Piece
                      </button>
                      <button
                        type="button"
                        className="studio-button studio-button--ghost"
                        onClick={() => {
                          setActiveProduct(product);
                          document
                            .getElementById('atelier-showcase')
                            ?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Load in Stage
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* SECTION 6: POST-COLLECTION TOOLKIT EXPERIENCE MODULES */}
        <ExperienceModules slot="post-collection"
          modules={['editorial', 'process', 'compare', 'metrics']}
          brand={SITE_CONFIG.brand}
          category="fashion"
          summary={SITE_CONFIG.subtitle}
          chapters={[
            'Photogrammetry-grade 3D footwear with Italian suede and Vibram architecture',
            'Double-faced 640 gsm Biella cashmere inspected via 2.35x optical textile loupe',
            '13-mesh column-wheel horology and Sabae beta-titanium optical engineering',
          ]}
          products={siteProductsForModules}
          onOpen={(idx) => setInspectProduct(PRODUCTS[idx] || PRODUCTS[0])}
          reducedMotion={false}
        />

        {/* SECTION 7: ASSET PROVENANCE & PIPELINE TRANSPARENCY LEDGER */}
        <section className="mv-section mv-provenance-ledger mv-reveal" aria-label="Asset Provenance">
          <div className="mv-provenance-ledger__box">
            <div>
              <span className="mv-mono-kicker">ASSET PIPELINE &amp; PROVENANCE VERIFICATION</span>
              <h3>Verified Media Architecture (Universal Cinematic Studio v6.2)</h3>
              <p>
                Every visual asset on this storefront is tracked in{' '}
                <code>/asset-provenance.json</code>. Three pieces feature Khronos Group CC-BY-4.0
                PBR <code>.glb</code> models within the 8 MiB GPU budget; all six pieces feature
                licensed, unbranded studio and editorial photography.
              </p>
            </div>
            <div className="mv-provenance-ledger__meta">
              <div>
                <span>3D PBR Models</span>
                <strong>3 Khronos CC-BY-4.0 GLBs (125.7k Total Vertices)</strong>
              </div>
              <div>
                <span>Photographic Plates</span>
                <strong>9 High-Resolution JPEG Plates (0 SVG Placeholders)</strong>
              </div>
              <div>
                <span>Gemini Image API Diagnostic</span>
                <strong>{GEMINI_IMAGE_PIPELINE_STATUS.status} (Free Tier Limit: 0)</strong>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: OPT-IN EXPERIMENTAL 3D SILHOUETTE LAB */}
        <ExperimentalConceptLab />
      </main>

      {/* FULLSCREEN PRODUCT DOSSIER MODAL */}
      {inspectProduct && (
        <div
          className="studio-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${inspectProduct.name} Dossier`}
          onClick={() => setInspectProduct(null)}
        >
          <div className="studio-modal mv-dossier-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mv-dossier-modal__header">
              <div>
                <span className="mv-mono-kicker">
                  {inspectProduct.category.toUpperCase()} · {inspectProduct.provenanceNote}
                </span>
                <h2>{inspectProduct.name}</h2>
              </div>
              <button
                type="button"
                className="studio-button studio-button--ghost"
                onClick={() => setInspectProduct(null)}
              >
                Close Dossier ×
              </button>
            </div>

            <div className="mv-dossier-modal__grid">
              <div className="mv-dossier-modal__viewport">
                <ModelViewport
                  modelPath={inspectProduct.modelPath}
                  concept={inspectProduct.concept}
                  accentColor={inspectProduct.accentColor}
                  secondaryColor={inspectProduct.secondaryColor}
                  cameraPreset={inspectProduct.cameraPreset || 'reveal'}
                  lightingPreset={activeLighting}
                  posterImage={inspectProduct.image}
                  title={inspectProduct.name}
                  subtitle={inspectProduct.subtitle}
                  allowProceduralConcept={false}
                  provenanceLabel={inspectProduct.provenanceNote}
                />
              </div>

              <div className="mv-dossier-modal__info">
                <strong className="mv-dossier-price">{inspectProduct.price}</strong>
                <p>{inspectProduct.craftsmanshipNarrative}</p>
                <dl className="mv-dossier-specs">
                  {inspectProduct.specs.map((s) => (
                    <div key={s.label} className="mv-dossier-specs__row">
                      <dt>{s.label}</dt>
                      <dd>{s.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mv-dossier-actions">
                  <button
                    type="button"
                    className="studio-button studio-button--primary"
                    onClick={() => {
                      handleReserve(inspectProduct);
                      setInspectProduct(null);
                    }}
                  >
                    Add to Atelier Allocation — {inspectProduct.price}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ATELIER ALLOCATION / RESERVATION DRAWER */}
      {isDrawerOpen && (
        <div
          className="studio-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Atelier Allocation Bag"
          onClick={() => setIsDrawerOpen(false)}
        >
          <aside className="mv-allocation-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mv-allocation-drawer__head">
              <div>
                <span className="mv-mono-kicker">PRIVATE CLIENT SERVICES</span>
                <h3>Atelier Allocation Bag ({totalBagCount})</h3>
              </div>
              <button
                type="button"
                className="studio-button studio-button--ghost"
                onClick={() => setIsDrawerOpen(false)}
              >
                Close ×
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="mv-allocation-drawer__empty">
                <p>Your private allocation dossier is currently empty.</p>
                <span>Select any piece from the collection to request an atelier reservation.</span>
              </div>
            ) : (
              <>
                <ul className="mv-allocation-drawer__list">
                  {cartItems.map(({ product, qty }) => (
                    <li key={product.id} className="mv-allocation-item">
                      <img src={product.image} alt={product.name} />
                      <div className="mv-allocation-item__info">
                        <span>{product.category}</span>
                        <strong>{product.name}</strong>
                        <small>
                          {product.price} × {qty}
                        </small>
                      </div>
                      <button
                        type="button"
                        className="mv-allocation-item__remove"
                        onClick={() => handleRemoveCartItem(product.id)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mv-allocation-drawer__foot">
                  <div className="mv-allocation-total">
                    <span>Estimated Allocation Total</span>
                    <strong>${totalAllocationValue.toLocaleString()}</strong>
                  </div>

                  {reservationConfirmed ? (
                    <div className="mv-allocation-confirmed">
                      <strong>Private Client Dossier Registered</strong>
                      <p>
                        No online card capture is performed on this preview. A Maison Véra client
                        advisor prepares bespoke sizing and provenance documentation upon request.
                      </p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="studio-button studio-button--primary"
                      style={{ width: '100%' }}
                      onClick={() => setReservationConfirmed(true)}
                    >
                      Request Private Client Appointment
                    </button>
                  )}
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      <footer className="mv-footer">
        <div className="mv-footer__inner">
          <div>
            <strong>{SITE_CONFIG.brand}</strong>
            <p>{SITE_CONFIG.tagline}</p>
          </div>
          <div className="mv-footer__meta">
            <span>Universal Cinematic Studio v6.2 · Motion + Scroll-World Architecture</span>
            <span>Khronos CC-BY-4.0 PBR GLB Assets · Licensed Editorial Photography</span>
          </div>
        </div>
      </footer>
      </div>
    </SmoothScroll>
  );
}

export default AutoCinematicSite;
