
import * as THREE from "three";

export function createModel() {
    const root = new THREE.Group();
    root.name = "Halbes_Hotdog_Wuerstchen";

    const sausageMaterial = new THREE.MeshStandardMaterial({
        color: 0xa9432b,
        roughness: 0.85,
        flatShading: true
    });

    const cutMaterial = new THREE.MeshStandardMaterial({
        color: 0xd97855,
        roughness: 0.9,
        flatShading: true
    });

    const metal = new THREE.MeshStandardMaterial({
        color: 0xbfc5c7,
        metalness: 0.8,
        roughness: 0.3
    });

    // Halbes Würstchen
    const sausage = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.105,
            0.13,
            0.48,
            10,
            1,
            false
        ),
        sausageMaterial
    );

    sausage.rotation.z = Math.PI / 2;
    root.add(sausage);

    // Abgerundetes Ende
    const roundedEnd = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 10, 7),
        sausageMaterial
    );

    roundedEnd.position.x = 0.24;
    root.add(roundedEnd);

    // Flache Schnittfläche am anderen Ende
    const cutEnd = new THREE.Mesh(
        new THREE.CircleGeometry(0.105, 10),
        cutMaterial
    );

    cutEnd.rotation.y = -Math.PI / 2;
    cutEnd.position.x = -0.241;
    root.add(cutEnd);

    // Kleine Schnittstruktur
    const cutCenter = new THREE.Mesh(
        new THREE.CircleGeometry(0.065, 8),
        sausageMaterial
    );

    cutCenter.rotation.y = -Math.PI / 2;
    cutCenter.position.x = -0.243;
    root.add(cutCenter);

    // Angelschnur-Öse
    const eyelet = new THREE.Mesh(
        new THREE.TorusGeometry(0.045, 0.009, 6, 10),
        metal
    );

    eyelet.position.set(0, 0.13, 0);
    root.add(eyelet);

    // Befestigungsstift
    const pin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.10, 8),
        metal
    );

    pin.position.set(0, 0.09, 0);
    root.add(pin);

    root.rotation.z = -0.12;
    root.rotation.y = 0.2;

    return root;
}

export default createModel;
