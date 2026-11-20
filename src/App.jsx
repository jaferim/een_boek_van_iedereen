import {
  Environment,
  Html,
  OrbitControls,
  useTexture,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import GUI from "lil-gui";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { BookSpreadHtml } from "./BookSpreadHtml";

const TOTAL_PAGES = 48;
const COVER_DEPTH = 0.04;
const PAGE_DEPTH = 0.002;
const PAGE_WIDTH = 1;
const PAGE_HEIGHT = 1.42;
const SPINE_WIDTH = 0.1;
const HINGE_RADIUS = 0.012;
const COVER_BEVEL = 0.006;
const COVER_OVERHANG = 0.02;
const COVER_TOTAL_WIDTH = PAGE_WIDTH * 2 + SPINE_WIDTH + COVER_OVERHANG * 2;

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

  // LinearFilter keeps mipmaps disabled (~33% VRAM savings) while smoothing normal/roughness transitions
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

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
 * A page component using a 3-bone SkinnedMesh so it can curve smoothly
 * from the spine to the outer edge.
 */
const Page = ({
  position = [0, 0, 0],
  rotationY = 0,
  bend1 = 0,
  bend2 = 0,
  depth = PAGE_DEPTH,
  zOffset = 0,
  textures,
  color = "#ffffff",
  faceSide = null,
  children = null,
}) => {
  const meshRef = useRef(null);

  const mesh = useMemo(() => {
    // 1. GEOMETRY: Subdivide along width so the page arches smoothly from spine to edge
    const widthSegments = 20;
    const geo = new THREE.BoxGeometry(
      PAGE_WIDTH,
      PAGE_HEIGHT,
      depth,
      widthSegments,
      1,
      1,
    );

    // Move pivot so x = 0 is the spine edge
    geo.translate(PAGE_WIDTH / 2, 0, zOffset);

    // 2. BONES: 3-bone chain (spine root -> inner arch -> outer flattening)
    const bone1Pos = 0.25 * PAGE_WIDTH;
    const bone2Pos = 0.65 * PAGE_WIDTH;
    const bone0 = new THREE.Bone();
    const bone1 = new THREE.Bone();
    const bone2 = new THREE.Bone();
    bone0.position.set(0, 0, 0);
    bone1.position.set(bone1Pos, 0, 0);
    bone2.position.set(bone2Pos - bone1Pos, 0, 0);
    bone0.add(bone1);
    bone1.add(bone2);

    // 3. SKELETON: Groups the bones together
    const skeleton = new THREE.Skeleton([bone0, bone1, bone2]);

    // 4. SKIN WEIGHTS: Blend smoothly from bone0 -> bone1 -> bone2 across width
    const pos = geo.attributes.position;
    const skinIndices = [];
    const skinWeights = [];

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);

      if (x <= bone1Pos) {
        const t = Math.max(0, x / bone1Pos);
        skinIndices.push(0, 1, 0, 0);
        skinWeights.push(1 - t, t, 0, 0);
      } else if (x <= bone2Pos) {
        const t = (x - bone1Pos) / (bone2Pos - bone1Pos);
        skinIndices.push(1, 2, 0, 0);
        skinWeights.push(1 - t, t, 0, 0);
      } else {
        skinIndices.push(2, 0, 0, 0);
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

    // 5. SKINNED MESH: Create the mesh and bind the skeleton immediately
    const mat = new THREE.MeshStandardMaterial({
      ...textures,
      color,
      roughness: 0.9,
      normalScale: new THREE.Vector2(1.4, 1.4),
      wireframe: false,
    });
    const skinnedMesh = new THREE.SkinnedMesh(geo, mat);
    skinnedMesh.castShadow = true;
    skinnedMesh.receiveShadow = true;

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

  // 6. BENDING: Update both bend bones inside an effect
  useEffect(() => {
    const bones = meshRef.current?.skeleton?.bones;
    if (bones) {
      bones[1].rotation.y = bend1;
      bones[2].rotation.y = bend2;
    }
  }, [bend1, bend2]);

  return (
    <group position={position} rotation-y={rotationY}>
      <primitive ref={meshRef} object={mesh} />

      {faceSide && children && (
        <Html
          transform
          occlude
          distanceFactor={0.5}
          pointerEvents="none"
          position={[
            PAGE_WIDTH / 2,
            0,
            faceSide === "front" ? depth / 2 + 0.003 : -(depth / 2 + 0.003),
          ]}
          rotation-y={faceSide === "back" ? Math.PI : 0}
        >
          {children}
        </Html>
      )}
    </group>
  );
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
    const coverHeight = PAGE_HEIGHT + 0.05;
    const geo = new THREE.BoxGeometry(
      COVER_TOTAL_WIDTH,
      coverHeight,
      COVER_DEPTH,
      widthSegments,
      3,
      1,
    );

    // Bevel the front/back perimeter edges while keeping side edges watertight
    const bevel = Math.min(COVER_BEVEL, COVER_DEPTH / 2 - 0.002);
    const halfW = COVER_TOTAL_WIDTH / 2;
    const halfH = coverHeight / 2;
    const halfD = COVER_DEPTH / 2;
    const geoPos = geo.attributes.position;
    const geoNorm = geo.attributes.normal;

    for (let i = 0; i < geoPos.count; i++) {
      const x = geoPos.getX(i);
      let y = geoPos.getY(i);
      let z = geoPos.getZ(i);
      const nz = geoNorm.getZ(i);

      // Pull the two inner Y rings near top/bottom so only a thin rim bevels
      if (Math.abs(Math.abs(y) - halfH / 3) < 0.001) {
        y = Math.sign(y) * (halfH - bevel);
      }

      if (Math.abs(nz) > 0.5) {
        const onOuterX = Math.abs(Math.abs(x) - halfW) < 0.0001;
        const onOuterY = Math.abs(Math.abs(y) - halfH) < 0.0001;
        if (onOuterX || onOuterY) {
          z = Math.sign(z) * (halfD - bevel);
        }
      } else {
        z = Math.sign(z) * (halfD - bevel);
      }

      geoPos.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();

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
      color: COVER_COLOR,
      roughness: 0.75,
      normalScale: new THREE.Vector2(1.4, 1.4),
      wireframe: false,
    });
    const skinnedMesh = new THREE.SkinnedMesh(geo, mat);
    skinnedMesh.castShadow = true;
    skinnedMesh.receiveShadow = true;
    skinnedMesh.add(boneCenter);
    skinnedMesh.bind(skeleton);

    return skinnedMesh;
  }, [textures]);

  useEffect(() => {
    return () => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    };
  }, [mesh]);

  useEffect(() => {
    const currentMesh = meshRef.current;
    if (!currentMesh) return;

    currentMesh.material.color.set(color);

    const bones = currentMesh.skeleton?.bones;
    if (bones) {
      bones[1].rotation.y = -rightAngle;
      bones[2].rotation.y = leftAngle;
    }
  }, [color, rightAngle, leftAngle]);

  return <primitive ref={meshRef} object={mesh} />;
};

const INNER_PAGE_COUNT = TOTAL_PAGES - 2;

const Book = ({
  openness = 1,
  pageBend = 0.25,
  coverColor = COVER_COLOR,
  chapterTitle = "Hoofdstuk I",
  replayKey = 0,
}) => {
  // Load and configure paper & leather textures once for the whole book instead of per page
  const paperTextures = useTexture(PAPER_TEXTURE_PATHS, configurePaperTextures);
  const coverTextures = useTexture(COVER_TEXTURE_PATHS, configureCoverTextures);

  // Cover folds from 0 (flat open) to Math.PI / 2 (closed)
  const coverFold = (1 - openness) * (Math.PI / 2);

  // Inward fan curve peaks around mid-open (~0.45) and fades out when fully closed or fully open
  const inwardWeight = Math.sin(openness * Math.PI) * (1 - openness * openness);
  // Reading arch ramps up past ~0.35 so pages settle back down onto the cover when fully open
  const readingWeight = THREE.MathUtils.smoothstep(openness, 0.35, 1.0);
  // Fade HTML spread in only as the two reading pages settle flat
  const htmlOpacity = THREE.MathUtils.smoothstep(openness, 0.85, 1.0);

  return (
    <>
      <BookCover
        rightAngle={coverFold}
        leftAngle={coverFold}
        textures={coverTextures}
        color={coverColor}
      />

      {/* Inner pages (p = 0 .. INNER_PAGE_COUNT - 1, right-to-left across the spine) */}
      {Array.from({ length: INNER_PAGE_COUNT }).map((_, p) => {
        const halfCount = INNER_PAGE_COUNT / 2;
        const isRight = p < halfCount;
        const sideSign = isRight ? 1 : -1;

        // Only the two centermost pages face the reader when open down the middle
        const isRightSpread = p === halfCount - 1;
        const isLeftSpread = p === halfCount;
        const isSpreadPage = isRightSpread || isLeftSpread;
        const faceSide = isRightSpread ? "front" : isLeftSpread ? "back" : null;

        // t = 0 at outermost cover-resting page, t = 1 at innermost center page
        const t = isRight
          ? p / (halfCount - 1)
          : (INNER_PAGE_COUNT - 1 - p) / (halfCount - 1);

        // When closed, pages stack horizontally across SPINE_WIDTH; when open, the bound stack
        // rotates into a vertical Z stack near the center crease so outer page edges stay nearly flush
        const stackX = ((INNER_PAGE_COUNT - 1) / 2 - p) * PAGE_DEPTH;
        const openX = sideSign * (PAGE_DEPTH / 2 + 0.001);
        const xPos = THREE.MathUtils.lerp(stackX, openX, openness);

        const openZ =
          PAGE_DEPTH / 2 + 0.002 + t * ((halfCount - 1) * PAGE_DEPTH * 0.9);
        const zPos = openness * openZ;

        // Transition root angle from mid-open fan to flat-open reading spread.
        // The two center reading pages settle to a flat 0.06 rad plane so <Html transform> sits flush.
        const fanRise = 0.02 + Math.pow(t, 1.2) * 0.85;
        const readRise = isSpreadPage ? 0.06 : 0.015 + t * 0.09;
        const openRise = THREE.MathUtils.lerp(fanRise, readRise, readingWeight);
        const openRot = isRight ? -openRise : -Math.PI + openRise;

        // Closed rotation (-Math.PI / 2) points straight forward (+Z) inside the cover
        const pageRotation = THREE.MathUtils.lerp(
          -Math.PI / 2,
          openRot,
          openness,
        );

        // Curve inward while partially open; flatten the two center pages when open for <Html transform>
        const inwardBend = -sideSign * t * (pageBend * 1.4) * inwardWeight;
        const archFactor = isSpreadPage ? 0 : readingWeight;
        const readBend1 = sideSign * (0.01 + t * 0.075) * archFactor;
        const readBend2 = sideSign * (0.004 + t * 0.025) * archFactor;

        const bend1 = (inwardBend * 0.65 + readBend1) * openness;
        const bend2 = (inwardBend * 0.35 + readBend2) * openness;

        return (
          <Page
            key={p}
            position={[xPos, 0, zPos]}
            rotationY={pageRotation}
            depth={PAGE_DEPTH}
            bend1={bend1}
            bend2={bend2}
            zOffset={0}
            textures={paperTextures}
            color="#ffffff"
            faceSide={faceSide}
          >
            {isSpreadPage && (
              <BookSpreadHtml
                side={isLeftSpread ? "left" : "right"}
                chapterTitle={chapterTitle}
                opacity={htmlOpacity}
                replayKey={replayKey}
              />
            )}
          </Page>
        );
      })}
    </>
  );
};

const App = () => {
  const [params, setParams] = useState({
    openness: 1,
    pageBend: 0.25,
    coverColor: COVER_COLOR,
    chapterTitle: "Hoofdstuk I",
    replayKey: 0,
    envIntensity: 0.35,
    showHdriBg: false,
    ambientIntensity: 0.05,
    keyIntensity: 2.4,
    fillIntensity: 3.5,
    rimIntensity: 10,
  });

  useEffect(() => {
    const gui = new GUI({ title: "Book Controls" });
    const state = {
      openness: 1,
      pageBend: 0.25,
      coverColor: COVER_COLOR,
      chapterTitle: "Hoofdstuk I",
      replayAnim: () =>
        setParams((prev) => ({ ...prev, replayKey: prev.replayKey + 1 })),
      envIntensity: 0.35,
      showHdriBg: false,
      ambientIntensity: 0.05,
      keyIntensity: 2.4,
      fillIntensity: 3.5,
      rimIntensity: 10,
    };

    const update = () => setParams((prev) => ({ ...prev, ...state }));

    const bookFolder = gui.addFolder("Book");
    bookFolder.add(state, "openness", 0, 1, 0.01).name("Open").onChange(update);
    bookFolder
      .add(state, "pageBend", 0, 0.5, 0.01)
      .name("Page Bend")
      .onChange(update);
    bookFolder
      .addColor(state, "coverColor")
      .name("Cover Color")
      .onChange(update);
    bookFolder.add(state, "chapterTitle").name("Page Title").onChange(update);
    bookFolder.add(state, "replayAnim").name("Replay Anim");

    const lightFolder = gui.addFolder("Lighting");
    lightFolder
      .add(state, "envIntensity", 0, 2, 0.05)
      .name("HDRI Base")
      .onChange(update);
    lightFolder.add(state, "showHdriBg").name("Show HDRI BG").onChange(update);
    lightFolder
      .add(state, "ambientIntensity", 0, 1, 0.02)
      .name("Ambient")
      .onChange(update);
    lightFolder
      .add(state, "keyIntensity", 0, 6, 0.1)
      .name("Key Light")
      .onChange(update);
    lightFolder
      .add(state, "fillIntensity", 0, 10, 0.2)
      .name("Fill Light")
      .onChange(update);
    lightFolder
      .add(state, "rimIntensity", 0, 25, 0.5)
      .name("Rim Light")
      .onChange(update);

    return () => gui.destroy();
  }, []);

  return (
    <main className="w-screen h-screen">
      <Canvas shadows="soft" camera={{ position: [0, 1, 3] }}>
        {/* Keep ambient minimal so HDRI + studio lights preserve deep crease shadows */}
        <ambientLight intensity={params.ambientIntensity} />

        {/* Raking warm studio key light casting crisp shadows across page stacks & center crease */}
        <directionalLight
          position={[-2.6, 2.2, 1.8]}
          intensity={params.keyIntensity}
          color="#fff0db"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-1.5}
          shadow-camera-right={1.5}
          shadow-camera-top={1.2}
          shadow-camera-bottom={-1.2}
          shadow-camera-near={0.5}
          shadow-camera-far={10}
          shadow-bias={-0.0003}
          shadow-normalBias={0.008}
        />

        {/* Soft cool studio fill on the opposite side to retain shadow detail without flattening */}
        <pointLight
          position={[2.6, 0.9, 2.0]}
          intensity={params.fillIntensity}
          color="#b8d0ff"
        />

        {/* Back-top studio rim light to pick up the beveled cover rim and outer page edges */}
        <spotLight
          position={[0.5, 2.6, -2.4]}
          angle={0.65}
          penumbra={0.85}
          intensity={params.rimIntensity}
          color="#fff7ec"
        />

        <OrbitControls />

        <Suspense fallback={null}>
          <Environment
            files="/hdri/dancing_hall_1k.hdr"
            background={params.showHdriBg}
            backgroundBlurriness={0.35}
            environmentIntensity={params.envIntensity}
          />
          <Book
            openness={params.openness}
            pageBend={params.pageBend}
            coverColor={params.coverColor}
            chapterTitle={params.chapterTitle}
            replayKey={params.replayKey}
          />
        </Suspense>
      </Canvas>
    </main>
  );
};

export default App;
