var light = new THREE.PointLight(0x11918d8d1111, 2, 1000)
light.position.set(50, 60, 15);
scene.add(light);

function egg_crate(x, z) {
    return x ** 2 + z ** 2 + 25 * (Math.sin(x) ** 2 + Math.sin(z) ** 2);
}

var geometry = new THREE.SphereGeometry(0.1, 10, 10);
var material = new THREE.MeshLambertMaterial({color: (0x2e2e2e)});

class Particle {
    constructor(x, y, z, color) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.color = color;
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.x = this.x;
        this.mesh.position.y = this.y;
        this.mesh.position.z = this.z;
        scene.add(this.mesh);
        this.red = 255.0;
        this.green = 5.0;
        this.blue = 5.0;
    }
}

class Carpet {
    constructor(bounds_for_x, bounds_for_z, particles_number, starting_color) {
        this.particles = [];

        let x_distance = (bounds_for_x[1] - bounds_for_x[0]) / particles_number;
        let z_distance = (bounds_for_z[1] - bounds_for_z[0]) / particles_number;
        let x_start = bounds_for_x[0];
        let z_start = bounds_for_z[0];

        for (let i = 0; i < particles_number; i++) {
            for (let j = 0; j < particles_number; j++) {
                this.particles.push(new Particle(x_start, 90, z_start, starting_color));

                z_start += z_distance;
            }
            x_start += x_distance;
            z_start = bounds_for_z[0];

        }
        this.central_particle = this.particles[particles_number ** 2 / 2];
    }
}

let carpet = new Carpet([-5, 5], [-5, 5], 50, 0x332211);

createjs.Ticker.timingMode = createjs.Ticker.RAF;
createjs.Ticker.addEventListener("tick", animate);

var camera_pivot = new THREE.Object3D()
var Y_AXIS = new THREE.Vector3(0, 1, 0);

scene.add(camera_pivot);
camera_pivot.add(camera);

function animate() {
    renderer.render(scene, camera);
    camera_pivot.rotateOnAxis(Y_AXIS, 0.005);
    camera.position.y -= 0.0;

    for (let particle of carpet.particles) {
        let move_down = 0;
        if (egg_crate(particle.mesh.position.x, particle.mesh.position.z) > particle.mesh.position.y) {
            move_down = 0;
        } else {
            move_down = 0.5;
            particle.red -= 0.005;
            particle.green += 0.005;
            particle.blue += 0.005;
        }

        createjs.Tween.get(particle.mesh.position).to({
            y: particle.mesh.position.y - move_down,
        }, 500)
        createjs.Tween.get(particle.mesh.material.color).to({
            r: parseInt(particle.red),
            g: parseInt(particle.green),
            b: parseInt(particle.blue)
        }, 500)
    }
}
