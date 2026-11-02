
import * as THREE from "three";

export function createModel() {
    const root = new THREE.Group();
    root.name = "Cola_Dose";

    // Materialien
    const red = new THREE.MeshStandardMaterial({
        color: 0xb51f25,
        roughness: 0.65,
        flatShading: true
    });

    const darkRed = new THREE.MeshStandardMaterial({
        color: 0x79151b,
        roughness: 0.75,
        flatShading: true
    });

    const silver = new THREE.MeshStandardMaterial({
        color: 0xbfc4c7,
        metalness: 0.8,
        roughness: 0.28,
        flatShading: true
    });

    const silverDark = new THREE.MeshStandardMaterial({
        color: 0x747d82,
        metalness: 0.7,
        roughness: 0.4
    });

    const black = new THREE.MeshStandardMaterial({
        color: 0x252525,
        roughness: 0.7
    });

    function cylinder(radiusTop, radiusBottom, height, material, y, segments = 12) {
        const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(
                radiusTop,
                radiusBottom,
                height,
                segments
            ),
            material
        );

        mesh.position.y = y;
        root.add(mesh);
        return mesh;
    }

    // ============================================
    // DOSENKÖRPER
    // ============================================

    cylinder(
        0.28,
        0.28,
        0.95,
        red,
        0
    );

    // Oberer Schulterbereich
    const shoulder = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.235,
            0.28,
            0.13,
            12
        ),
        red
    );

    shoulder.position.y = 0.54;
    root.add(shoulder);

    // Unterer Dosenrand
    cylinder(
        0.28,
        0.25,
        0.055,
        darkRed,
        -0.49
    );

    // ============================================
    // OBERER METALLRAND
    // ============================================

    const topRim = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.235,
            0.235,
            0.045,
            16
        ),
        silver
    );

    topRim.position.y = 0.62;
    root.add(topRim);

    // ============================================
    // DOSENDECKEL
    // ============================================

    cylinder(
        0.235,
        0.235,
        0.035,
        silver,
        0.65,
        16
    );

    // Deckelmitte
    const lidCenter = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.205,
            0.205,
            0.012,
            16
        ),
        silver
    );

    lidCenter.position.y = 0.675;
    root.add(lidCenter);

    // Deckelvertiefung
    const innerRing = new THREE.Mesh(
        new THREE.TorusGeometry(
            0.145,
            0.009,
            5,
            16
        ),
        silverDark
    );

    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.y = 0.684;
    root.add(innerRing);

    // ============================================
    // ÖFFNUNGSLASCHE
    // ============================================

    const tab = new THREE.Group();
    tab.position.set(0, 0.694, -0.015);
    root.add(tab);

    // Metalllasche
    const tabShape = new THREE.Shape();

    tabShape.moveTo(-0.035, -0.105);
    tabShape.lineTo(0.035, -0.105);
    tabShape.lineTo(0.055, -0.025);
    tabShape.lineTo(0.035, 0.085);
    tabShape.lineTo(-0.035, 0.085);
    tabShape.lineTo(-0.055, -0.025);
    tabShape.closePath();

    const tabGeometry = new THREE.ExtrudeGeometry(
        tabShape,
        {
            depth: 0.012,
            bevelEnabled: false
        }
    );

    const tabMesh = new THREE.Mesh(
        tabGeometry,
        silver
    );

    tabMesh.rotation.x = 0;
    tab.add(tabMesh);

    // Loch in der Lasche als dunkle Fläche
    const hole = new THREE.Mesh(
        new THREE.CircleGeometry(0.027, 10),
        silverDark
    );

    hole.position.set(0, 0.035, 0.014);
    tab.add(hole);

    // Kleiner Niet in der Mitte
    const rivet = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.025,
            0.025,
            0.018,
            10
        ),
        silverDark
    );

    rivet.rotation.x = Math.PI / 2;
    rivet.position.set(0, -0.035, 0.012);
    tab.add(rivet);

    // ============================================
    // DECKELDETAILS
    // ============================================

    // Kleine Prägung am Rand
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;

        const mark = new THREE.Mesh(
            new THREE.BoxGeometry(0.012, 0.012, 0.012),
            silverDark
        );

        mark.position.set(
            Math.cos(angle) * 0.222,
            0.675,
            Math.sin(angle) * 0.222
        );

        root.add(mark);
    }

    // ============================================
    // BODENDETAIL
    // ============================================

    const bottom = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.22,
            0.22,
            0.025,
            16
        ),
        silver
    );

    bottom.position.y = -0.52;
    root.add(bottom);

    // Ganze Dose etwas aufrichten
    root.position.y = 0.53;

    return root;
}

export default createModel;
