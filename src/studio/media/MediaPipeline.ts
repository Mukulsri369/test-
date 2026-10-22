import provenanceData from '../../../asset-provenance.json';

export type MediaRepresentationMode =
  | 'verified-glb-and-photography'
  | 'photography-primary'
  | 'experimental-silhouette';

export interface MediaAssetRecord {
  id: string;
  path: string;
  type: 'editorial-photography' | 'product-photography' | 'verified-3d-glb';
  category: string;
  source: string;
  license: string;
  verifiedUnbranded: boolean;
  subject: string;
  resolution?: string;
  fileSizeMiB?: number;
  vertices?: number;
  meshes?: number;
  textures?: number;
}

export interface ProductMediaSpec {
  productId: string;
  representationMode: MediaRepresentationMode;
  primaryPhoto: string;
  galleryPhotos: {
    url: string;
    caption: string;
    focalPoint?: string;
  }[];
  verifiedGlbPath: string | null;
  glbProvenanceLabel?: string;
  glbPolycountLabel?: string;
  materialCallouts: {
    label: string;
    detail: string;
    coordinates: { x: number; y: number };
  }[];
}

export const GEMINI_IMAGE_PIPELINE_STATUS = provenanceData.geminiImageGenerationStatus;

export const VERIFIED_ASSET_REGISTRY: MediaAssetRecord[] =
  provenanceData.assets as MediaAssetRecord[];

export function isVerifiedGlbPath(modelPath?: string | null): boolean {
  if (!modelPath) return false;
  return VERIFIED_ASSET_REGISTRY.some(
    (asset) => asset.type === 'verified-3d-glb' && asset.path === modelPath,
  );
}

export function isVerifiedPhotoPath(imagePath?: string | null): boolean {
  if (!imagePath) return false;
  if (imagePath.endsWith('.svg')) return false;
  return VERIFIED_ASSET_REGISTRY.some(
    (asset) =>
      (asset.type === 'editorial-photography' || asset.type === 'product-photography') &&
      asset.path === imagePath,
  );
}

export function getAssetProvenance(path: string): MediaAssetRecord | undefined {
  return VERIFIED_ASSET_REGISTRY.find((asset) => asset.path === path);
}
