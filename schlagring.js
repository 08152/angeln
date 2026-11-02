
import * as THREE from "three";

export function createModel() {
    const root = new THREE.Group();
    root.name = "Goldener_Schlagring";

    const gold = new THREE.MeshStandardMaterial({
        color: 0xd9a51c,
        metalness: 0.85,
        roughness: 0.24,
        flatShading: true
    });

    const goldLight = new THREE.MeshStandardMaterial({
        color: 0xffd75e,
        metalness: 0.9,
        roughness: 0.2
    });

    const goldDark = new THREE.MeshStandardMaterial({
        color: 0x987014,
        metalness: 0.8,
        roughness: 0.3
    });

    // ============================================
    // AUSSENFORM
    // ============================================

    const outerShape = new THREE.Shape();

    const width = 0.72;
    const height = 0.52;
    const radius = 0.11;

    outerShape.moveTo(-width / 2 + radius, -height / 2);
    outerShape.lineTo(width / 2 - radius, -height / 2);
    outerShape.quadraticCurveTo(
        width / 2,
        -height / 2,
        width / 2,
        -height / 2 + radius
    );

    outerShape.lineTo(width / 2, height / 2 - radius);
    outerShape.quadraticCurveTo(
        width / 2,
        height / 2,
        width / 2 - radius,
        height / 2
    );

    outerShape.lineTo(-width / 2 + radius, height / 2);
    outerShape.quadraticCurveTo(
        -width / 2,
        height / 2,
        -width / 2,
        height / 2 - radius
    );

    outerShape.lineTo(-width / 2, -height / 2 + radius);
    outerShape.quadraticCurveTo(
        -width / 2,
        -height / 2,
        -width / 2 + radius,
        -height / 2
    );

    // Vier Öffnungen
    const holeRadius = 0.075;

    const holePositions = [
        [-0.27, -0.15],
        [-0.09, -0.15],
        [0.09, -0.15],
        [0.27, -0.15]
    ];

    for (const [x, y] of holePositions) {
        const hole = new THREE.Path();

        hole.absellipse(
            x,
            y,
            holeRadius,
            holeRadius,
            0,
            Math.PI * 2,
            true,
            0
        );

        outerShape.holes.push(hole);
    }

    const geometry = new THREE.ExtrudeGeometry(
        outerShape,
        {
            depth: 0.13,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 1,
            bevelSize: 0.025,
            bevelThickness: 0.025,
            curveSegments: 8
        }
    );

    const body = new THREE.Mesh(geometry, gold);
    body.position.z = -0.065;
    root.add(body);

    // ============================================
    // GLÄNZENDE OBERKANTE
    // ============================================

    const top = new THREE.Mesh(
        new THREE.ExtrudeGeometry(
            outerShape,
            {
                depth: 0.025,
                bevelEnabled: false,
                curveSegments: 8
            }
        ),
        goldLight
    );

    top.position.z = 0.075;
    root.add(top);

    // ============================================
    // DEKORATIVE GOLDENE KANTE
    // ============================================

    const edge = new THREE.Mesh(
        new THREE.TorusGeometry(
            0.025,
            0.012,
            5,
            8
        ),
        goldDark
    );

    edge.position.set(0, 0.23, 0.09);
    edge.scale.set(4.5, 0.6, 1);
    root.add(edge);

    // ============================================
    // GOLDENER GLANZ
    // ============================================

    const shine = new THREE.Mesh(
        new THREE.BoxGeometry(0.36, 0.025, 0.008),
        goldLight
    );

    shine.position.set(0, 0.18, 0.105);
    shine.rotation.z = -0.12;
    root.add(shine);

    // ============================================
    // AUSRICHTUNG
    // ============================================

    root.rotation.x = -0.08;
    root.rotation.y = 0.12;

    return root;
}

export default createModel;
