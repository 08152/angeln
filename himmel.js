
import * as THREE from "three";

export function createSky(scene) {

    // ==========================================
    // HIMMEL
    // ==========================================

    scene.background = new THREE.Color(0x78c5ed);

    const clouds = [];

    const cloudWhite = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 1,
        flatShading: true
    });

    const cloudShade = new THREE.MeshStandardMaterial({
        color: 0xe5edf2,
        roughness: 1,
        flatShading: true
    });

    // ==========================================
    // ZUFALL
    // ==========================================

    function random(min, max) {
        return min + Math.random() * (max - min);
    }

    // ==========================================
    // WOLKEN-GEOMETRIE
    // ==========================================

    const cloudGeometry = new THREE.IcosahedronGeometry(1, 1);

    // ==========================================
    // WOLKE ERSTELLEN
    // ==========================================

    function createCloud() {

        const cloud = new THREE.Group();

        function addPart(x, y, z, sx, sy, sz, material) {

            const part = new THREE.Mesh(
                cloudGeometry,
                material
            );

            part.position.set(x, y, z);
            part.scale.set(sx, sy, sz);

            part.rotation.set(
                random(-0.2, 0.2),
                random(0, Math.PI),
                random(-0.2, 0.2)
            );

            part.castShadow = false;
            part.receiveShadow = false;

            cloud.add(part);
        }

        // Hauptkörper
        addPart(0, 0, 0, 5.5, 1.5, 2.4, cloudShade);

        // Linker Wolkenberg
        addPart(-3.5, 0.8, 0, 2.8, 2.1, 2.2, cloudWhite);

        // Oberer Wolkenberg
        addPart(-1.2, 1.5, 0, 2.7, 2.6, 2.4, cloudWhite);

        // Mittlerer Wolkenberg
        addPart(1.5, 1.1, 0, 3.1, 2.2, 2.3, cloudWhite);

        // Rechter Wolkenberg
        addPart(4.1, 0.5, 0, 2.5, 1.8, 2.0, cloudWhite);

        // Kleine seitliche Ausläufer
        addPart(-5.2, 0.1, 0.5, 1.8, 1.2, 1.7, cloudShade);
        addPart(5.6, 0.1, -0.3, 1.8, 1.2, 1.7, cloudShade);

        // Zusätzliche obere Formen
        addPart(-3.0, 1.8, 0.2, 1.7, 1.5, 1.7, cloudWhite);
        addPart(3.2, 1.7, 0.1, 1.8, 1.4, 1.7, cloudWhite);

        cloud.scale.setScalar(random(0.75, 1.45));

        return cloud;
    }

    // ==========================================
    // 18 WOLKEN ERSTELLEN
    // ==========================================

    const CLOUD_COUNT = 18;

    for (let i = 0; i < CLOUD_COUNT; i++) {

        const cloud = createCloud();

        cloud.position.set(
            random(-180, 180),
            random(42, 75),
            random(-150, 150)
        );

        cloud.userData.speed = random(2, 5);
        cloud.userData.baseY = cloud.position.y;
        cloud.userData.phase = random(0, Math.PI * 2);
        cloud.userData.bobSpeed = random(0.15, 0.4);

        // Unterschiedliche Wolkenrichtungen leicht variieren
        cloud.userData.drift = random(-0.5, 0.5);

        scene.add(cloud);

        clouds.push(cloud);
    }

    // ==========================================
    // ANIMATION
    // ==========================================

    function update(deltaTime) {

        const delta = Math.min(deltaTime, 0.05);

        for (const cloud of clouds) {

            cloud.position.x +=
                cloud.userData.speed * delta;

            cloud.position.z +=
                cloud.userData.drift * delta;

            // Leichte Höhenbewegung
            cloud.userData.phase +=
                cloud.userData.bobSpeed * delta;

            cloud.position.y =
                cloud.userData.baseY +
                Math.sin(cloud.userData.phase) * 0.35;

            // Wieder am linken Rand erscheinen
            if (cloud.position.x > 190) {

                cloud.position.x = -190;

                cloud.position.z = random(-150, 150);
                cloud.position.y = random(42, 75);

                cloud.userData.baseY = cloud.position.y;
            }

            // Kleine Rotation
            cloud.rotation.y += delta * 0.003;
        }
    }

    // ==========================================
    // RÜCKGABE
    // ==========================================

    return {
        update,
        clouds
    };
}
