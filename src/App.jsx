import { OrbitControls, useTexture } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const TOTAL_PAGES = 48;
const COVER_DEPTH = 0.04;
const PAGE_DEPTH = 0.005;
const PAGE_WIDTH = 1;
const PAGE_HEIGHT = 1.42;
const SPINE_WIDTH = 0.24;
const HINGE_RADIUS = 0.015;
const COVER_TOTAL_WIDTH = PAGE_WIDTH * 2 + SPINE_WIDTH / 2;

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

const configureTexture = (texture, isColorMap, repeatX = PAGE_WIDTH) => {
  if (isColorMap) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }

  // NearestFilter on minFilter skips mipmap sampling, so disabling mipmaps saves ~33% VRAM
  texture.generateMipmaps = false;
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;

  // Match the mesh aspect ratio so the square 1:1 texture doesn't stretch
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, PAGE_HEIGHT);

  texture.needsUpdate = true;
};

const configurePaperTextures = (textures) => {
  textures.forEach((texture, index) => configureTexture(texture, index === 0));
};

const configureCoverTextures = (textures) => {
  textures.forEach((texture) =>
    configureTexture(texture, false, COVER_TOTAL_WIDTH),
  );
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

/**
 * Single continuous hardback cover (back cover + spine + front cover) using a 3-bone SkinnedMesh.
 * A tight HINGE_RADIUS keeps the spine flat and boxy while creasing cleanly at both corners.
 * - rightAngle / leftAngle: 0 = flat open, Math.PI / 2 = folded 90 deg closed
 */
const BookCover = ({
  rightAngle = 0,
  leftAngle = 0,
  textures,
  color = COVER_COLOR,
}) => {
  const meshRef = useRef(null);

  const mesh = useMemo(() => {
    const halfSpine = SPINE_WIDTH / 2;
    const widthSegments = 160;
    const geo = new THREE.BoxGeometry(
      COVER_TOTAL_WIDTH,
      PAGE_HEIGHT + 0.05,
      COVER_DEPTH,
      widthSegments,
      1,
      1,
    );

    // Shift backward by half thickness so the inner cover face stays flush at z = 0 behind pages
    geo.translate(0, 0, -COVER_DEPTH / 2);

    // 3-bone symmetric rig: stationary spine center, plus one hinge bone per cover edge
    const boneCenter = new THREE.Bone();
    const boneRight = new THREE.Bone();
    const boneLeft = new THREE.Bone();

    boneRight.position.set(halfSpine, 0, 0);
    boneLeft.position.set(-halfSpine, 0, 0);
    boneCenter.add(boneRight);
    boneCenter.add(boneLeft);

    const skeleton = new THREE.Skeleton([boneCenter, boneRight, boneLeft]);

    const pos = geo.attributes.position;
    const skinIndices = [];
    const skinWeights = [];
    const hingeStart = halfSpine - HINGE_RADIUS;
    const hingeEnd = halfSpine + HINGE_RADIUS;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const absX = Math.abs(x);
      const sideBone = x >= 0 ? 1 : 2;

      if (absX <= hingeStart) {
        // Flat spine stays anchored to boneCenter (0)
        skinIndices.push(0, 0, 0, 0);
        skinWeights.push(1, 0, 0, 0);
      } else if (absX < hingeEnd) {
        // Tight crease transition across the hinge corner
        const t = (absX - hingeStart) / (2 * HINGE_RADIUS);
        skinIndices.push(0, sideBone, 0, 0);
        skinWeights.push(1 - t, t, 0, 0);
      } else {
        // Rigid cover board follows its side bone completely
        skinIndices.push(sideBone, 0, 0, 0);
        skinWeights.push(1, 0, 0, 0);
      }
    }

    geo.setAttribute(
      "skinIndex",
      new THREE.Uint16BufferAttribute(skinIndices, 4),
    );
    geo.setAttribute(
      "skinWeight",
      new THREE.Float32BufferAttribute(skinWeights, 4),
    );

    const mat = new THREE.MeshStandardMaterial({
      ...textures,
      color,
      wireframe: false,
    });
    const skinnedMesh = new THREE.SkinnedMesh(geo, mat);
    skinnedMesh.add(boneCenter);
    skinnedMesh.bind(skeleton);

    return skinnedMesh;
  }, [textures, color]);

  useEffect(() => {
    return () => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    };
  }, [mesh]);

  useEffect(() => {
    const bones = meshRef.current?.skeleton?.bones;
    if (!bones) return;

    bones[1].rotation.y = -rightAngle;
    bones[2].rotation.y = leftAngle;
  }, [rightAngle, leftAngle]);

  return <primitive ref={meshRef} object={mesh} />;
};

const Book = () => {
  // Load and configure paper & leather textures once for the whole book instead of per page
  const paperTextures = useTexture(PAPER_TEXTURE_PATHS, configurePaperTextures);
  const coverTextures = useTexture(COVER_TEXTURE_PATHS, configureCoverTextures);

  return (
    <>
      {/* Continuous hardback cover with curved spine hinges (0 = flat open, Math.PI / 2 = closed) */}
      <BookCover
        rightAngle={0}
        leftAngle={Math.PI / TOTAL_PAGES}
        textures={coverTextures}
        color={COVER_COLOR}
      />
      {/*         
      rightAngle={1.5}
      leftAngle={1.5} */}

      {/* Inner pages (indices 1 .. TOTAL_PAGES - 2) */}
      {Array.from({ length: TOTAL_PAGES }).map((_, i) => {
        const isFirstCover = i === 0;
        const isLastCover = i === TOTAL_PAGES - 1;
        if (isFirstCover || isLastCover) return null;

        const bendFactor = 0.2;
        const bend = i > TOTAL_PAGES / 2 ? -bendFactor : bendFactor;

        const rightSideRotation = -((i * Math.PI) / 2) / TOTAL_PAGES;
        const leftSideRotation =
          -((i * Math.PI) / 2) / (TOTAL_PAGES + 1) - Math.PI / 2;
        const pageRotation =
          i <= TOTAL_PAGES / 2 ? rightSideRotation : leftSideRotation;

        return (
          <Page
            key={i}
            rotationY={pageRotation}
            depth={PAGE_DEPTH}
            bend={bend}
            zOffset={0}
            textures={paperTextures}
            color="#ffffff"
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
