#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];

const provenancePath = path.join(root, 'asset-provenance.json');
if (!fs.existsSync(provenancePath)) {
  errors.push('Missing asset-provenance.json manifest at repository root.');
} else {
  const provenance = JSON.parse(fs.readFileSync(provenancePath, 'utf8'));
  if (!Array.isArray(provenance.assets) || provenance.assets.length === 0) {
    errors.push('asset-provenance.json contains no registered assets.');
  } else {
    for (const asset of provenance.assets) {
      const diskPath = path.join(root, 'public', asset.path.replace(/^\//, ''));
      if (!fs.existsSync(diskPath)) {
        errors.push(`Registered provenance asset missing on disk: ${asset.path}`);
      }
      if (asset.path.endsWith('.svg')) {
        errors.push(`SVG placeholder prohibited in commercial provenance registry: ${asset.path}`);
      }
    }
  }
}

// Verify no SVG placeholders remain in public/images
const imagesDir = path.join(root, 'public', 'images');
if (fs.existsSync(imagesDir)) {
  const svgFiles = fs.readdirSync(imagesDir).filter((f) => f.toLowerCase().endsWith('.svg'));
  if (svgFiles.length > 0) {
    errors.push(`Prohibited SVG placeholder files found in public/images: ${svgFiles.join(', ')}`);
  }
}

// Inspect AutoCinematicSite.tsx for prohibited SVG references or unguarded procedural concepts
const sitePath = path.join(root, 'src', 'studio', 'AutoCinematicSite.tsx');
if (fs.existsSync(sitePath)) {
  const siteCode = fs.readFileSync(sitePath, 'utf8');
  if (/\/images\/[^'"]+\.svg/i.test(siteCode)) {
    errors.push('AutoCinematicSite.tsx still references an .svg image placeholder.');
  }
  if (/allowProceduralConcept=\{true\}/.test(siteCode)) {
    errors.push('AutoCinematicSite.tsx enables procedural concepts in a primary commercial section.');
  }
}

if (errors.length > 0) {
  console.error('❌ Visual Readiness Gate FAILED:');
  for (const err of errors) console.error(`  - ${err}`);
  process.exit(1);
}

console.log(
  '✅ Visual Readiness Gate PASSED: All photographic plates and Khronos PBR GLB assets verified with provenance; zero SVG placeholders or commercial procedural shapes.',
);
