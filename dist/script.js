import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { AdditiveBlending } from 'three'




// Debug
const gui = new dat.GUI()

//LOADER
const loader = new THREE.TextureLoader()
const cross = loader.load('./cross.png')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.TorusGeometry( 1.0, .2, 16, 100 );

const particlesGeometry = new THREE.BufferGeometry;
const particlesCnt = 50000; //number of particles, particles will become more dense with higher values

const posArray = new Float32Array(particlesCnt*3); //each particle needs a xyz coordinate this stores it in an array

for(let i = 0; i < particlesCnt * 3; i++){
    //posArray[i] = Math.random() //will make each coordinate random
    //posArray[i] = (Math.random()-0.5) * 10//do this to get the particles in the center of screen. Multypling by a certain factor will cause the particles to disperse across screen
    posArray[i] = (Math.random()-0.5) * (Math.random()*5)
} 
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray,3)) //sets the position for all 5000 particles
// Materials

const material = new THREE.PointsMaterial({
    size: 0.005
})

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.010, //size of particles
    map: cross, //will use cross png image
    transparent: true,
    color: 'white',
    blending: THREE.AdditiveBlending //blends the particles
})



// Mesh
const sphere = new THREE.Points(geometry,material)

const particlesMesh = new THREE.Points(particlesGeometry,particlesMaterial)

scene.add(sphere, particlesMesh)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor( new THREE.Color('#21282a'),1) //this is how to set background color
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//EventListener

document.addEventListener('mousemove', animateParticles) //calls animateparticles when mouse moves

let mouseX = 0
let mouseY = 0

function animateParticles(event){
    mouseY=event.clientY //applies the position of the mouse to mouseY
    mouseX=event.clientX //applies client position of mouse to mouseX
}



/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime
    
    particlesMesh.rotation.y = -.1*elapsedTime //will always be rotating 

    //particle movement animation


    particlesMesh.rotation.x = -mouseY* (elapsedTime*.00008) //will cause particles to rotate using event listener for mouse movement
    particlesMesh.rotation.y = mouseX* (elapsedTime*.00008)
    
    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick) //calls very frame
}

tick()






//GOOGLE MAPS API
