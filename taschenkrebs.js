
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export function createTaschenkrebs() {
    const crab = new THREE.Group();
    crab.name = "Taschenkrebs";

    // =========================================
    // MATERIALIEN
    // =========================================

    const shellMaterial = new THREE.MeshStandardMaterial({
        color: 0x765033,
        roughness: 0.95,
        flatShading: true
    });

    const shellLight = new THREE.MeshStandardMaterial({
        color: 0x956443,
        roughness: 1,
        flatShading: true
    });

    const darkBrown = new THREE.MeshStandardMaterial({
        color: 0x4d2d1c,
        roughness: 1,
        flatShading: true
    });

    const bellyMaterial = new THREE.MeshStandardMaterial({
        color: 0xd9b18a,
        roughness: 1,
        flatShading: true
    });

    const bellyLight = new THREE.MeshStandardMaterial({
        color: 0xe8c6a0,
        roughness: 1,
        flatShading: true
    });

    const eyeMaterial = new THREE.MeshStandardMaterial({
        color: 0x17110d,
        roughness: 0.5
    });

    // =========================================
    // HILFSFUNKTIONEN
    // =========================================

    function addMesh(geometry, material, position, scale, rotation = null) {
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(
            position.x,
            position.y,
            position.z
        );

        mesh.scale.set(
            scale.x,
            scale.y,
            scale.z
        );

        if (rotation) {
            mesh.rotation.set(
                rotation.x || 0,
                rotation.y || 0,
                rotation.z || 0
            );
        }

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        crab.add(mesh);

        return mesh;
    }

    function addSegment(start, end, radiusStart, radiusEnd, material) {
        const direction = new THREE.Vector3().subVectors(end, start);
        const length = direction.length();

        if (length <= 0.001) return null;

        const geometry = new THREE.CylinderGeometry(
            radiusEnd,
            radiusStart,
            length,
            5,
            1
        );

        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.copy(start).add(end).multiplyScalar(0.5);

        mesh.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            direction.normalize()
        );

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        crab.add(mesh);

        return mesh;
    }

    function addJoint(position, radius = 0.075) {
        return addMesh(
            new THREE.DodecahedronGeometry(radius, 0),
            shellLight,
            position,
            { x: 1, y: 0.9, z: 1 }
        );
    }

    // =========================================
    // KÖRPER
    // =========================================

    // Dunkler äußerer Körperrand
    addMesh(
        new THREE.DodecahedronGeometry(1, 0),
        darkBrown,
        { x: 0, y: 0.25, z: 0 },
        { x: 0.83, y: 0.19, z: 0.59 }
    );

    // Brauner Rückenpanzer
    addMesh(
        new THREE.IcosahedronGeometry(1, 0),
        shellMaterial,
        { x: 0, y: 0.31, z: 0 },
        { x: 0.77, y: 0.17, z: 0.55 }
    );

    // Heller Bauchbereich
    addMesh(
        new THREE.DodecahedronGeometry(1, 0),
        bellyMaterial,
        { x: 0, y: 0.40, z: 0 },
        { x: 0.65, y: 0.105, z: 0.44 }
    );

    // Helle Bauchplatten
    for (let i = 0; i < 5; i++) {
        const width = 0.34 - i * 0.035;

        addMesh(
            new THREE.DodecahedronGeometry(1, 0),
            i % 2 === 0 ? bellyLight : bellyMaterial,
            {
                x: 0,
                y: 0.475,
                z: -0.25 + i * 0.12
            },
            {
                x: width,
                y: 0.025,
                z: 0.075
            }
        );
    }

    // Kleine seitliche Panzerplatten
    for (const side of [-1, 1]) {
        for (let i = 0; i < 3; i++) {
            addMesh(
                new THREE.DodecahedronGeometry(0.12, 0),
                shellLight,
                {
                    x: side * 0.69,
                    y: 0.30,
                    z: -0.24 + i * 0.24
                },
                {
                    x: 1.2,
                    y: 0.65,
                    z: 0.8
                }
            );
        }
    }

    // =========================================
    // AUGEN
    // =========================================

    for (const side of [-1, 1]) {
        const eyePosition = {
            x: side * 0.17,
            y: 0.48,
            z: 0.43
        };

        // Augenstiel
        addSegment(
            new THREE.Vector3(side * 0.17, 0.38, 0.37),
            new THREE.Vector3(eyePosition.x, 0.53, 0.43),
            0.035,
            0.025,
            shellMaterial
        );

        // Auge
        addMesh(
            new THREE.SphereGeometry(0.055, 7, 5),
            eyeMaterial,
            eyePosition,
            { x: 1, y: 1, z: 1 }
        );
    }

    // =========================================
    // ACHT LAUFBEINE
    // =========================================

    for (const side of [-1, 1]) {
        for (let i = 0; i < 4; i++) {
            const z = 0.28 - i * 0.22;

            const start = new THREE.Vector3(
                side * 0.57,
                0.25,
                z
            );

            const middle = new THREE.Vector3(
                side * 0.91,
                0.17,
                z + (i - 1.5) * 0.10
            );

            const end = new THREE.Vector3(
                side * 1.21,
                0.09,
                z + (i - 1.5) * 0.18
            );

            // Oberes Beinglied
            addSegment(
                start,
                middle,
                0.085,
                0.065,
                shellMaterial
            );

            // Unteres Beinglied
            addSegment(
                middle,
                end,
                0.065,
                0.025,
                darkBrown
            );

            addJoint(middle, 0.065);
        }
    }

    // =========================================
    // ZWEI GROẞE SCHEREN
    // =========================================

    for (const side of [-1, 1]) {
        // Scherenarm
        const armStart = new THREE.Vector3(
            side * 0.48,
            0.27,
            0.35
        );

        const armMiddle = new THREE.Vector3(
            side * 0.76,
            0.22,
            0.55
        );

        const armEnd = new THREE.Vector3(
            side * 0.94,
            0.19,
            0.72
        );

        addSegment(
            armStart,
            armMiddle,
            0.11,
            0.085,
            shellMaterial
        );

        addSegment(
            armMiddle,
            armEnd,
            0.085,
            0.07,
            darkBrown
        );

        addJoint(armMiddle, 0.09);

        // Scherenkörper
        addMesh(
            new THREE.DodecahedronGeometry(1, 0),
            shellLight,
            {
                x: side * 1.00,
                y: 0.19,
                z: 0.78
            },
            {
                x: 0.25,
                y: 0.14,
                z: 0.23
            }
        );

        // Innere Scherenspitze
        addSegment(
            new THREE.Vector3(
                side * 0.91,
                0.18,
                0.84
            ),
            new THREE.Vector3(
                side * 0.75,
                0.13,
                1.10
            ),
            0.095,
            0.015,
            darkBrown
        );

        // Äußere Scherenspitze
        addSegment(
            new THREE.Vector3(
                side * 1.09,
                0.18,
                0.84
            ),
            new THREE.Vector3(
                side * 1.19,
                0.13,
                1.03
            ),
            0.085,
            0.015,
            shellMaterial
        );
    }

    // =========================================
    // MODELL-EIGENSCHAFTEN
    // =========================================

    crab.userData.name = "Taschenkrebs";
    crab.userData.health = 30;
    crab.userData.maxHealth = 30;
    crab.userData.alive = true;

    // Schaden
    crab.userData.takeDamage = function(amount) {
        if (!crab.userData.alive) return 0;

        const damage = Math.max(0, Number(amount) || 0);

        crab.userData.health = Math.max(
            0,
            crab.userData.health - damage
        );

        if (crab.userData.health <= 0) {
            crab.userData.alive = false;
        }

        return crab.userData.health;
    };

    // Leben wiederherstellen
    crab.userData.resetHealth = function() {
        crab.userData.health = 30;
        crab.userData.alive = true;
    };

    return crab;
}

export default createTaschenkrebs;
