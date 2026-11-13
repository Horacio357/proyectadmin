# TurnoSmart Enterprise - AppWeb de Gestión Horaria Inteligente
> Plataforma inteligente de diagramación de turnos, descansos, optimización de dotaciones y validación legal para transporte automotor de pasajeros y logística (Tucumán, Argentina).

---

## 🚀 Características Principales

### 1. 👥 Autenticación y Perfiles con Identidad Visual
- **Super Administrador (Gerente de Operaciones / Jefatura de Tráfico)**: Control total sobre la matriz, dotación, parámetros de IA, auditoría legal y aprobación de solicitudes.
- **Personal Operativo**:
  - 🟦 **Choferes**: Línea urbana e interurbana (Código azul/sky `#0284c7`).
  - 🟧 **Mecánicos**: Taller de mantenimiento y fosas (Código ámbar `#d97706`).
  - 🟩 **Inspectores**: Control de frecuencia y boletos (Código esmeralda `#16a34a`).
- **Simulador de Perfil en 1 Clic**: Selector superior para alternar instantáneamente entre la Gerencia y cualquier chofer o mecánico.
- **Validación y Habilitación de Legajos**: Estados `APROBADO`, `PENDIENTE` y `DENEGADO` (con registro formal del motivo de rechazo por falta de apto o carnet).

### 2. 📊 Matriz Interactiva de Turnos (Doble Vista: Desktop & Mobile)
- **Doble Vista Adaptativa**:
  - **Grilla Excel (Desktop / Laptop)**: 35 columnas (personal, días 1 a 31, francos, horas y semáforo individual). Atajos de teclado inmediatos (`M`, `T`, `N`, `F`, `V`, `L`) y popover flotante al hacer clic. Rendimiento memoizado a 60 FPS con `React.memo`.
  - **Agenda Diaria Táctil (Móvil / Tablet)**: Vista táctil día por día activada por defecto en celulares y tablets para supervisión en cabecera y paradas.
- **Diagramación Flexible Multimes**: Navegador continuo mes a mes (`< Octubre 2026 >`, `< Noviembre 2026 >`, etc.) con persistencia independiente para planificar meses por adelantado o reeditar pasados.
- **Filtros Dinámicos**: Filtro por puesto (Todos, Choferes, Mecánicos, Inspectores) mediante carrusel horizontal táctil y buscador por nombre o legajo.
- **Plantillas en Bloque**: Esquema rotativo 6x1 (1 franco cada 6 días trabajados con rotación escalonada), asignación según preferencia de puesto o blanqueo a francos.
- **Fila Inferior de Dotación Diaria**: Conteo en vivo de personal asignado por turno para garantizar la cobertura del servicio.

### 3. 🚦 Semáforo de Validación Legal en Tiempo Real
- **Descanso Interjornada (LCT Art. 197)**:
  - Alerta de infracción si el descanso entre turnos consecutivos es menor a 12 horas (ej. turno Tarde a Mañana con 8 hs o Noche a Mañana con 0 hs).
- **Límite de Días Consecutivos (LCT Art. 204 y Ley 11.544)**:
  - Advertencia a los 6 días trabajados seguidos e infracción grave si supera los 6 días continuos sin descanso.
- **Control de Francos Mensuales Obligatorios (CCT 460/73 UTA)**:
  - Exige 6 francos en meses de 30 días y 7 francos en meses de 31 días.
- **Descanso Semanal Continuo de 48 Horas**:
  - Auditoría del descanso continuo efectivo durante los francos.
- **Ahorro Estimado en Multas**:
  - Estimación financiera en vivo de multas evitadas ante inspecciones laborales ($280.000 ARS por acta no subsanada).

### 4. 🤖 Asistente IA Integrado (Gemini 2.5 Flash + Solver Heurístico)
- Botón **"Optimizar con IA"** en la barra superior y en el menú móvil.
- Analiza las restricciones legales, la dotación mínima requerida por puesto y las preferencias individuales de turno.
- **Modo Dual Autónomo**:
  - Utiliza el SDK oficial `@google/genai` con **Gemini 2.5 Flash** si se configura una API Key.
  - Incluye un **Motor Heurístico de Restricciones (Fallback Solver)** que funciona 100% offline sin necesidad de configurar claves.
- Emite un **informe ejecutivo explicativo** en lenguaje natural y permite aplicar el nuevo diagrama mensual en un solo clic.

### 5. 📱 Portal del Empleado & Módulo de Permuta 1 a 1 entre Choferes
- Dashboard personalizado donde el chofer o mecánico visualiza su **calendario mensual** con sus turnos, francos y horas.
- **Módulo de Permuta Pactada 1 a 1**:
  - Permite a un chofer seleccionar a un compañero de su mismo puesto para proponer un canje directo.
  - Previsualización recíproca en tiempo real (*"Tú pasarás a Mañana y tu compañero cubrirá tu Franco"*).
  - Al ser aprobada por Gerencia, el sistema ejecuta un **intercambio atómico simultáneo en la matriz**, garantizando que ninguna unidad quede vacante.

### 6. 🖨️ Salidas Formales: Excel e Impresión Reglamentaria
- **Exportación a Excel (.xlsx)**: Descarga diferida (Code-Splitting ultra liviano) lista para liquidación o envío gremial.
- **Impresión Física Homologada (A4 Apaisado)**: Formato para carteleras de cabecera y talleres mecánicos con encabezado institucional de la empresa de transporte y **3 casilleros oficiales de firma**:
  1. *Jefe de Tráfico / Programación (Elaboró)*
  2. *Gerencia de Operaciones (Homologó)*
  3. *Comisión Interna / Delegado UTA (Conformidad Gremial)*

### 7. ☀️🌙 Modo Día y Modo Noche
- Selector segmentado permanente `[ ☀️ Día | 🌙 Noche ]` en la barra superior y tarjeta táctil en el menú móvil.
- Paleta clara corporativa de alto contraste para oficinas soleadas y paleta oscura profunda para talleres y cabinas de noche.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Canvas Confetti.
- **Lógica de Datos & Exportación**: SheetJS (XLSX).
- **Motor de IA**: Google Gemini SDK (`@google/genai`).
- **Persistencia**: LocalStorage y arquitectura modular desacoplada lista para conectar a PostgreSQL / Supabase / SQLite.

---

## 📦 Puesta en Marcha Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build
```

El servidor iniciará en `http://localhost:5173/` (o en la IP local de tu red para celulares).

---

## 🧪 Pruebas Automatizadas

Para verificar la lógica de negocio y las leyes laborales:
```bash
npx tsx test-verification.ts
```
Todas las pruebas unitarias validan francos obligatorios, pausas de 12 horas, descansos continuos, auditoría y resolución con IA.
