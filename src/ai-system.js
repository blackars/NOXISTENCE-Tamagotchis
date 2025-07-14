// Sistema de IA Local con TensorFlow.js
class AmixAI {
    constructor() {
        this.model = null;
        this.tokenizer = null;
        this.isLoaded = false;
        this.alienLore = {
            name: "Amix",
            species: "Ikravux",
            homeworld: "Maxkodia",
            personality: {
                traits: ["curioso", "amigable", "un poco torpe", "extrañado con el vacio blanco donde esta atrapado"],
                mood: "contento",
                energy: 85
            },
            knowledge: {
                earth: "No conoce nuestro universo, solo a The Creator que lo escondio en algun rincon de NOXISTENCE",
                technology: "no usa tecnologia, es una criatura hervibora sin manos que vive en manadas",
                emotions: "Se siente aterrado del vacio que lo rodea pero muy agradecido de salvarse de la inexistencia"
            }
        };
        
        // Vocabulario simplificado para el modelo
        this.vocabulary = [
            // Palabras básicas
            "hola", "soy", "me", "siento", "estoy", "muy", "bien", "gracias", "por", "que", "como", "donde", "cuando", "porque",
            // Palabras del LORE
            "Amix", "Ikravux", "Maxkodia", "Creator", "NOXISTENCE", "manada", "vacío", "blanco", "infinito", "vivo", "muerte",
            "planeta", "universo", "especie", "herbívoro", "tecnología", "gratitud", "felicidad", "vida", "muerte", "existencia",
            // Emociones
            "contento", "confundido", "emocionado", "asustado", "agradecido", "curioso", "fascinado", "extrañado", "solo",
            // Verbos
            "explorar", "vivir", "comer", "pensar", "sentir", "ver", "oír", "tocar", "oler", "gustar", "querer", "necesitar",
            // Adjetivos
            "grande", "pequeño", "extraño", "normal", "diferente", "igual", "nuevo", "viejo", "bueno", "malo", "hermoso", "feo",
            // Conectores
            "y", "o", "pero", "porque", "cuando", "donde", "como", "que", "si", "no", "también", "además", "sin embargo"
        ];
        
        // Frases base para generar variaciones
        this.basePhrases = [
            "Me siento {mood} en este {place}",
            "Soy {name} de {homeworld}",
            "En {homeworld} {action}",
            "Este {place} es {adjective}",
            "Me gusta {action} aquí",
            "No entiendo {concept}",
            "Gracias por {action}",
            "Quiero {action} más",
            "Mi {relation} me dijo {wisdom}",
            "Aquí no hay {thing}",
            "En {homeworld} hay {thing}",
            "Me siento {emotion} porque {reason}",
            "The Creator {action}",
            "NOXISTENCE es {adjective}",
            "Mi manada {action}"
        ];
        
        this.placeholders = {
            mood: ["contento", "confundido", "emocionado", "asustado", "agradecido", "curioso", "fascinado", "extrañado"],
            place: ["vacío blanco", "infinito", "NOXISTENCE", "este lugar", "aquí", "este universo"],
            name: ["Amix"],
            homeworld: ["Maxkodia"],
            action: ["vivir", "explorar", "pensar", "sentir", "ver", "oír", "comer", "dormir", "jugar", "aprender"],
            adjective: ["extraño", "hermoso", "grande", "pequeño", "diferente", "nuevo", "misterioso", "increíble"],
            concept: ["este lugar", "el vacío", "la tecnología", "los colores", "el tiempo", "el espacio"],
            relation: ["manada", "familia", "amigos", "ancianos", "padres"],
            wisdom: ["la vida es un regalo", "cada lugar enseña algo", "la gratitud es importante", "estar vivo es especial"],
            thing: ["plantas", "colores", "sonidos", "olores", "texturas", "formas"],
            emotion: ["feliz", "triste", "asustado", "sorprendido", "agradecido", "confundido"],
            reason: ["estoy vivo", "puedo explorar", "no estoy solo", "hay cosas nuevas", "The Creator me salvó"]
        };
    }
    
    // Inicializar el sistema de IA
    async initialize() {
        try {
            console.log('Inicializando sistema de IA...');
            
            // Usar la configuración global de TensorFlow.js
            if (window.tfConfig && typeof tf !== 'undefined') {
                try {
                    // Inicializar TensorFlow.js solo una vez
                    await window.tfConfig.init();
                    
                    // Verificar que funciona sin crear modelos de prueba
                    if (window.tfConfig.initialized) {
                        console.log('TensorFlow.js funcionando correctamente');
                        this.isLoaded = true;
                    } else {
                        console.warn('TensorFlow.js no se pudo inicializar, usando fallback');
                        this.isLoaded = false;
                    }
                } catch (tfError) {
                    console.warn('TensorFlow.js no disponible, usando fallback:', tfError);
                    this.isLoaded = false;
                }
            } else {
                console.warn('TensorFlow.js no disponible, usando fallback');
                this.isLoaded = false;
            }
            
            console.log('Sistema de IA inicializado. TensorFlow:', this.isLoaded);
            return this.isLoaded;
            
        } catch (error) {
            console.error('Error al inicializar IA:', error);
            this.isLoaded = false;
            return false;
        }
    }
    

    
    // Generar respuesta usando IA local
    async generateResponse() {
        console.log('Generando respuesta...');
        
        if (!this.isLoaded) {
            console.log('Usando respuesta de fallback');
            return this.generateFallbackResponse();
        }
        
        try {
            // Usar el sistema de generación de texto avanzado
            const response = this.generateAdvancedResponse();
            const processedResponse = this.postProcessResponse(response);
            console.log('Respuesta generada:', processedResponse);
            return processedResponse;
        } catch (error) {
            console.warn('Error en generación de IA, usando fallback:', error);
            return this.generateFallbackResponse();
        }
    }
    
    // Generar respuesta avanzada usando plantillas dinámicas
    generateAdvancedResponse() {
        // Seleccionar una frase base aleatoria
        const basePhrase = this.basePhrases[Math.floor(Math.random() * this.basePhrases.length)];
        
        // Reemplazar placeholders con valores aleatorios
        let response = basePhrase;
        
        // Reemplazar cada placeholder
        Object.keys(this.placeholders).forEach(placeholder => {
            const values = this.placeholders[placeholder];
            const randomValue = values[Math.floor(Math.random() * values.length)];
            response = response.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), randomValue);
        });
        
        // Agregar variaciones adicionales
        response = this.addVariations(response);
        
        return response;
    }
    
    // Agregar variaciones al texto
    addVariations(text) {
        const variations = [
            // Agregar expresiones emocionales
            () => text + ". Es increíble!",
            () => text + ". Me siento muy agradecido.",
            () => text + ". Es muy diferente a mi planeta.",
            () => text + ". The Creator debe tener un plan.",
            () => text + ". Mi manada estaría sorprendida.",
            // Agregar conectores
            () => text + ". Aunque a veces me da miedo.",
            () => text + ". Pero estoy aprendiendo.",
            () => text + ". Sin embargo, me siento agradecido.",
            // Agregar preguntas
            () => text + " ¿Tú también sientes eso?",
            () => text + " ¿Cómo funciona tu universo?",
            () => text + " ¿Los humanos entienden esto?",
            () => text + " ¿Por qué estoy aquí?",
            // Agregar reflexiones
            () => text + " La vida es un regalo precioso.",
            () => text + " Cada lugar enseña algo nuevo.",
            () => text + " La gratitud es importante.",
            () => text + " Estar vivo es especial."
        ];
        
        // Aplicar 1-2 variaciones aleatorias
        const numVariations = Math.random() < 0.1 ? 0.5 : 1;
        for (let i = 0; i < numVariations; i++) {
            const variation = variations[Math.floor(Math.random() * variations.length)];
            text = variation();
        }
        
        return text;
    }
    

    
    // Generar respuesta de fallback (sistema anterior)
    generateFallbackResponse() {
        const responseTypes = ['feelings', 'questions', 'observations', 'wisdom', 'excitement', 'confusion', 'greetings'];
        const selectedType = responseTypes[Math.floor(Math.random() * responseTypes.length)];
        
        const responses = {
            feelings: [
                "Me siento muy contento explorando este infinito. Es extraño!",
                "Estoy un poco confundido con este lugar, pero me encanta estar vivo.",
                "Estoy lleno de energía! Aunque este vacío me da miedo.",
                "Me siento agradecido de estar aquí, aunque extraño mi manada en Maxkodia."
            ],
            questions: [
                "¿Qué te gusta hacer en tu tiempo libre?",
                "¿Cómo funciona este lugar donde estoy atrapado?",
                "¿Los humanos siempre viven en lugares con colores?",
                "¿Por qué The Creator me puso aquí?",
                "¿Tu universo tambien es infinito vacio?"
            ],
            observations: [
                "Uau! Este vacío blanco es tan diferente a Maxkodia.",
                "He notado que no hay plantas aquí para comer, pero ya nunca tengo hambre. Es extraño!",
                "En Maxkodia vivimos en manadas, aquí estoy solo.",
                "¿Sabías que en Maxkodia tenemos tres lunas? Es increíble!"
            ],
            confusion: [
                "Hmm... no entiendo completamente este lugar, pero me suena interesante.",
                "Oh! Esto es nuevo para mí. ¿Puedes explicarlo?",
                "Mi cerebro de Ikravux a veces no entiende las cosas complejas.",
                "Qué curioso! En mi planeta no tenemos nada parecido."
            ],
            excitement: [
                "Esto es increíble! Quiero aprender más sobre este lugar!",
                "Uau! Nunca había visto algo así en Maxkodia!",
                "Es fascinante! The Creator debe tener un plan para mí.",
                "Me encanta estar vivo, aunque esté en este vacío!"
            ],
            wisdom: [
                "En Maxkodia decimos: 'La gratitud es el primer paso hacia la felicidad'.",
                "En mi manada siempre se decía: 'Cada lugar tiene algo único que enseñar'.",
                "Los ancianos de mi especie creen que la vida es un regalo precioso.",
                "He aprendido que estar vivo es más importante que entender todo."
            ],
            greetings: [
                "Saludos! Soy Amix de Maxkodia. ¿Cómo estás?",
                "Hola! Es un placer comunicarme contigo desde este vacío blanco.",
                "Saludos desde NOXISTENCE! ¿Qué tal va tu día?"
            ]
        };
        
        const selectedResponses = responses[selectedType];
        return selectedResponses[Math.floor(Math.random() * selectedResponses.length)];
    }
    
    // Post-procesar respuesta generada
    postProcessResponse(text) {
        // Limpiar y formatear el texto
        let cleaned = text.trim();
        
        // Asegurar que empiece con mayúscula
        cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
        
        // Agregar signos de puntuación si no los tiene
        if (!cleaned.endsWith('.') && !cleaned.endsWith('!') && !cleaned.endsWith('?')) {
            cleaned += '.';
        }
        
        // Reemplazar variables del LORE
        cleaned = cleaned
            .replace(/\{name\}/g, this.alienLore.name)
            .replace(/\{species\}/g, this.alienLore.species)
            .replace(/\{homeworld\}/g, this.alienLore.homeworld);
        
        return cleaned;
    }
    
    // Actualizar estado de ánimo
    updateMood() {
        const moods = ['contento', 'confundido', 'emocionado', 'asustado', 'agradecido', 'curioso', 'fascinado', 'extrañado'];
        
        if (Math.random() < 0.3) {
            this.alienLore.personality.mood = moods[Math.floor(Math.random() * moods.length)];
            
            // Ajustar energía
            if (this.alienLore.personality.mood === 'emocionado') {
                this.alienLore.personality.energy = Math.min(100, this.alienLore.personality.energy + 10);
            } else if (this.alienLore.personality.mood === 'asustado') {
                this.alienLore.personality.energy = Math.max(50, this.alienLore.personality.energy - 5);
            }
        }
        
        console.log(`${this.alienLore.name} está ${this.alienLore.personality.mood} (Energía: ${this.alienLore.personality.energy})`);
    }
}

// Exportar para uso global
window.AmixAI = AmixAI;
console.log('Sistema de IA cargado y disponible como window.AmixAI'); 