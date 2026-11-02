import {
  AmbientLight, Color, DirectionalLight, Group, LoadingManager, Mesh,
  MeshPhongMaterial, OrthographicCamera, Scene, ShaderMaterial, SphereGeometry,
  SRGBColorSpace, TextureLoader, Vector2, WebGLRenderer,
} from "three";
import type { GlobePose } from "./globe-animation";

export function createSoftGlobe(canvas: HTMLCanvasElement, width: number, pose: GlobePose) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0xffffff, 0);
  const scene = new Scene();
  const camera = new OrthographicCamera(-1.25, 1.25, 1.25, -1.25, 0.1, 20);
  camera.position.z = 4;
  const world = new Group();
  scene.add(world, new AmbientLight(0xffffff, 1.8));
  const sunlight = new DirectionalLight(0xffffff, 2);
  sunlight.position.set(-3, 5, 4);
  const fill = new DirectionalLight(0xe6fff4, 0.35);
  fill.position.set(3, -1, 2);
  scene.add(sunlight, fill);

  let disposed = false;
  const manager = new LoadingManager();
  const ready = new Promise<void>((resolve, reject) => {
    manager.onLoad = () => {
      if (!disposed) renderer.compileAsync(scene, camera).then(() => { if (!disposed) resolve(); }, reject);
    };
    manager.onError = () => reject(new Error("Globe texture unavailable"));
  });
  const loader = new TextureLoader(manager);
  const surface = loader.load("/textures/earth/surface.jpg");
  surface.colorSpace = SRGBColorSpace;
  const water = loader.load("/textures/earth/water.png");
  const normal = loader.load("/textures/earth/normal.png");
  const cloudMap = loader.load("/textures/earth/clouds.jpg");
  const textures = [surface, water, normal, cloudMap];
  for (const texture of textures) texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());

  const geometry = new SphereGeometry(1, 96, 64);
  const material = new MeshPhongMaterial({
    map: surface, normalMap: normal, normalScale: new Vector2(0.55, 0.55),
    specularMap: water, specular: new Color(0xc1e4d4), shininess: 18,
  });
  // Recolour real coastlines; retain terrain variation and normal-map lighting.
  material.onBeforeCompile = (shader) => {
    shader.uniforms.waterMask = { value: water };
    shader.uniforms.oceanTint = { value: new Color(0xf1faf7) };
    shader.uniforms.landTint = { value: new Color(0x63b68f) };
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform sampler2D waterMask;\nuniform vec3 oceanTint;\nuniform vec3 landTint;")
      .replace("#include <map_fragment>", `#include <map_fragment>
        float land = 1.0 - texture2D(waterMask, vMapUv).r;
        float detail = dot(texture2D(map, vMapUv).rgb, vec3(0.299, 0.587, 0.114));
        vec3 terrain = landTint * (0.78 + detail * 0.55);
        terrain = mix(terrain, vec3(0.91, 0.96, 0.92), smoothstep(0.74, 0.96, detail) * 0.65);
        diffuseColor.rgb = mix(oceanTint, terrain, smoothstep(0.15, 0.85, land));
      `);
  };
  const earth = new Mesh(geometry, material);
  const cloudMaterial = new MeshPhongMaterial({
    color: 0xffffff, alphaMap: cloudMap, transparent: true,
    opacity: 0.48, depthWrite: false, shininess: 0,
  });
  const clouds = new Mesh(geometry, cloudMaterial);
  clouds.scale.setScalar(1.012);
  const atmosphereMaterial = new ShaderMaterial({
    transparent: true, depthWrite: false,
    vertexShader: `varying vec3 viewNormal; varying vec3 viewPosition;
      void main() { viewNormal = normalize(normalMatrix * normal);
        vec4 p = modelViewMatrix * vec4(position, 1.0); viewPosition = p.xyz;
        gl_Position = projectionMatrix * p; }`,
    fragmentShader: `varying vec3 viewNormal; varying vec3 viewPosition;
      void main() { float rim = pow(1.0 - abs(dot(normalize(viewNormal), normalize(-viewPosition))), 3.0);
        gl_FragColor = vec4(0.54, 0.91, 0.77, rim * 0.3); }`,
  });
  const atmosphere = new Mesh(geometry, atmosphereMaterial);
  atmosphere.scale.setScalar(1.035);
  world.add(earth, clouds, atmosphere);

  const update = (next: GlobePose) => {
    world.rotation.set(next.theta, next.phi, 0, "XYZ");
    world.scale.setScalar(next.scale);
  };
  const resize = (size: number) => renderer.setSize(Math.max(1, size), Math.max(1, size), false);
  update(pose);
  resize(width);
  return {
    ready, update, resize,
    render(time: number) {
      clouds.rotation.y = Math.sin(time * 0.00005) * 0.025;
      renderer.render(scene, camera);
    },
    destroy() {
      if (disposed) return;
      disposed = true;
      geometry.dispose();
      material.dispose();
      cloudMaterial.dispose();
      atmosphereMaterial.dispose();
      textures.forEach((texture) => texture.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
export type SoftGlobe = ReturnType<typeof createSoftGlobe>;
