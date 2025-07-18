// Three.js está disponible globalmente como window.THREE

// Clase principal de la aplicación Tamagotchi
class MaxkodiaTamagotchi {
    constructor() {
        // Configuración de la escena
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        
        // Modelo y animaciones
        this.model = null;
        this.mixer = null;
        this.animations = {};
        this.currentAnimation = null;
        
        // Sistema de movimiento automático
        this.isMoving = false;
        this.targetPosition = new THREE.Vector3();
        this.movementSpeed = 0.02;
        this.waypoints = [];
        this.currentWaypoint = 0;
        this.movementInterval = null;
        this.movementPaused = false; // Nueva variable para pausar movimiento
        this.pauseStartTime = 0; // Tiempo cuando se pausó
        
        // Elementos del DOM
        this.canvas = document.getElementById('scene-canvas');
        // Eliminar referencias a botones
        // this.runButton = document.getElementById('run-button');
        // this.talkButton = document.getElementById('talk-button');
        this.responseText = document.getElementById('response-text');
        this.responsePanel = document.querySelector('.response-panel');
        
        // Sistema de IA
        this.ai = new AmixAI();
        console.log('Sistema de IA creado:', this.ai);
        
        // Sistema de traducción al español
        this.translationMode = false;
        this.translationTimer = null;
        this.translationDuration = 3000; // 3 segundos de traducción al español
        this.translationInterval = 5000; // Cambiar cada 5 segundos
        
        // Inicializar la aplicación
        this.init();
        this.modelReady = false; // Nuevo flag
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.clickCount = 0;
        this.clickTimer = null;
        this.leaves = []; // Array para guardar las hojas en la escena
        this.targetLeaf = null;      // Referencia a la hoja objetivo (o null)
        this.isMoving = false;       // ¿Está en movimiento?
        this.currentWaypoint = 0;    // Índice del waypoint actual
        this.waypoints = [           // Waypoints de patrulla
            new THREE.Vector3(-8, -0.5, 0),
            new THREE.Vector3(8, -0.5, 0),
            new THREE.Vector3(0, -0.5, -8),
            new THREE.Vector3(0, -0.5, 8)
        ];
        this.movementSpeed = 0.02;
        this.leaves = [];
        this.talkSounds = [
            '/sound1.mp3',
            '/sound2.mp3',
            '/sound3.mp3'
        ];
        this.talkSoundIndex = 0;
    }
    
    // Inicialización de la aplicación
    async init() {
        this.setupScene();
        this.setupGround();
        this.setupLights();
        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.loadModel();
        this.setupEventListeners();
        this.setupAutoMovement();
        
        // Inicializar sistema de IA
        const aiLoaded = await this.ai.initialize();
        console.log('IA inicializada:', aiLoaded ? 'Lista' : 'Fallback');
        
        // Iniciar sistema de traducción al español
        this.startTranslationSystem();
        
        this.animate();
    }
    
    // Configuración de la escena Three.js
    setupScene() {
        this.scene = new THREE.Scene();
        // Fondo blanco puro como se solicitó
        this.scene.background = new THREE.Color(0xffffff);
    }
    
    // Configuración del suelo (plano blanco con bordes negros)
    setupGround() {
        // Crear plano principal (blanco)
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xffffff,
            side: THREE.DoubleSide
        });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2; // Rotar para que esté horizontal
        this.ground.position.y = -0.5; // Posicionar debajo del modelo
        this.scene.add(this.ground);
        
        // Crear bordes negros
        const borderGeometry = new THREE.BoxGeometry(20.2, 0.1, 0.2);
        const borderMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        
        // Borde superior
        const topBorder = new THREE.Mesh(borderGeometry, borderMaterial);
        topBorder.position.set(0, -0.45, 10);
        this.scene.add(topBorder);
        
        // Borde inferior
        const bottomBorder = new THREE.Mesh(borderGeometry, borderMaterial);
        bottomBorder.position.set(0, -0.45, -10);
        this.scene.add(bottomBorder);
        
        // Borde izquierdo
        const leftBorderGeometry = new THREE.BoxGeometry(0.2, 0.1, 20.2);
        const leftBorder = new THREE.Mesh(leftBorderGeometry, borderMaterial);
        leftBorder.position.set(-10, -0.45, 0);
        this.scene.add(leftBorder);
        
        // Borde derecho
        const rightBorder = new THREE.Mesh(leftBorderGeometry, borderMaterial);
        rightBorder.position.set(10, -0.45, 0);
        this.scene.add(rightBorder);
    }
    
    // Configuración de las luces
    setupLights() {
        // Luz hemisférica más intensa y clara
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x888888, 0.8);
        hemisphereLight.position.set(0, 20, 0);
        this.scene.add(hemisphereLight);

        // Luz ambiental extra
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Luz direccional principal más fuerte y centrada
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 10, 10);
        directionalLight.target.position.set(0, 0, 0);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        this.scene.add(directionalLight.target);

        // Luz de relleno lateral
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);

        // Luz frontal suave
        const frontLight = new THREE.DirectionalLight(0xffffff, 0.5);
        frontLight.position.set(0, 5, 10);
        this.scene.add(frontLight);

        // Luz puntual azulada (opcional, para efecto)
        const pointLight = new THREE.PointLight(0x4a90e2, 0.3, 10);
        pointLight.position.set(0, 2, 3);
        this.scene.add(pointLight);
    }
    
    // Configuración de la cámara ortográfica en vista isométrica
    setupCamera() {
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        const frustumSize = 20; // Aumenta el tamaño para ver todo el escenario

        this.camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            1000
        );

        // Posición isométrica clásica: X=20, Y=20, Z=20 (puedes ajustar)
        this.camera.position.set(20, 20, 20);
        this.camera.lookAt(0, 0, 0);
    }
    
    // Configuración del renderer
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
    // Configuración de los controles de órbita
    setupControls() {
        // Verificar si OrbitControls está disponible
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.enableZoom = true;
            this.controls.enablePan = false;
            this.controls.autoRotate = false;
        } else {
            console.warn('OrbitControls no disponible, controles de cámara deshabilitados');
            this.controls = null;
        }
    }
    
    // Configuración del movimiento automático
    setupAutoMovement() {
        // Definir waypoints (puntos de destino)
        this.waypoints = [
            new THREE.Vector3(-8, -0.5, 0),
            new THREE.Vector3(8, -0.5, 0),
            new THREE.Vector3(0, -0.5, -8),
            new THREE.Vector3(0, -0.5, 8)
        ];
        
        // Iniciar movimiento automático después de 2 segundos
        setTimeout(() => {
            this.startAutoMovement();
        }, 2000);
    }
    
    // Iniciar movimiento automático
    startAutoMovement() {
        this.movementInterval = setInterval(() => {
            if (!this.isMoving && !this.movementPaused && !this.goingToLeaf && this.model) {
                this.moveToNextWaypoint();
            }
        }, 3000); // Cambiar de posición cada 3 segundos
    }
    
    // Mover al siguiente waypoint
    moveToNextWaypoint() {
        if (this.waypoints.length === 0) return;
        if (this.goingToLeaf) return; // No cambiar destino si va a la hoja
        
        this.isMoving = true;
        this.targetPosition.copy(this.waypoints[this.currentWaypoint]);
        
        // Cambiar a animación de caminar
        this.playAnimation('Run');
        
        console.log(`Moviendo a waypoint ${this.currentWaypoint}:`, this.targetPosition);
    }
    
    // Actualizar movimiento en cada frame
    updateMovement() {
        if (!this.isMoving || !this.model) return;

        // Determinar el destino: hoja o waypoint
        let target;
        if (this.targetLeaf) {
            target = this.targetLeaf.position;
        } else {
            target = this.waypoints[this.currentWaypoint];
        }

        // Solo mover en X y Z
        const currentPos = this.model.position;
        const targetXZ = new THREE.Vector2(target.x, target.z);
        const currentXZ = new THREE.Vector2(currentPos.x, currentPos.z);
        const distance = targetXZ.distanceTo(currentXZ);

        if (distance < 0.1) {
            // Llegó al destino
            this.model.position.x = target.x;
            this.model.position.z = target.z;
            this.model.position.y = -0.5;
            this.isMoving = false;

            if (this.targetLeaf) {
                // Comer la hoja
                this.scene.remove(this.targetLeaf);
                this.leaves = this.leaves.filter(l => l !== this.targetLeaf);
                this.targetLeaf = null;
                this.playSound('/eating.mp3'); // <-- Aquí se reproduce el sonido
                this.playAnimation('Idle');
                setTimeout(() => this.startPatrol(), 1000); // Reanuda patrulla tras comer
            } else {
                // Siguiente waypoint
                this.playAnimation('Idle');
                this.currentWaypoint = (this.currentWaypoint + 1) % this.waypoints.length;
                setTimeout(() => this.moveToNextWaypoint(), 500);
            }
            return;
        }

        // Mover hacia el destino
        const direction = new THREE.Vector3(target.x - currentPos.x, 0, target.z - currentPos.z);
        direction.normalize();
        direction.multiplyScalar(this.movementSpeed);
        currentPos.x += direction.x;
        currentPos.z += direction.z;
        currentPos.y = -0.5;

        // Rotar hacia el destino
        const angle = Math.atan2(direction.x, direction.z);
        this.model.rotation.y = angle + (3 * Math.PI / 2);
    }
    
    // Carga del modelo GLB
    loadModel() {
        // Verificar si GLTFLoader está disponible
        if (typeof THREE.GLTFLoader === 'undefined') {
            console.warn('GLTFLoader no disponible, usando modelo de prueba');
            this.createTestModel();
            return;
        }
        
        const loader = new THREE.GLTFLoader();
        
        // Intentar cargar el modelo desde la carpeta public
        loader.load(
            'alien.glb', // Ruta al modelo
            (gltf) => {
                console.log('Modelo cargado exitosamente:', gltf);
                this.model = gltf.scene;
                this.scene.add(this.model);
                
                // Configurar el mixer de animaciones
                this.mixer = new THREE.AnimationMixer(this.model);
                
                // Procesar las animaciones disponibles
                gltf.animations.forEach((animation) => {
                    console.log('Animación encontrada:', animation.name);
                    this.animations[animation.name] = this.mixer.clipAction(animation);
                });
                
                // Reproducir la animación "Idle" por defecto
                this.playAnimation('Idle');
                
                // Centrar y escalar el modelo
                this.centerModel();
                this.modelReady = true; // Modelo listo para clicks
                
            },
            (progress) => {
                console.log('Progreso de carga:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('Error al cargar el modelo:', error);
                this.showErrorMessage('Error al cargar el modelo 3D. Asegúrate de que el archivo alien.glb esté en la carpeta src/ y tenga las animaciones "Idle" y "Run".');
            }
        );
    }
    
    // Centrar y escalar el modelo
    centerModel() {
        if (!this.model) return;
        
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Centrar el modelo
        this.model.position.sub(center);
        
        // Escalar el modelo para que quepa bien en la escena
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        this.model.scale.setScalar(scale);
        
        // Posicionar el modelo sobre el suelo
        this.model.position.y = -0.5; // Puedes ajustar a -0.7 si aún flota un poco
        
        console.log('Modelo centrado y escalado');
    }
    
    // Reproducir una animación específica
    playAnimation(animationName) {
        if (!this.mixer || !this.animations[animationName]) {
            console.warn(`Animación "${animationName}" no encontrada`);
            return;
        }
        
        // Detener la animación actual si existe
        if (this.currentAnimation) {
            this.currentAnimation.stop();
        }
        
        // Reproducir la nueva animación
        this.currentAnimation = this.animations[animationName];
        this.currentAnimation.reset();
        this.currentAnimation.setLoop(THREE.LoopRepeat, Infinity);
        this.currentAnimation.play();
        
        console.log(`Reproduciendo animación: ${animationName}`);
    }
    
    // Función para hacer correr al personaje
    makeRun() {
        this.playAnimation('Run');
        
        // Volver a la animación Idle después de 3 segundos
        setTimeout(() => {
            this.playAnimation('Idle');
        }, 3000);
    }
    
    // Función para hacer hablar al personaje usando IA local
    async makeTalk() {
        console.log('Botón de hablar clickeado');
        
        // Pausar movimiento durante la conversación
        this.pauseMovement();
        
        // Mostrar indicador de carga
        this.responseText.innerHTML = '<span class="loading"></span> Pensando...';
        this.responsePanel.classList.add('talking');
        
        try {
            console.log('Generando respuesta con IA...');
            const response = await this.ai.generateResponse();
            console.log('Respuesta generada:', response);
            
            this.responseText.textContent = response;
            this.ai.updateMood();

            // Reproducir sonido de hablar sincronizado con el mensaje
            this.playNextTalkSound();
            
        } catch (error) {
            console.error('Error al generar respuesta:', error);
            this.showErrorMessage('¡Ups! Mi cerebro de Ikravux falló. Intenta de nuevo.');
        } finally {
            this.responsePanel.classList.remove('talking');
            
            // Reanudar movimiento después de un breve delay
            setTimeout(() => {
                this.resumeMovement();
            }, 2000); // Esperar 2 segundos después de hablar
        }
    }
    
    // Función para hacer bailar al personaje
    makeDance() {
        console.log('Iniciando baile - pausando movimiento');
        this.pauseMovement();
        this.playAnimation('Dance');
        
        setTimeout(() => {
            console.log('Baile terminado - reanudando movimiento');
            this.playAnimation('Idle');
            this.resumeMovement();
        }, 3000);
    }
    
    // Mostrar mensaje de error
    showErrorMessage(message) {
        this.responseText.textContent = message;
        this.responsePanel.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
        
        // Restaurar el estilo después de 5 segundos
        setTimeout(() => {
            this.responsePanel.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
        }, 5000);
    }
    
    // Configuración de event listeners
    setupEventListeners() {
        // Click en el canvas para detectar clicks en el modelo
        this.canvas.addEventListener('click', (event) => {
            this.onModelClick(event);
        });
        // Soporte para tap en móviles
        this.canvas.addEventListener('touchend', (event) => {
            this.onModelClick(event);
        });
        // Eliminar listeners de botones
        // Redimensionamiento de ventana
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
    }
    
    // Manejo del redimensionamiento de ventana
    onWindowResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        const aspect = width / height;
        const frustumSize = 20;

        this.camera.left = frustumSize * aspect / -2;
        this.camera.right = frustumSize * aspect / 2;
        this.camera.top = frustumSize / 2;
        this.camera.bottom = frustumSize / -2;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    onModelClick(event) {
        if (!this.modelReady) return;

        let clientX, clientY;
        if (event.type.startsWith('touch')) {
            // Soporte para touch
            const touch = event.changedTouches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }

        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const objectsToTest = this.model.children.length ? this.model.children : [this.model];
        const intersects = this.raycaster.intersectObjects(objectsToTest, true);

        if (intersects.length > 0) {
            this.clickCount++;
            if (this.clickTimer) clearTimeout(this.clickTimer);
            this.clickTimer = setTimeout(() => {
                if (this.clickCount === 1) {
                    this.makeTalk();
                } else if (this.clickCount === 2) {
                    this.makeDance();
                }
                this.clickCount = 0;
            }, 300);
        }
    }
    
    // Bucle de animación
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Actualizar el mixer de animaciones
        if (this.mixer) {
            this.mixer.update(0.016); // Aproximadamente 60 FPS
        }
        
        // Actualizar movimiento automático
        this.updateMovement();
        
        // Actualizar controles si están disponibles
        if (this.controls) {
            this.controls.update();
        }
        
        // Renderizar la escena
        this.renderer.render(this.scene, this.camera);
    }
    
    // Cargar modelo alien.glb desde la carpeta src/
    createTestModel() {
        console.log('Intentando cargar modelo alien.glb...');
        
        // Crear un loader GLTF personalizado
        const loader = new THREE.GLTFLoader();
        
        // Cargar el modelo desde la carpeta src/
        loader.load(
            'alien.glb', // Ruta al modelo en src/
            (gltf) => {
                console.log('Modelo alien.glb cargado exitosamente:', gltf);
                
                this.model = gltf.scene;
                this.scene.add(this.model);
                
                // Configurar el mixer de animaciones
                this.mixer = new THREE.AnimationMixer(this.model);
                
                // Procesar las animaciones disponibles
                if (gltf.animations && gltf.animations.length > 0) {
                    gltf.animations.forEach((animation) => {
                        console.log('Animación encontrada:', animation.name);
                        this.animations[animation.name] = this.mixer.clipAction(animation);
                    });
                    
                    // Reproducir la animación "Idle" por defecto
                    this.playAnimation('Idle');
                } else {
                    console.warn('No se encontraron animaciones en el modelo');
                    // Crear animación de fallback
                    this.createFallbackAnimation();
                }
                
                // Centrar y escalar el modelo
                this.centerModel();
                
                console.log('Modelo alien.glb configurado correctamente');
                
            },
            (progress) => {
                console.log('Progreso de carga:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('Error al cargar alien.glb:', error);
                console.log('Creando modelo de fallback...');
                this.createFallbackModel();
            }
        );
    }

    // Crear animación de fallback si no hay animaciones en el modelo
    createFallbackAnimation() {
        // Crear animación simple de rotación
        const rotationTrack = new THREE.VectorKeyframeTrack(
            '.rotation[y]',
            [0, 2],
            [0, Math.PI * 0.1]
        );
        
        const clip = new THREE.AnimationClip('Idle', 2, [rotationTrack]);
        this.animations['Idle'] = this.mixer.clipAction(clip);
        this.animations['Idle'].setLoop(THREE.LoopRepeat, Infinity);
        this.animations['Idle'].play();
        
        this.currentAnimation = this.animations['Idle'];
    }

    // Crear modelo de fallback si no se puede cargar alien.glb
    createFallbackModel() {
        console.log('Creando modelo de fallback...');
        
        // Crear un cubo simple como modelo de fallback
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial({ 
            color: 0x00ff00,
            transparent: true,
            opacity: 0.8
        });
        
        this.model = new THREE.Mesh(geometry, material);
        this.scene.add(this.model);
        
        // Crear animación simple
        this.mixer = new THREE.AnimationMixer(this.model);
        
        const rotationTrack = new THREE.VectorKeyframeTrack(
            '.rotation[y]',
            [0, 2],
            [0, Math.PI * 2]
        );
        
        const clip = new THREE.AnimationClip('Idle', 2, [rotationTrack]);
        this.animations['Idle'] = this.mixer.clipAction(clip);
        this.animations['Idle'].setLoop(THREE.LoopRepeat, Infinity);
        this.animations['Idle'].play();
        
        this.currentAnimation = this.animations['Idle'];
        
        console.log('Modelo de fallback creado');
    }
    
    // Sistema de traducción al español
    startTranslationSystem() {
        console.log('Iniciando sistema de traducción al español...');
        
        // Iniciar el ciclo de traducción
        this.scheduleTranslation();
    }
    
    scheduleTranslation() {
        // Programar la próxima traducción
        this.translationTimer = setTimeout(() => {
            this.activateTranslation();
        }, this.translationInterval);
    }
    
    activateTranslation() {
        console.log('Activando traducción al español...');
        this.translationMode = true;
        
        // Aplicar la fuente normal (traducción)
        this.applyTranslatedFont();
        
        // Programar la desactivación
        setTimeout(() => {
            this.deactivateTranslation();
        }, this.translationDuration);
    }
    
    deactivateTranslation() {
        console.log('Desactivando traducción, volviendo a alienígena...');
        this.translationMode = false;
        
        // Restaurar la fuente alienígena
        this.removeTranslatedFont();
        
        // Programar la próxima traducción
        this.scheduleTranslation();
    }
    
    applyTranslatedFont() {
        const responseText = document.getElementById('response-text');
        if (responseText) {
            responseText.classList.add('translated-text');
            console.log('Traducción al español aplicada');
            console.log('Clases actuales:', responseText.className);
        }
    }
    
    removeTranslatedFont() {
        const responseText = document.getElementById('response-text');
        if (responseText) {
            responseText.classList.remove('translated-text');
            console.log('Volviendo a fuente alienígena');
            console.log('Clases actuales:', responseText.className);
        }
    }

    // Agregar método para pausar movimiento
    pauseMovement() {
        if (!this.movementPaused) {
            this.movementPaused = true;
            this.pauseStartTime = Date.now();
            console.log('Movimiento automático pausado');
        }
    }

    // Agregar método para reanudar movimiento
    resumeMovement() {
        if (this.movementPaused) {
            this.movementPaused = false;
            console.log('Movimiento automático reanudado');
            
            // Si no está moviéndose actualmente, iniciar movimiento después de un breve delay
            if (!this.isMoving) {
                setTimeout(() => {
                    if (!this.movementPaused && !this.isMoving) {
                        this.moveToNextWaypoint();
                    }
                }, 1000); // Esperar 1 segundo antes de reanudar
            }
        }
    }

    // Iniciar patrulla (rutina normal)
    startPatrol() {
        if (this.targetLeaf) return; // Si hay hoja, no patrullar
        this.isMoving = true;
        this.playAnimation('Run');
    }

    // Iniciar movimiento hacia el siguiente waypoint
    moveToNextWaypoint() {
        if (this.targetLeaf) return; // Si hay hoja, no patrullar
        this.isMoving = true;
        this.playAnimation('Run');
    }

    // Ir hacia la hoja
    goToLeaf(leaf) {
        this.targetLeaf = leaf;
        this.isMoving = true;
        this.playAnimation('Run');
    }

    playSound(src) {
        const audio = new Audio(src);
        audio.play();
    }

    playNextTalkSound() {
        const src = this.talkSounds[this.talkSoundIndex];
        const audio = new Audio(src);
        audio.play();
        // Alternar al siguiente sonido para la próxima vez
        this.talkSoundIndex = (this.talkSoundIndex + 1) % this.talkSounds.length;
    }
}

// Renderizar la hoja como icono 3D en la esquina superior derecha
function renderLeafIcon() {
    const leafCanvas = document.getElementById('leaf-canvas');
    if (!leafCanvas) return;

    // Crear escena, cámara y renderer para el icono
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10);
    camera.position.set(0, 0, 2.8);

    const renderer = new THREE.WebGLRenderer({ canvas: leafCanvas, alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0); // Fondo transparente
    renderer.setSize(90, 90);

    // Luz
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 2);
    scene.add(light);

    // Cargar el modelo de la hoja
    const loader = new THREE.GLTFLoader();
    loader.load('leaf.glb', (gltf) => {
        const leaf = gltf.scene;
        leaf.scale.set(1, 1, 1);
        scene.add(leaf);

        // Animar el icono (opcional: rotación)
        function animate() {
            requestAnimationFrame(animate);
            leaf.rotation.y += 0.01;
            renderer.render(scene, camera);
        }   
        animate();
    });
}

let isDraggingLeaf = false;
let dragOffset = { x: 0, y: 0 };
let dragImage = null;

const leafDragContainer = document.getElementById('leaf-drag-container');
const leafCanvas = document.getElementById('leaf-canvas');

leafDragContainer.addEventListener('mousedown', (e) => {
    isDraggingLeaf = true;
    leafDragContainer.classList.add('dragging');
    dragOffset.x = e.clientX - leafDragContainer.offsetLeft;
    dragOffset.y = e.clientY - leafDragContainer.offsetTop;

    // Crear imagen de arrastre visual
    dragImage = leafDragContainer.cloneNode(true);
    dragImage.style.position = 'fixed';
    dragImage.style.pointerEvents = 'none';
    dragImage.style.opacity = '0.7';
    dragImage.style.zIndex = 3000;
    document.body.appendChild(dragImage);
});

document.addEventListener('mousemove', (e) => {
    if (isDraggingLeaf && dragImage) {
        dragImage.style.left = (e.clientX - dragOffset.x) + 'px';
        dragImage.style.top = (e.clientY - dragOffset.y) + 'px';
    }
});

document.addEventListener('mouseup', (e) => {
    if (isDraggingLeaf) {
        isDraggingLeaf = false;
        leafDragContainer.classList.remove('dragging');
        if (dragImage) {
            document.body.removeChild(dragImage);
            dragImage = null;
        }

        // Detectar si se soltó sobre el área del escenario
        const sceneRect = document.getElementById('scene-canvas').getBoundingClientRect();
        if (
            e.clientX >= sceneRect.left &&
            e.clientX <= sceneRect.right &&
            e.clientY >= sceneRect.top &&
            e.clientY <= sceneRect.bottom
        ) {
            // Llama a la función para soltar la hoja en la escena 3D
            dropLeafInScene();
        }
    }
});

function dropLeafInScene() {
    // Limitar a solo una hoja en el tablero
    if (window.amixApp.leaves.length > 0) {
        // Opcional: puedes mostrar un mensaje o animación de que ya hay una hoja
        return;
    }

    const min = -7;
    const max = 7;
    const x = Math.random() * (max - min) + min;
    const z = Math.random() * (max - min) + min;
    const y = -0.5;

    const loader = new THREE.GLTFLoader();
    loader.load('leaf.glb', (gltf) => {
        const leaf = gltf.scene;
        const y = 0;
        leaf.position.set(x, y, z);
        leaf.scale.set(1.5, 1.5, 1.5);

        // Agregar la hoja a la escena y al array de hojas
        window.amixApp.scene.add(leaf);
        window.amixApp.leaves.push(leaf);

        // Hacer que Amix corra hacia la hoja
        window.amixApp.goToLeaf(leaf);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    window.amixApp = new MaxkodiaTamagotchi();
    renderLeafIcon();
}); 