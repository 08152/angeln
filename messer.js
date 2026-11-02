
import * as THREE from "three";

export function createModel() {
    const root = new THREE.Group();
    root.name = "Military_Knife_LowPoly";

    // MATERIALIEN
    const bladeMaterial = new THREE.MeshStandardMaterial({
        color: 0x777e80,
        metalness: 0.8,
        roughness: 0.32,
        flatShading: true
    });

    const bladeDark = new THREE.MeshStandardMaterial({
        color: 0x41494b,
        metalness: 0.65,
        roughness: 0.4,
        flatShading: true
    });

    const black = new THREE.MeshStandardMaterial({
        color: 0x171b19,
        roughness: 0.8,
        flatShading: true
    });

    const green = new THREE.MeshStandardMaterial({
        color: 0x354b32,
        roughness: 0.9,
        flatShading: true
    });

    const metal = new THREE.MeshStandardMaterial({
        color: 0x9da4a4,
        metalness: 0.8,
        roughness: 0.3
    });

    // HILFSFUNKTION
    function box(parent, w, h, d, material, x, y, z) {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(w, h, d),
            material
        );

        mesh.position.set(x, y, z);
        parent.add(mesh);

        return mesh;
    }

    // ============================================
    // GRIFF
    // ============================================

    const handle = new THREE.Group();
    root.add(handle);

    // Schwarzer Griffkörper
    const grip = new THREE.Mesh(
        new THREE.BoxGeometry(0.19, 0.62, 0.14),
        black
    );

    grip.position.set(0, -0.43, 0);
    grip.rotation.z = -0.08;
    handle.add(grip);

    // Grüne Griffauflage
    const gripPanel = new THREE.Mesh(
        new THREE.BoxGeometry(0.145, 0.43, 0.025),
        green
    );

    gripPanel.position.set(0, -0.43, 0.078);
    gripPanel.rotation.z = -0.08;
    handle.add(gripPanel);

    // Griff-Rillen
    for (let i = 0; i < 5; i++) {
        const groove = box(
            handle,
            0.13,
            0.018,
            0.012,
            black,
            0,
            -0.27 - i * 0.075,
            0.095
        );

        groove.rotation.z = -0.08;
    }

    // Griffende
    box(
        handle,
        0.21,
        0.075,
        0.16,
        metal,
        0,
        -0.76,
        0
    );

    // ============================================
    // HANDSCHUTZ
    // ============================================

    const guard = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, 0.095, 0.17),
        metal
    );

    guard.position.set(0, -0.075, 0);
    guard.rotation.z = -0.04;
    root.add(guard);

    // Dunkle Endstücke am Handschutz
    box(root, 0.07, 0.11, 0.18, black, -0.235, -0.075, 0);
    box(root, 0.07, 0.11, 0.18, black, 0.235, -0.075, 0);

    // ============================================
    // KLINGE
    // ============================================

    const bladeShape = new THREE.Shape();

    bladeShape.moveTo(-0.105, -0.015);
    bladeShape.lineTo(0.105, -0.015);
    bladeShape.lineTo(0.085, 0.62);
    bladeShape.lineTo(0.055, 0.88);
    bladeShape.lineTo(0, 1.02);
    bladeShape.lineTo(-0.055, 0.88);
    bladeShape.lineTo(-0.085, 0.62);
    bladeShape.closePath();

    const bladeGeometry = new THREE.ExtrudeGeometry(
        bladeShape,
        {
            depth: 0.045,
            bevelEnabled: true,
            bevelSegments: 1,
            bevelSize: 0.012,
            bevelThickness: 0.012
        }
    );

    const blade = new THREE.Mesh(
        bladeGeometry,
        bladeMaterial
    );

    blade.position.set(0, -0.02, -0.022);
    root.add(blade);

    // Dunkler Mittelstreifen als optisches Detail
    const ridge = new THREE.Mesh(
        new THREE.BoxGeometry(0.025, 0.72, 0.008),
        bladeDark
    );

    ridge.position.set(0, 0.43, 0.035);
    root.add(ridge);

    // ============================================
    // KLINGENANSATZ
    // ============================================

    box(
        root,
        0.19,
        0.09,
        0.075,
        bladeDark,
        0,
        -0.035,
        0
    );

    // ============================================
    // SCHRAUBEN AM GRIFF
    // ============================================

    for (const y of [-0.27, -0.58]) {
        const screw = new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.025,
                0.025,
                0.018,
                8
            ),
            metal
        );

        screw.rotation.x = Math.PI / 2;
        screw.position.set(0, y, 0.105);
        root.add(screw);
    }

    // ============================================
    // GRIFFÖFFNUNG
    // ============================================

    const hole = new THREE.Mesh(
        new THREE.TorusGeometry(
            0.045,
            0.012,
            6,
            10
        ),
        metal
    );

    hole.position.set(0, -0.78, 0.075);
    root.add(hole);

    // ============================================
    // AUSRICHTUNG
    // ============================================

    root.rotation.x = 0.05;
    root.rotation.y = 0.12;

    return root;
}

export default createModel;
