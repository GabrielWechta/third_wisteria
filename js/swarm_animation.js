var light = new THREE.PointLight(0x111111, 2, 1000)
light.position.set(0, 10, 15);
scene.add(light);

class Particle {
    constructor(x_0) {
        this.position_i = [];
        this.velocity_i = [];
        this.pos_best_i = [];
        this.fit_best_i = -1;
        this.fit_i = -1;

        for (let i = 0; i < 2; i++) {
            let random_float = Math.random() * 2 - 1;
            this.velocity_i.push(random_float);
            this.position_i.push(x_0[i]);
        }
    }

    evaluate(costFunction) {
        this.fit_i = costFunction(this.position_i);

        if (this.fit_i < this.fit_best_i || this.fit_best_i === -1) {
            this.pos_best_i = this.position_i;
            this.fit_best_i = this.fit_i;
        }
    }

    update_velocity(pos_best_g) {
        let w = 0.5;
        let c1 = 1;
        let c2 = 2;

        for (let i = 0; i < 2; i++) {
            let r1 = Math.random();
            let r2 = Math.random();

            let vel_cognitive = c1 * r1 * (this.pos_best_i[i] - this.position_i[i]);
            let vel_social = c2 * r2 * (pos_best_g[i] - this.position_i[i]);
            this.velocity_i[i] = w * this.velocity_i[i] + vel_cognitive + vel_social;
        }
    }

    update_position(bounds) {
        for (let i = 0; i < 2; i++) {
            this.position_i[i] = this.position_i[i] + this.velocity_i[i];

            if (this.position_i[i] > bounds[i][1]) {
                this.position_i[i] = bounds[i][1];
            }

            if (this.position_i[i] < bounds[i][0]) {
                this.position_i[i] = bounds[i][0];
            }
        }
    }
}

class PSO {
    constructor(costFunction, x_0, bounds, num_particles) {
        this.costFunction = costFunction;
        this.x_0 = x_0;
        this.bounds = bounds;
        this.num_particles = num_particles;
        this.fit_best_g = -1;
        this.pos_best_g = [];
        this.particles = [];

        for (let i = 0; i < num_particles; i++) {

            this.particles.push(new Particle(x_0))
        }
    }

    one_run() {
        for (let j = 0; j < this.num_particles; j++) {
            this.particles[j].evaluate(this.costFunction);

            if (this.particles[j].fit_i < this.fit_best_g || this.fit_best_g === -1) {
                this.pos_best_g = this.particles[j].position_i;
                this.fit_best_g = this.particles[j].fit_i;
            }
        }
        for (let j = 0; j < this.num_particles; j++) {
            this.particles[j].update_velocity(this.pos_best_g);
            this.particles[j].update_position(this.bounds);
        }

        // for (let j = 0; j < this.num_particles; j++) {
        //     console.log(this.pos_best_g[j]);
        // }
    }
}

function ackley(x) {
    return -200 * Math.exp(-0.02 * Math.sqrt(x[0] ** 2 + x[1] ** 2));
}

function egg_crate(x) {
    return x[0] ** 2 + x[1] ** 2 + 25 * (Math.sin(x[0]) ** 2 + Math.sin(x[1]) ** 2);
}

var geometry = new THREE.SphereGeometry(0.4, 5, 5);
var material = new THREE.MeshLambertMaterial({color: 0xddaaff});

var checker = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({color: 0x112233}));
checker.position.x = 1;
checker.position.y = 1.5;
checker.position.z = -40;
scene.add(checker);

let swarm = [];

for (let i = 0; i < 100; i++) {
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 100;
    mesh.position.y = (Math.random() - 0.5) * 100;
    mesh.position.z = -50;
    swarm.push(mesh)
    scene.add(mesh);
}

createjs.Ticker.timingMode = createjs.Ticker.RAF;
createjs.Ticker.addEventListener("tick", animate);

let pso = new PSO(egg_crate, [-2, 3], [-5, 5], 100);
let ticker = 0;

function animate() {
    ticker += 1;
    renderer.render(scene, camera);
    pso.one_run();
    for (let i = 0; i < 100; i++) {
        createjs.Tween.get(swarm[i].position).to({
            x: pso.particles[i].position_i[0],
            z: pso.particles[i].position_i[1],
            y: egg_crate(pso.particles[i].position_i)
        }, 5000);
    }
    console.log(ticker)
}
