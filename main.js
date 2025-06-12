import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

let scene,camera,renderer,controls,skybox;
let planet_sun, planet_mercury, planet_venus, planet_earth, planet_mars, planet_jupiter, planet_saturn, planet_uranus, planet_neptune;
let planet_moon;
let moonLabel;


let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();



let mercury_orbit_radius = 50
let venus_orbit_radius = 60
let earth_orbit_radius = 70
let mars_orbit_radius = 80
let jupiter_orbit_radius = 100
let saturn_orbit_radius = 120
let uranus_orbit_radius = 140
let neptune_orbit_radius = 160

let mercury_revolution_speed = 2
let venus_revolution_speed = 1.5
let earth_revolution_speed = 1
let mars_revolution_speed = 0.8
let jupiter_revolution_speed = 0.7
let saturn_revolution_speed = 0.6
let uranus_revolution_speed = 0.5
let neptune_revolution_speed = 0.4



function createMaterialArray() {
    const skyboxImagepaths = ['planet/skybox/space_ft.png', 'planet/skybox/space_bk.png', 'planet/skybox/space_up.png',
         'planet/skybox/space_dn.png', 'planet/skybox/space_rt.png', 'planet/skybox/space_lf.png']
    const materialArray = skyboxImagepaths.map((image) => {
      let texture = new THREE.TextureLoader().load(image);
      return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
    });
    return materialArray;
  }
  
  function setSkyBox() {
    const materialArray = createMaterialArray();
    let skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
    skybox = new THREE.Mesh(skyboxGeo, materialArray);
    scene.add(skybox);
  }
  
  function loadPlanetTexture(texture, radius, widthSegments, heightSegments, meshType) {
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const loader = new THREE.TextureLoader();
    const planetTexture = loader.load(texture);
    const material = meshType == 'standard' ? new THREE.MeshStandardMaterial({ map: planetTexture }) : new THREE.MeshBasicMaterial({ map: planetTexture });
  
    const planet = new THREE.Mesh(geometry, material);
  
    return planet
  }
  
  
  
  
  
  function createRing(innerRadius) {
    let outerRadius = innerRadius - 0.1
    let thetaSegments = 100
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);
    const material = new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh)
    mesh.rotation.x = Math.PI / 2
    return mesh;
  
  }
function createLabel(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.font = 'bold 64px Arial'; // Bigger and bold font
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter; // Better quality

  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(20, 5, 1); // Wider and taller label

  return sprite;
}

function createSaturnRing(innerRadius, outerRadius, texturePath) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
  const texture = new THREE.TextureLoader().load(texturePath);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true
  });
  const ring = new THREE.Mesh(geometry, material);
  ring.rotation.x = Math.PI / 2;
  return ring;
}



function showPlanetInfo(name) {
  const infoBox = document.getElementById('planet-info');
  const title = document.getElementById('info-title');
  const desc = document.getElementById('info-description');

  title.innerText = name.charAt(0).toUpperCase() + name.slice(1);
  desc.innerText = planetInfo[name] || "No data available.";

  infoBox.style.display = 'block';
}

function closeInfo() {
  document.getElementById('planet-info').style.display = 'none';
}


  const planetInfo = {
  mercury: "Mercury is the smallest planet in the Solar System and closest to the Sun. It has a very thin atmosphere.",
  venus: "Venus is the hottest planet due to its thick greenhouse gas atmosphere.",
  earth: "Earth is the only planet known to support life, with abundant water and atmosphere.",
  mars: "Mars is known as the Red Planet due to iron oxide on its surface.",
  jupiter: "Jupiter is the largest planet and is known for its Great Red Spot.",
  saturn: "Saturn is famous for its beautiful ring system.",
  uranus: "Uranus rotates on its side and has a pale blue color due to methane.",
  neptune: "Neptune is the farthest planet and has strong winds and storms."
};
  
  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      85,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );




document.addEventListener('mousemove', onMouseMove, false);

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([
    planet_mercury, planet_venus, planet_earth, planet_mars,
    planet_jupiter, planet_saturn, planet_uranus, planet_neptune
  ]);

  const tooltip = document.getElementById('tooltip');

  if (intersects.length > 0) {
    const planet = intersects[0].object;
    tooltip.style.display = 'block';
    tooltip.innerHTML = planetInfo[planet.name];
    tooltip.style.left = event.clientX + 10 + 'px';
    tooltip.style.top = event.clientY + 10 + 'px';
  } else {
    tooltip.style.display = 'none';
  }
}


document.addEventListener('click', onPlanetClick, false);

function onPlanetClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects([
    planet_mercury, planet_venus, planet_earth, planet_mars,
    planet_jupiter, planet_saturn, planet_uranus, planet_neptune
  ]);

  if (intersects.length > 0) {
    const planet = intersects[0].object;
    showPlanetInfo(planet.name);
  } else {
    closeInfo();
  }
}


  
    setSkyBox();
    planet_earth = loadPlanetTexture("planet/earth_hd.jpg", 4, 100, 100, 'standard');
       planet_moon = loadPlanetTexture("planet/2k_moon.jpg", 1, 64, 64, 'standard');
       scene.add(planet_moon);

        moonLabel = createLabel("Moon");
        scene.add(moonLabel);


    planet_sun = loadPlanetTexture("planet/sun_hd.jpg", 20, 100, 100, 'basic');
    planet_mercury = loadPlanetTexture("planet/mercury_hd.jpg", 2, 100, 100, 'standard');
    planet_venus = loadPlanetTexture("planet/venus_hd.jpg", 3, 100, 100, 'standard');
    planet_mars = loadPlanetTexture("planet/mars_hd.jpg", 3.5, 100, 100, 'standard');
    planet_jupiter = loadPlanetTexture("planet/jupiter_hd.jpg", 10, 100, 100, 'standard');
    planet_saturn = loadPlanetTexture("planet/saturn_hd.jpg", 8, 100, 100, 'standard');
          // Saturn Ring
          const saturnRing = createSaturnRing(9, 13, "planet/saturn_ring.jpg");
          planet_saturn.add(saturnRing); // Attach ring to Saturn
          saturnRing.position.set(0, 0, 0); // Center it on Saturn
    planet_uranus = loadPlanetTexture("planet/uranus_hd.jpg", 6, 100, 100, 'standard');
    planet_neptune = loadPlanetTexture("planet/neptune_hd.jpg", 5, 100, 100, 'standard');
  



    // ADD PLANETS TO THE SCENE
    scene.add(planet_earth);
    scene.add(planet_sun);
    scene.add(planet_mercury);
    scene.add(planet_venus);
    scene.add(planet_mars);
    scene.add(planet_jupiter);
    scene.add(planet_saturn);
    scene.add(planet_uranus);
    scene.add(planet_neptune);

    planet_mercury.name = "mercury";
    planet_venus.name = "venus";
    planet_earth.name = "earth";
    planet_mars.name = "mars";
    planet_jupiter.name = "jupiter";
    planet_saturn.name = "saturn";
    planet_uranus.name = "uranus";
    planet_neptune.name = "neptune";


    // Add labels for all planets
let label_sun = createLabel("Sun");
let label_mercury = createLabel("Mercury");
let label_venus = createLabel("Venus");
let label_earth = createLabel("Earth");
let label_mars = createLabel("Mars");
let label_jupiter = createLabel("Jupiter");
let label_saturn = createLabel("Saturn");
let label_uranus = createLabel("Uranus");
let label_neptune = createLabel("Neptune");

// Attach labels to planets
planet_sun.add(label_sun);
planet_mercury.add(label_mercury);
planet_venus.add(label_venus);
planet_earth.add(label_earth);
planet_mars.add(label_mars);
planet_jupiter.add(label_jupiter);
planet_saturn.add(label_saturn);
planet_uranus.add(label_uranus);
planet_neptune.add(label_neptune);

// Position the labels slightly above each planet
label_sun.position.set(0, 25, 0);
label_mercury.position.set(0, 3, 0);
label_venus.position.set(0, 4, 0);
label_earth.position.set(0, 5, 0);
label_mars.position.set(0, 5, 0);
label_jupiter.position.set(0, 11, 0);
label_saturn.position.set(0, 9, 0);
label_uranus.position.set(0, 7, 0);
label_neptune.position.set(0, 6, 0);
  
   const sunLight = new THREE.PointLight(0xffffff, 3, 500); // Stronger intensity, distance-based attenuation
sunLight.position.copy(planet_sun.position);
sunLight.castShadow = true; // Optional: cast shadows
scene.add(sunLight);

  
    // Rotation orbit
    createRing(mercury_orbit_radius)
    createRing(venus_orbit_radius)
    createRing(earth_orbit_radius)
    createRing(mars_orbit_radius)
    createRing(jupiter_orbit_radius)
    createRing(saturn_orbit_radius)
    createRing(uranus_orbit_radius)
    createRing(neptune_orbit_radius)
  
  
  
  
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(renderer.domElement);
    renderer.domElement.id = "c";
    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 12;
    controls.maxDistance = 1000;
  
    camera.position.z = 100;
  }
  
  
  function planetRevolver(time, speed, planet, orbitRadius, planetName) {
  
    let orbitSpeedMultiplier = 0.0002;
    const planetAngle = time * orbitSpeedMultiplier * speed;
    planet.position.x = planet_sun.position.x + orbitRadius * Math.cos(planetAngle);
    planet.position.z = planet_sun.position.z + orbitRadius * Math.sin(planetAngle);
  }
  
  
  
  function animate(time) {
    requestAnimationFrame(animate);
  
    // Rotate the planets
    const rotationSpeed = 0.02;
    planet_earth.rotation.y += rotationSpeed;
            const moonOrbitRadius = 3; // Distance from Earth
            const moonSpeed = 5;       // Revolution speed

            const moonAngle = time * 0.0002 * moonSpeed;
            planet_moon.position.x = planet_earth.position.x + moonOrbitRadius * Math.cos(moonAngle);   
            planet_moon.position.z = planet_earth.position.z + moonOrbitRadius * Math.sin(moonAngle);
            planet_moon.position.y = planet_earth.position.y; // Keep same y as Earth

          // Update Moon Label
          moonLabel.position.set(
              planet_moon.position.x,
              planet_moon.position.y + 1.2,
              planet_moon.position.z
          );
    planet_sun.rotation.y += rotationSpeed * 0.1;
    planet_mercury.rotation.y += rotationSpeed;
    planet_venus.rotation.y += rotationSpeed;
    planet_mars.rotation.y += rotationSpeed;
    planet_jupiter.rotation.y += rotationSpeed;
    planet_saturn.rotation.y += rotationSpeed;
    planet_uranus.rotation.y += rotationSpeed;
    planet_neptune.rotation.y += rotationSpeed;
  
    // Revolve planets around the sun
    // const orbitSpeedMultiplier = 0.001;
    // Earth
    // const earthOrbitAngle = time * orbitSpeedMultiplier;
    // planet_earth.position.x = planet_sun.position.x + earth_orbit_radius * Math.cos(earthOrbitAngle);
    // planet_earth.position.z = planet_sun.position.z + earth_orbit_radius * Math.sin(earthOrbitAngle);
    planetRevolver(time, mercury_revolution_speed, planet_mercury, mercury_orbit_radius, 'mercury')
    planetRevolver(time, venus_revolution_speed, planet_venus, venus_orbit_radius, 'venus')
    planetRevolver(time, earth_revolution_speed, planet_earth, earth_orbit_radius, 'earth')
    planetRevolver(time, mars_revolution_speed, planet_mars, mars_orbit_radius, 'mars')
    planetRevolver(time, jupiter_revolution_speed, planet_jupiter, jupiter_orbit_radius, 'jupiter')
    planetRevolver(time, saturn_revolution_speed, planet_saturn, saturn_orbit_radius, 'saturn')
    planetRevolver(time, uranus_revolution_speed, planet_uranus, uranus_orbit_radius, 'uranus')
    planetRevolver(time, neptune_revolution_speed, planet_neptune, neptune_orbit_radius, 'neptune')
  
  
  
  
    controls.update();
    renderer.render(scene, camera);
  }
  
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  window.addEventListener("resize", onWindowResize, false);
  
  init();
  animate(0); // Initialize with time 0