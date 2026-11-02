
export async function createInsel1Shop(THREE, scene, options = {}) {
    const shop = new THREE.Group();
    shop.name = "Insel_1_Shop";

    // Position und Ausrichtung
    if (options.position?.isVector3) {
        shop.position.copy(options.position);
    } else {
        shop.position.set(
            options.position?.x ?? 0,
            options.position?.y ?? 1.5,
            options.position?.z ?? 0
        );
    }

    shop.rotation.y = options.rotationY ?? 0;
    scene.add(shop);

    // MATERIALIEN
    const woodDark = new THREE.MeshStandardMaterial({
        color: 0x38251a,
        roughness: 1
    });

    const wood = new THREE.MeshStandardMaterial({
        color: 0x795033,
        roughness: 1
    });

    const woodLight = new THREE.MeshStandardMaterial({
        color: 0x98704a,
        roughness: 1
    });

    const woodEdge = new THREE.MeshStandardMaterial({
        color: 0x49301e,
        roughness: 1
    });

    const metal = new THREE.MeshStandardMaterial({
        color: 0x777777,
        metalness: 0.4,
        roughness: 0.7
    });

    const dark = new THREE.MeshStandardMaterial({
        color: 0x211a15,
        roughness: 1
    });

    // HILFSFUNKTIONEN
    function box(parent, w, h, d, material, x, y, z) {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(w, h, d),
            material
        );

        mesh.position.set(x, y, z);
        parent.add(mesh);

        return mesh;
    }

    function textTexture(title, subtitle = "") {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 192;

        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#49301e";
        ctx.fillRect(0, 0, 512, 192);

        ctx.fillStyle = "#795033";
        ctx.fillRect(9, 9, 494, 174);

        ctx.strokeStyle = "#b28a5c";
        ctx.lineWidth = 8;
        ctx.strokeRect(12, 12, 488, 168);

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#f5e4c9";

        ctx.font = "bold 62px Arial";
        ctx.fillText(title, 256, subtitle ? 76 : 96, 460);

        if (subtitle) {
            ctx.font = "bold 27px Arial";
            ctx.fillStyle = "#ddc19a";
            ctx.fillText(subtitle, 256, 140, 460);
        }

        const texture = new THREE.CanvasTexture(canvas);

        if (THREE.SRGBColorSpace) {
            texture.colorSpace = THREE.SRGBColorSpace;
        }

        return texture;
    }

    function textPlate(parent, title, subtitle, w, h, x, y, z) {
        const texture = textTexture(title, subtitle);

        const plate = new THREE.Mesh(
            new THREE.PlaneGeometry(w, h),
            new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            })
        );

        plate.position.set(x, y, z);
        parent.add(plate);

        return plate;
    }

    // ============================================
    // SHOP-RÜCKWAND
    // ============================================

    box(shop, 3.25, 2.9, 0.18, woodDark, 0, 0, 0);

    // Bretter
    for (let i = 0; i < 8; i++) {
        box(
            shop,
            3.05,
            0.34,
            0.055,
            i % 2 === 0 ? wood : woodLight,
            0,
            -1.18 + i * 0.34,
            0.11
        );
    }

    // Rahmen
    box(shop, 0.13, 2.98, 0.15, woodEdge, -1.58, 0, 0.14);
    box(shop, 0.13, 2.98, 0.15, woodEdge,  1.58, 0, 0.14);

    box(shop, 3.25, 0.13, 0.15, woodEdge, 0, 1.44, 0.14);
    box(shop, 3.25, 0.13, 0.15, woodEdge, 0, -1.44, 0.14);

    // ============================================
    // SHOP-SCHILD
    // ============================================

    box(shop, 2.0, 0.48, 0.14, woodDark, 0, 1.15, 0.20);

    textPlate(
        shop,
        "SHOP",
        "INSEL 1",
        1.88,
        0.40,
        0,
        1.15,
        0.28
    );

    // ============================================
    // PRODUKTPLÄTZE
    // ============================================

    const products = [
        {
            id: "krabenangel",
            name: "KRABBENANGEL",
            file: "./krabenangel.js",
            x: -1.18,
            size: 0.95
        },
        {
            id: "schlagring",
            name: "SCHLAGRING",
            file: "./schlagring.js",
            x: -0.59,
            size: 0.65
        },
        {
            id: "cola",
            name: "COLA",
            file: "./cola.js",
            x: 0,
            size: 0.65
        },
        {
            id: "messer",
            name: "MESSER",
            file: "./messer.js",
            x: 0.59,
            size: 0.65
        },
        {
            id: "hotdog",
            name: "HOTDOG",
            file: "./hotdog.js",
            x: 1.18,
            size: 0.65
        }
    ];

    const models = {};

    // Fünf kleine Produktfächer
    for (const item of products) {
        // Hintergrund
        box(
            shop,
            0.55, 1.25, 0.07,
            dark,
            item.x, 0.02, 0.19
        );

        // Seitenrahmen
        box(
            shop,
            0.045, 1.27, 0.09,
            woodLight,
            item.x - 0.275, 0.02, 0.25
        );

        box(
            shop,
            0.045, 1.27, 0.09,
            woodLight,
            item.x + 0.275, 0.02, 0.25
        );

        // Ablage
        box(
            shop,
            0.61, 0.11, 0.48,
            wood,
            item.x, -0.59, 0.39
        );

        // Ablagenkante
        box(
            shop,
            0.61, 0.045, 0.07,
            woodEdge,
            item.x, -0.55, 0.63
        );

        // Namensschild
        box(
            shop,
            0.57, 0.29, 0.07,
            woodDark,
            item.x, -0.98, 0.21
        );

        textPlate(
            shop,
            item.name,
            "",
            0.53,
            0.23,
            item.x,
            -0.98,
            0.255
        );

        // Nägel
        for (const side of [-1, 1]) {
            const nail = new THREE.Mesh(
                new THREE.SphereGeometry(0.025, 6, 5),
                metal
            );

            nail.position.set(
                item.x + side * 0.23,
                -0.49,
                0.43
            );

            shop.add(nail);
        }
    }

    // ============================================
    // MODELLE AUS SEPARATEN DATEIEN LADEN
    // ============================================

    async function loadProduct(item) {
        try {
            const module = await import(
                new URL(item.file, import.meta.url).href
            );

            const factory =
                module.default ||
                module.createModel ||
                module.createItem ||
                module.loadModel;

            let model;

            if (typeof factory === "function") {
                model = await factory(THREE);
            } else if (module.model?.isObject3D) {
                model = module.model.clone(true);
            }

            // GLTFLoader-Rückgabe unterstützen
            if (model?.scene?.isObject3D) {
                model = model.scene;
            }

            if (!model?.isObject3D) {
                throw new Error(
                    "Die Datei muss ein THREE.Object3D zurückgeben."
                );
            }

            model.name = "Shop_" + item.id;

            // Modellgröße bestimmen
            model.updateMatrixWorld(true);

            const bounds = new THREE.Box3().setFromObject(model);
            const size = bounds.getSize(new THREE.Vector3());

            const largest = Math.max(size.x, size.y, size.z);

            if (largest > 0) {
                model.scale.multiplyScalar(item.size / largest);
            }

            // Auf der Ablage zentrieren
            model.updateMatrixWorld(true);

            const scaledBounds = new THREE.Box3().setFromObject(model);
            const center = scaledBounds.getCenter(new THREE.Vector3());

            model.position.x += item.x - center.x;
            model.position.y += -0.535 - scaledBounds.min.y;
            model.position.z += 0.48 - center.z;

            shop.add(model);
            models[item.id] = model;

            console.log("Shop-Item geladen:", item.id);

        } catch (error) {
            console.error(
                "Fehler beim Laden von " + item.id + ":",
                error
            );
        }
    }

    await Promise.all(products.map(loadProduct));

    // ============================================
    // SHOP-BELEUCHTUNG
    // ============================================

    const light = new THREE.PointLight(
        0xffd9a8,
        2.5,
        5
    );

    light.position.set(0, 0.8, 1.7);
    shop.add(light);

    return {
        group: shop,
        models,
        products
    };
}

export default createInsel1Shop;
