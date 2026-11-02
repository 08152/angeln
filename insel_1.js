
import * as THREE from "three";

export function createIsland1(scene) {

    const island = new THREE.Group();

    // =========================================
    // MATERIALIEN
    // =========================================

    // EINE EINZIGE STEINFARBE FÜR DIE KOMPLETTE INSEL
    const stoneMaterial = new THREE.MeshStandardMaterial({
        color: 0x777879,
        roughness: 1,
        flatShading: true
    });

    // Leuchtturm
    const lighthouseWhite = new THREE.MeshStandardMaterial({
        color: 0xe5e3dc,
        roughness: 1,
        flatShading: true
    });

    const lighthouseDark = new THREE.MeshStandardMaterial({
        color: 0x343638,
        roughness: 1,
        flatShading: true
    });

    const doorMaterial = new THREE.MeshStandardMaterial({
        color: 0x593c2c,
        roughness: 1,
        flatShading: true
    });

    const glassMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd58a,
        emissive: 0xffa72c,
        emissiveIntensity: 0.5,
        flatShading: true
    });

    const metalMaterial = new THREE.MeshStandardMaterial({
        color: 0x474b4d,
        metalness: 0.3,
        roughness: 0.8,
        flatShading: true
    });


    // =========================================
    // HILFSFUNKTIONEN
    // =========================================

    function addMesh(parent, geometry, material, x, y, z) {

        const object = new THREE.Mesh(geometry, material);

        object.position.set(x, y, z);
        object.castShadow = true;
        object.receiveShadow = true;

        parent.add(object);

        return object;
    }


    function createFlatGeometry(vertices, indices) {

        const geometry = new THREE.BufferGeometry();

        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(vertices, 3)
        );

        geometry.setIndex(indices);

        const flatGeometry = geometry.toNonIndexed();

        flatGeometry.computeVertexNormals();

        return flatGeometry;
    }


    // =========================================
    // INSEL-LANDSCHAFT
    // =========================================

    const SEGMENTS = 14;

    const RADII = [
        0.18,
        0.38,
        0.58,
        0.80,
        1.00
    ];

    // Festgelegte Form statt zufälliger Insel bei jedem Laden
    function randomValue(seed) {

        const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;

        return value - Math.floor(value);
    }


    // Höhenverlauf der Insel
    // Hinten steigt das Gelände zum Leuchtturm an.

    function terrainHeight(x, z) {

        const lighthouseHill = Math.exp(
            -(
                (x * x) / 23 +
                ((z + 2.7) * (z + 2.7)) / 13
            )
        ) * 3.6;

        const rearSlope = Math.max(0, -z - 0.8) * 0.35;

        const frontSlope = Math.max(0, z - 3.0) * 0.20;

        return 1.35 + lighthouseHill + rearSlope - frontSlope;
    }


    // Inselkontur
    const ringVertices = [];

    const angularPositions = [];

    for (let j = 0; j < SEGMENTS; j++) {

        const angle = (j / SEGMENTS) * Math.PI * 2;

        angularPositions.push(
            angle + (randomValue(j + 10) - 0.5) * 0.09
        );
    }


    // Alle oberen Ringe berechnen
    for (let r = 0; r < RADII.length; r++) {

        const radius = RADII[r];

        for (let j = 0; j < SEGMENTS; j++) {

            const angle = angularPositions[j];

            const irregularity =
                1 +
                Math.sin(angle * 3 + 0.8) * 0.075 +
                Math.cos(angle * 5) * 0.035 +
                (randomValue(j + r * 25) - 0.5) * 0.07;

            const x =
                Math.cos(angle) * 8.5 * radius * irregularity;

            const z =
                Math.sin(angle) * 7.0 * radius * irregularity;

            const y = terrainHeight(x, z);

            ringVertices.push([x, y, z]);
        }
    }


    // Oberflächengeometrie erstellen
    const topVertices = [];
    const topIndices = [];

    topVertices.push(
        0,
        terrainHeight(0, 0),
        0
    );

    for (const ring of ringVertices) {

        for (const p of ring) {

            topVertices.push(p[0], p[1], p[2]);

        }
    }


    // Zentrum mit erstem Ring verbinden
    for (let j = 0; j < SEGMENTS; j++) {

        const next = (j + 1) % SEGMENTS;

        topIndices.push(
            0,
            1 + next,
            1 + j
        );
    }


    // Weitere Ringe triangulieren
    for (let r = 0; r < RADII.length - 1; r++) {

        const innerStart = 1 + r * SEGMENTS;

        const outerStart = 1 + (r + 1) * SEGMENTS;

        for (let j = 0; j < SEGMENTS; j++) {

            const next = (j + 1) % SEGMENTS;

            const a = innerStart + j;
            const b = innerStart + next;
            const c = outerStart + next;
            const d = outerStart + j;

            topIndices.push(a, b, c);
            topIndices.push(a, c, d);
        }
    }


    const islandTop = addMesh(
        island,
        createFlatGeometry(topVertices, topIndices),
        stoneMaterial,
        0, 0, 0
    );


    // =========================================
    // FELSIGE INSELBÖSCHUNG
    // =========================================

    const sideVertices = [];
    const sideIndices = [];

    const sideRings = [
        {
            radius: 1.0,
            depth: 0
        },
        {
            radius: 0.96,
            depth: 0.8
        },
        {
            radius: 0.88,
            depth: 2.0
        },
        {
            radius: 0.78,
            depth: 3.6
        }
    ];


    for (let r = 0; r < sideRings.length; r++) {

        const ring = sideRings[r];

        for (let j = 0; j < SEGMENTS; j++) {

            const angle = angularPositions[j];

            const irregularity =
                1 +
                Math.sin(angle * 3 + 0.8) * 0.075 +
                Math.cos(angle * 5) * 0.035 +
                (randomValue(j + 4 * 25) - 0.5) * 0.07;

            const x =
                Math.cos(angle) * 8.5 * ring.radius * irregularity;

            const z =
                Math.sin(angle) * 7.0 * ring.radius * irregularity;

            const originalHeight = terrainHeight(
                Math.cos(angle) * 8.5 * irregularity,
                Math.sin(angle) * 7.0 * irregularity
            );

            const y = originalHeight - ring.depth;

            sideVertices.push(x, y, z);
        }
    }


    // Felswände triangulieren
    for (let r = 0; r < sideRings.length - 1; r++) {

        const current = r * SEGMENTS;
        const nextRing = (r + 1) * SEGMENTS;

        for (let j = 0; j < SEGMENTS; j++) {

            const next = (j + 1) % SEGMENTS;

            const a = current + j;
            const b = current + next;
            const c = nextRing + next;
            const d = nextRing + j;

            sideIndices.push(a, b, c);
            sideIndices.push(a, c, d);
        }
    }


    // Unterseite schließen
    const bottomCenter = sideVertices.length / 3;

    sideVertices.push(0, -3.2, 0);

    const lastRing = (sideRings.length - 1) * SEGMENTS;

    for (let j = 0; j < SEGMENTS; j++) {

        const next = (j + 1) % SEGMENTS;

        sideIndices.push(
            bottomCenter,
            lastRing + j,
            lastRing + next
        );
    }


    addMesh(
        island,
        createFlatGeometry(sideVertices, sideIndices),
        stoneMaterial,
        0, 0, 0
    );


    // =========================================
    // KANTIGE FELS-AUSLÄUFER
    // =========================================

    const rockPositions = [
        [-8.1, -1.0, -2.0, 1.4, 1.6, 1.3],
        [ 8.0, -1.5, -1.0, 1.5, 1.2, 1.2],
        [-7.8, -1.4,  3.0, 1.3, 1.5, 1.5],
        [ 7.5, -1.6,  3.5, 1.6, 1.4, 1.3],
        [-5.0, -2.3, -5.4, 1.5, 1.8, 1.3],
        [ 5.0, -2.1, -5.0, 1.4, 1.6, 1.4],
        [-3.0, -2.8,  6.0, 1.6, 1.2, 1.0],
        [ 3.0, -2.5,  6.0, 1.5, 1.4, 1.2]
    ];

    for (const p of rockPositions) {

        const rock = addMesh(
            island,
            new THREE.IcosahedronGeometry(1, 0),
            stoneMaterial,
            p[0], p[1], p[2]
        );

        rock.scale.set(p[3], p[4], p[5]);

        rock.rotation.set(
            0.2,
            p[0] * 0.13,
            0.15
        );
    }


    // =========================================
    // LEUCHTTURM
    // =========================================

    const lighthouse = new THREE.Group();

    const lighthouseGround = terrainHeight(0, -2.7);

    lighthouse.position.set(
        0,
        lighthouseGround,
        -2.7
    );

    island.add(lighthouse);


    function towerMesh(geometry, material, x, y, z) {

        return addMesh(
            lighthouse,
            geometry,
            material,
            x, y, z
        );
    }


    // =========================================
    // FUNDAMENT
    // =========================================

    towerMesh(
        new THREE.CylinderGeometry(1.65, 1.8, 0.45, 10),
        stoneMaterial,
        0, 0.22, 0
    );

    towerMesh(
        new THREE.CylinderGeometry(1.35, 1.55, 0.35, 10),
        lighthouseDark,
        0, 0.58, 0
    );


    // =========================================
    // LEUCHTTURM-KÖRPER
    // =========================================

    towerMesh(
        new THREE.CylinderGeometry(
            0.95,
            1.35,
            6.3,
            10,
            1
        ),
        lighthouseWhite,
        0, 3.75, 0
    );


    // Unterer Wandabschluss
    towerMesh(
        new THREE.CylinderGeometry(1.4, 1.42, 0.22, 10),
        lighthouseWhite,
        0, 0.9, 0
    );


    // Schmale Fenster
    function createTowerWindow(angle, y) {

        const radius = 1.03;

        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        const windowGroup = new THREE.Group();

        windowGroup.position.set(x, y, z);
        windowGroup.rotation.y = angle;

        lighthouse.add(windowGroup);

        addMesh(
            windowGroup,
            new THREE.BoxGeometry(0.31, 0.62, 0.07),
            lighthouseDark,
            0, 0, 0
        );

        addMesh(
            windowGroup,
            new THREE.BoxGeometry(0.19, 0.49, 0.035),
            glassMaterial,
            0, 0, 0.05
        );
    }

    createTowerWindow(0, 3.4);
    createTowerWindow(Math.PI, 4.8);
    createTowerWindow(Math.PI / 2, 5.2);
    createTowerWindow(-Math.PI / 2, 2.8);


    // =========================================
    // TÜR MIT RAHMEN
    // =========================================

    // Türöffnung
    const doorShape = new THREE.Shape();

    doorShape.moveTo(-0.47, 0);
    doorShape.lineTo(0.47, 0);
    doorShape.lineTo(0.47, 1.55);
    doorShape.quadraticCurveTo(0.47, 2.0, 0, 2.0);
    doorShape.quadraticCurveTo(-0.47, 2.0, -0.47, 1.55);
    doorShape.closePath();


    const doorFrameShape = new THREE.Shape();

    doorFrameShape.moveTo(-0.58, 0);
    doorFrameShape.lineTo(0.58, 0);
    doorFrameShape.lineTo(0.58, 1.58);
    doorFrameShape.quadraticCurveTo(0.58, 2.18, 0, 2.18);
    doorFrameShape.quadraticCurveTo(-0.58, 2.18, -0.58, 1.58);
    doorFrameShape.closePath();


    towerMesh(
        new THREE.ExtrudeGeometry(doorFrameShape, {
            depth: 0.09,
            bevelEnabled: false
        }),
        lighthouseDark,
        0, 0.75, 1.15
    );

    towerMesh(
        new THREE.ExtrudeGeometry(doorShape, {
            depth: 0.08,
            bevelEnabled: false
        }),
        doorMaterial,
        0, 0.78, 1.25
    );


    // Türbretter
    for (const y of [1.2, 1.65]) {

        towerMesh(
            new THREE.BoxGeometry(0.8, 0.045, 0.025),
            lighthouseDark,
            0, y, 1.34
        );
    }


    // Türgriff
    towerMesh(
        new THREE.SphereGeometry(0.07, 6, 5),
        metalMaterial,
        0.32, 1.55, 1.37
    );


    // Kleines Türschloss
    towerMesh(
        new THREE.BoxGeometry(0.1, 0.16, 0.04),
        metalMaterial,
        0.32, 1.33, 1.37
    );


    // =========================================
    // LEUCHTTURM-PLATTFORM
    // =========================================

    towerMesh(
        new THREE.CylinderGeometry(1.35, 1.2, 0.3, 10),
        lighthouseDark,
        0, 6.9, 0
    );

    towerMesh(
        new THREE.CylinderGeometry(1.5, 1.5, 0.15, 12),
        lighthouseWhite,
        0, 7.1, 0
    );


    // =========================================
    // GELÄNDER
    // =========================================

    const railingRadius = 1.35;

    for (let i = 0; i < 16; i++) {

        const angle = (i / 16) * Math.PI * 2;

        towerMesh(
            new THREE.CylinderGeometry(0.035, 0.045, 0.7, 5),
            metalMaterial,
            Math.cos(angle) * railingRadius,
            7.5,
            Math.sin(angle) * railingRadius
        );
    }


    // Oberer Geländerring
    const railing = towerMesh(
        new THREE.TorusGeometry(railingRadius, 0.045, 4, 16),
        metalMaterial,
        0, 7.85, 0
    );

    railing.rotation.x = Math.PI / 2;


    // =========================================
    // LICHTKAMMER
    // =========================================

    towerMesh(
        new THREE.CylinderGeometry(0.92, 1.0, 1.25, 10, 1, true),
        glassMaterial,
        0, 8.65, 0
    );


    // Vertikale Metallstreben
    for (let i = 0; i < 10; i++) {

        const angle = (i / 10) * Math.PI * 2;

        towerMesh(
            new THREE.BoxGeometry(0.055, 1.3, 0.055),
            metalMaterial,
            Math.cos(angle) * 0.92,
            8.65,
            Math.sin(angle) * 0.92
        );
    }


    // Oberer Abschluss
    towerMesh(
        new THREE.CylinderGeometry(1.15, 1.0, 0.2, 10),
        lighthouseDark,
        0, 9.35, 0
    );


    // =========================================
    // LEUCHTTURMDACH
    // =========================================

    towerMesh(
        new THREE.ConeGeometry(1.2, 0.9, 10),
        lighthouseDark,
        0, 9.9, 0
    );

    towerMesh(
        new THREE.CylinderGeometry(0.15, 0.18, 0.3, 6),
        metalMaterial,
        0, 10.5, 0
    );


    // =========================================
    // INSEL FERTIG
    // =========================================

    scene.add(island);

    return island;
}
