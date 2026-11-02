
import * as THREE from "three";

export function createModel() {
    const root = new THREE.Group();
    root.name = "Krabbenangel";

    // MATERIALIEN
    const black = new THREE.MeshStandardMaterial({
        color: 0x171b1b,
        roughness: 0.55
    });

    const green = new THREE.MeshStandardMaterial({
        color: 0x29a846,
        roughness: 0.55
    });

    const darkGreen = new THREE.MeshStandardMaterial({
        color: 0x12602b,
        roughness: 0.65
    });

    const metal = new THREE.MeshStandardMaterial({
        color: 0x9da7a5,
        metalness: 0.75,
        roughness: 0.3
    });

    const white = new THREE.MeshStandardMaterial({
        color: 0xf4f4ed,
        roughness: 0.45
    });

    const baitMaterial = new THREE.MeshStandardMaterial({
        color: 0xd6a04c,
        roughness: 0.8
    });

    // HILFSFUNKTIONEN
    function cylinderBetween(parent, a, b, radius, material, segments = 10) {
        const direction = new THREE.Vector3().subVectors(b, a);
        const length = direction.length();

        const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(
                radius,
                radius,
                length,
                segments
            ),
            material
        );

        mesh.position.copy(a).add(b).multiplyScalar(0.5);
        mesh.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            direction.normalize()
        );

        parent.add(mesh);
        return mesh;
    }

    function addBox(parent, w, h, d, material, x, y, z) {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(w, h, d),
            material
        );

        mesh.position.set(x, y, z);
        parent.add(mesh);
        return mesh;
    }

    // ============================================
    // ANGELGRIFF
    // ============================================

    const handle = new THREE.Group();
    root.add(handle);

    // Griff zeigt in Richtung -Y
    cylinderBetween(
        handle,
        new THREE.Vector3(0, -0.05, 0),
        new THREE.Vector3(0, -0.85, 0),
        0.075,
        black,
        12
    );

    // Grüner Griffbereich
    cylinderBetween(
        handle,
        new THREE.Vector3(0, -0.35, 0),
        new THREE.Vector3(0, -0.78, 0),
        0.082,
        green,
        12
    );

    // Schwarzes Griffende
    addBox(
        handle,
        0.18, 0.09, 0.18,
        black,
        0, -0.87, 0
    );

    // Griffrillen
    for (let i = 0; i < 5; i++) {
        const y = -0.42 - i * 0.065;

        cylinderBetween(
            handle,
            new THREE.Vector3(-0.074, y, 0),
            new THREE.Vector3(0.074, y, 0),
            0.012,
            darkGreen,
            8
        );
    }

    // ============================================
    // ANGELRUTE
    // ============================================

    const rod = new THREE.Group();
    root.add(rod);

    cylinderBetween(
        rod,
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 1.45, 0),
        0.045,
        black,
        10
    );

    cylinderBetween(
        rod,
        new THREE.Vector3(0, 0.15, 0),
        new THREE.Vector3(0, 1.45, 0),
        0.032,
        green,
        10
    );

    // Dünne Rutenspitze
    cylinderBetween(
        rod,
        new THREE.Vector3(0, 1.35, 0),
        new THREE.Vector3(0, 2.15, 0),
        0.012,
        black,
        8
    );

    // Grüne Akzente an der Rute
    for (let i = 0; i < 3; i++) {
        const y = 0.35 + i * 0.38;

        cylinderBetween(
            rod,
            new THREE.Vector3(-0.04, y, 0),
            new THREE.Vector3(0.04, y, 0),
            0.018,
            green,
            8
        );
    }

    // ============================================
    // ROLLENHALTER
    // ============================================

    const reelMount = new THREE.Group();
    reelMount.position.set(0, -0.05, 0);
    root.add(reelMount);

    addBox(
        reelMount,
        0.14, 0.22, 0.18,
        metal,
        0, 0, 0.08
    );

    // ============================================
    // ROLLE
    // ============================================

    const reel = new THREE.Group();
    reel.position.set(0, -0.12, 0.23);
    root.add(reel);

    // Rollenkörper
    const reelBody = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.19, 0.19, 0.16, 16
        ),
        black
    );

    reelBody.rotation.x = Math.PI / 2;
    reel.add(reelBody);

    // Grüne Seitenflächen
    const sideLeft = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.21, 0.21, 0.035, 16
        ),
        green
    );

    sideLeft.rotation.x = Math.PI / 2;
    sideLeft.position.z = -0.095;
    reel.add(sideLeft);

    const sideRight = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.21, 0.21, 0.035, 16
        ),
        green
    );

    sideRight.rotation.x = Math.PI / 2;
    sideRight.position.z = 0.095;
    reel.add(sideRight);

    // Spulenachse
    const axle = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.055, 0.055, 0.25, 12
        ),
        metal
    );

    axle.rotation.x = Math.PI / 2;
    reel.add(axle);

    // Rollengriff
    const crank = new THREE.Group();
    crank.position.set(0.22, 0, 0.16);
    reel.add(crank);

    const crankArm = addBox(
        crank,
        0.055, 0.25, 0.055,
        metal,
        0, 0, 0
    );

    crankArm.rotation.z = -0.55;

    const crankHandle = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.045, 0.045, 0.16, 10
        ),
        black
    );

    crankHandle.rotation.z = Math.PI / 2;
    crankHandle.position.set(0.12, -0.09, 0);
    crank.add(crankHandle);

    // ============================================
    // ROLLENBÜGEL
    // ============================================

    const bailCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.17, 0.16, 0.13),
        new THREE.Vector3(-0.24, 0.28, 0.13),
        new THREE.Vector3(0, 0.33, 0.13),
        new THREE.Vector3(0.24, 0.28, 0.13),
        new THREE.Vector3(0.17, 0.16, 0.13)
    ]);

    const bail = new THREE.Mesh(
        new THREE.TubeGeometry(bailCurve, 24, 0.012, 6, false),
        metal
    );

    reel.add(bail);

    // ============================================
    // ANGELSCHNUR
    // ============================================

    const lineMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff
    });

    const lineGeometry = new THREE.BufferGeometry();

    const linePositions = new Float32Array([
        0, 0, 0,
        0, 1, 0
    ]);

    lineGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(linePositions, 3)
    );

    const fishingLine = new THREE.Line(
        lineGeometry,
        lineMaterial
    );

    root.add(fishingLine);

    // ============================================
    // KÖDER
    // ============================================

    const bait = new THREE.Group();
    root.add(bait);

    // Kleiner orangefarbener Krabbenköder
    const baitBody = new THREE.Mesh(
        new THREE.SphereGeometry(0.075, 8, 6),
        baitMaterial
    );

    baitBody.scale.set(1.2, 0.75, 0.8);
    bait.add(baitBody);

    // Kleine Hakenform
    const hookCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.08, 0),
        new THREE.Vector3(0.035, 0.02, 0),
        new THREE.Vector3(0.025, -0.06, 0),
        new THREE.Vector3(-0.035, -0.07, 0)
    ]);

    const hook = new THREE.Mesh(
        new THREE.TubeGeometry(hookCurve, 12, 0.009, 5, false),
        metal
    );

    bait.add(hook);

    // Kleine Köderfäden
    for (let i = 0; i < 3; i++) {
        const leg = cylinderBetween(
            bait,
            new THREE.Vector3(0, -0.025, 0),
            new THREE.Vector3(
                Math.cos(i * 2.1) * 0.11,
                -0.10,
                Math.sin(i * 2.1) * 0.11
            ),
            0.009,
            darkGreen,
            5
        );
    }

    // ============================================
    // ANIMATIONSSTEUERUNG
    // ============================================

    let animationTime = 0;
    let castProgress = 0;
    let targetProgress = 0;
    let isCasting = false;

    const startPoint = new THREE.Vector3(0, 1.85, 0);
    const endPoint = new THREE.Vector3(0, 1.85, 0);

    function updateLine() {
        const tip = new THREE.Vector3(0, 2.15, 0);

        // Köderposition abhängig vom Auswurf
        const distance = 0.3 + castProgress * 3.0;

        const target = new THREE.Vector3(
            distance * 0.55,
            1.2 - castProgress * 0.8,
            0.2 + castProgress * 0.25
        );

        bait.position.copy(target);

        const positions = fishingLine.geometry.attributes.position;

        positions.setXYZ(0, tip.x, tip.y, tip.z);
        positions.setXYZ(1, target.x, target.y, target.z);

        positions.needsUpdate = true;
        fishingLine.geometry.computeBoundingSphere();
    }

    function cast() {
        targetProgress = 1;
        isCasting = true;
    }

    function reelIn() {
        targetProgress = 0;
        isCasting = false;
    }

    function update(delta = 0.016) {
        animationTime += delta;

        // Sanfte Bewegung beim Auswerfen und Einholen
        castProgress += (
            targetProgress - castProgress
        ) * Math.min(1, delta * 3.5);

        // Rolle dreht sich beim Einholen und Auswerfen
        reel.rotation.z += (
            isCasting ? -1 : 1
        ) * delta * 8 * (
            Math.abs(targetProgress - castProgress) > 0.01 ? 1 : 0
        );

        // Kurbel dreht sich mit
        crank.rotation.z = reel.rotation.z * 1.4;

        // Angelspitze federt leicht
        rod.rotation.z = Math.sin(animationTime * 1.7) * 0.012;

        // Köder bewegt sich leicht
        bait.rotation.z = Math.sin(animationTime * 3) * 0.12;
        bait.position.y += Math.sin(animationTime * 2.5) * 0.0005;

        updateLine();
    }

    // Anfangsposition
    updateLine();

    return {
        group: root,
        update,
        cast,
        reelIn,
        bait,
        reel,
        rod,
        fishingLine
    };
}

export default createModel;
