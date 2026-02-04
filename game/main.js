const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// Camera
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(0, 5, 10);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ground (Open World)
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: 0x228B22 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

// Car
const car = new THREE.Mesh(
  new THREE.BoxGeometry(2, 1, 4),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
car.position.y = 0.5;
scene.add(car);

// Controls
let speed = 0;
document.addEventListener("keydown", e => {
  if (e.key === "w") speed = 0.2;
  if (e.key === "s") speed = -0.2;
  if (e.key === "a") car.rotation.y += 0.05;
  if (e.key === "d") car.rotation.y -= 0.05;
});
document.addEventListener("keyup", () => speed = 0);

// Game Loop
function animate() {
  requestAnimationFrame(animate);
  car.translateZ(speed);
  camera.position.lerp(
    new THREE.Vector3(car.position.x, 5, car.position.z + 10),
    0.1
  );
  camera.lookAt(car.position);
  renderer.render(scene, camera);
}
animate();
