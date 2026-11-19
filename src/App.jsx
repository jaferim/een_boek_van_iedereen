import { OrbitControls, useTexture } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const TOTAL_PAGES = 48;
const COVER_DEPTH = 0.07;
const PAGE_DEPTH = 0.005;
const PAGE_WIDTH = 1;
const PAGE_HEIGHT = 1.42;

const PAPER_TEXTURE_PATHS = {
  map: "/textures/Paper001_4K-JPG/Paper001_4K_Color.jpg",
  normalMap: "/textures/Paper001_4K-JPG/Paper001_4K_NormalGL.jpg",
  roughnessMap: "/textures/Paper001_4K-JPG/Paper001_4K_Roughness.jpg",
};

// Leather026_1K-JPG_Color.jpg is near-black, so we omit `map` and tint with a light cover color
// while keeping the leather grain from normalMap + roughnessMap.
const COVER_TEXTURE_PATHS = {
  normalMap: "/textures/Leather026_1K-JPG/Leather026_1K-JPG_NormalGL.jpg",
  roughnessMap: "/textures/Leather026_1K-JPG/Leather026_1K-JPG_Roughness.jpg",
};

const COVER_COLOR = "#f6f6f6";

const configureTexture = (texture, isColorMap) => {
  if (isColorMap) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }

  // NearestFilter on minFilter skips mipmap sampling, so disabling mipmaps saves ~33% VRAM
  texture.generateMipmaps = false;
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;

  // Match the 1 : 1.42 page aspect ratio so the square 1:1 texture doesn't stretch vertically
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(PAGE_WIDTH, PAGE_HEIGHT);

  texture.needsUpdate = true;
};

const configurePaperTextures = (textures) => {
  textures.forEach((texture, index) => configureTexture(texture, index === 0));
};

const configureCoverTextures = (textures) => {
  textures.forEach((texture) => configureTexture(texture, false));
};

/**
 * A simple page component using SkinnedMesh and Bones so it can bend.
 */
const Page = ({
  rotationY = 0,
  bend = 0.2,
  depth = PAGE_DEPTH,
  zOffset = 0,
  textures,
  color = "#ffffff",
}) => {
  const meshRef = useRef(null);

  const mesh = useMemo(() => {
    // 1. GEOMETRY: Add segments along width (10 segments) so the mesh has vertices to bend
    const widthSegments = 10;
    const geo = new THREE.BoxGeometry(
      PAGE_WIDTH,
      PAGE_HEIGHT,
      depth,
      widthSegments,
      1,
      1,
    );

    // Move pivot so x = 0 is the spine/left edge, and shift along z so covers sit behind the pages
    geo.translate(PAGE_WIDTH / 2, 0, zOffset);

    // 2. BONES: Create a bone hierarchy
    // bone0 sits at the spine (x = 0)
    // bone1 sits at the outer edge (x = PAGE_WIDTH)
    const bone0 = new THREE.Bone();
    const bone1 = new THREE.Bone();
    bone0.position.set(0, 0, 0);
    bone1.position.set(PAGE_WIDTH, 0, 0); // relative to bone0
    bone0.add(bone1); // bone1 is a child of bone0

    // 3. SKELETON: Groups the bones together
    const skeleton = new THREE.Skeleton([bone0, bone1]);

    // 4. SKIN WEIGHTS: Define how much each bone influences each vertex
    const pos = geo.attributes.position;
    const skinIndices = [];
    const skinWeights = [];

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      // Normalized position: 0 at spine -> 1 at outer edge
      const t = Math.max(0, Math.min(1, x / PAGE_WIDTH));

      // Each vertex is influenced by Bone 0 (index 0) and Bone 1 (index 1)
      skinIndices.push(0, 1, 0, 0);

      // (1 - t) weight for spine bone, (t) weight for outer bone. Total must equal 1.
      skinWeights.push(1 - t, t, 0, 0);
    }

    geo.setAttribute(
      "skinIndex",
      new THREE.Uint16BufferAttribute(skinIndices, 4),
    );
    geo.setAttribute(
      "skinWeight",
      new THREE.Float32BufferAttribute(skinWeights, 4),
    );

    // 5. SKINNED MESH: Create the mesh and bind the skeleton immediately
    const mat = new THREE.MeshStandardMaterial({
      ...textures,
      color,
      wireframe: false, // tip: set to true to visualize the bends!
    });
    const skinnedMesh = new THREE.SkinnedMesh(geo, mat);

    // Root bone must be added to the mesh hierarchy
    skinnedMesh.add(bone0);

    // Bind the skeleton so Three.js knows how to transform vertices
    skinnedMesh.bind(skeleton);

    return skinnedMesh;
  }, [depth, zOffset, textures, color]);

  // Clean up GPU geometry and material when recreated or unmounted
  useEffect(() => {
    return () => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    };
  }, [mesh]);

  // 6. BENDING: Mutate Three.js objects inside an effect (or useFrame)
  useEffect(() => {
    const bone1 = meshRef.current?.skeleton?.bones[1];
    if (bone1) {
      bone1.rotation.y = bend;
    }
  }, [bend]);

  return <primitive ref={meshRef} object={mesh} rotation-y={rotationY} />;
};

const Book = () => {
  // Load and configure paper & leather textures once for the whole book instead of per page
  const paperTextures = useTexture(PAPER_TEXTURE_PATHS, configurePaperTextures);
  const coverTextures = useTexture(COVER_TEXTURE_PATHS, configureCoverTextures);

  return (
    <>
      {/* Sample pages; outermost indices act as rigid, thicker hardback covers */}
      {Array.from({ length: TOTAL_PAGES }).map((_, i) => {
        const isFirstCover = i === 0;
        const isLastCover = i === TOTAL_PAGES - 1;
        const isCover = isFirstCover || isLastCover;

        // (first cover faces +Z internally so moves -Z; last cover is rotated ~-PI so moves +Z locally)
        const zOffset = isFirstCover
          ? -COVER_DEPTH / 2
          : isLastCover
            ? COVER_DEPTH / 2
            : 0;

        const bendFactor = 0.2;
        const bend = i > TOTAL_PAGES / 2 ? -bendFactor : bendFactor;

        const coverRotation = -(i * Math.PI) / TOTAL_PAGES;
        const rightSideRotation = -((i * Math.PI) / 2) / TOTAL_PAGES;
        const leftSideRotation =
          -((i * Math.PI) / 2) / (TOTAL_PAGES + 1) - Math.PI / 2;
        const pageRotation =
          i <= TOTAL_PAGES / 2 ? rightSideRotation : leftSideRotation;

        return (
          <Page
            key={i}
            rotationY={isCover ? coverRotation : pageRotation}
            depth={isCover ? COVER_DEPTH : PAGE_DEPTH}
            bend={isCover ? 0 : bend}
            zOffset={zOffset}
            textures={isCover ? coverTextures : paperTextures}
            color={isCover ? COVER_COLOR : "#ffffff"}
          />
        );
      })}
    </>
  );
};

const App = () => {
  return (
    <main className="w-screen h-screen">
      <Canvas camera={{ position: [0, 1, 3] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} />
        <OrbitControls />

        <Suspense fallback={null}>
          <Book />
        </Suspense>
      </Canvas>
    </main>
  );
};

export default App;
