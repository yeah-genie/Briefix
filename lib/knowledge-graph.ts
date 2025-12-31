// ===================================
// AP KNOWLEDGE GRAPH
// College Board 공식 커리큘럼 기반
// ===================================

export interface Topic {
    id: string;
    code: string;
    name: string;
    nameKo?: string;
    parentId?: string;
    importance: 'core' | 'advanced' | 'optional';
    examWeight?: number; // % of AP exam
}

export interface Subject {
    id: string;
    code: string;
    name: string;
    topics: Topic[];
}

// ===================================
// AP CALCULUS AB
// College Board Units 1-8
// ===================================
export const AP_CALCULUS_AB: Subject = {
    id: 'ap-calc-ab',
    code: 'AP_CALC_AB',
    name: 'AP Calculus AB',
    topics: [
        // Unit 1: Limits and Continuity (10-12%)
        { id: 'calc-1', code: 'limits', name: 'Limits and Continuity', importance: 'core', examWeight: 11 },
        { id: 'calc-1-1', code: 'limits.intro', name: 'Introducing Calculus: Can Change Occur at an Instant?', parentId: 'calc-1', importance: 'core' },
        { id: 'calc-1-2', code: 'limits.definition', name: 'Defining Limits and Using Limit Notation', parentId: 'calc-1', importance: 'core' },
        { id: 'calc-1-3', code: 'limits.estimation', name: 'Estimating Limit Values from Graphs', parentId: 'calc-1', importance: 'core' },
        { id: 'calc-1-4', code: 'limits.tables', name: 'Estimating Limit Values from Tables', parentId: 'calc-1', importance: 'core' },
        { id: 'calc-1-5', code: 'limits.properties', name: 'Determining Limits Using Algebraic Properties', parentId: 'calc-1', importance: 'core' },
        { id: 'calc-1-6', code: 'limits.manipulation', name: 'Determining Limits Using Algebraic Manipulation', parentId: 'calc-1', importance: 'core' },
        { id: 'calc-1-7', code: 'limits.squeeze', name: 'Squeeze Theorem', parentId: 'calc-1', importance: 'advanced' },
        { id: 'calc-1-8', code: 'limits.continuity', name: 'Continuity', parentId: 'calc-1', importance: 'core' },
        { id: 'calc-1-9', code: 'limits.ivt', name: 'Intermediate Value Theorem (IVT)', parentId: 'calc-1', importance: 'core' },

        // Unit 2: Differentiation Definition (10-12%)
        { id: 'calc-2', code: 'diff-def', name: 'Differentiation: Definition and Fundamental Properties', importance: 'core', examWeight: 11 },
        { id: 'calc-2-1', code: 'diff.definition', name: 'Defining Average and Instantaneous Rates of Change', parentId: 'calc-2', importance: 'core' },
        { id: 'calc-2-2', code: 'diff.derivative-def', name: 'Defining the Derivative of a Function', parentId: 'calc-2', importance: 'core' },
        { id: 'calc-2-3', code: 'diff.estimating', name: 'Estimating Derivatives of a Function at a Point', parentId: 'calc-2', importance: 'core' },
        { id: 'calc-2-4', code: 'diff.differentiability', name: 'Connecting Differentiability and Continuity', parentId: 'calc-2', importance: 'core' },
        { id: 'calc-2-5', code: 'diff.power-rule', name: 'Power Rule', parentId: 'calc-2', importance: 'core' },
        { id: 'calc-2-6', code: 'diff.sum-difference', name: 'Derivative Rules: Sum, Difference, Constant Multiple', parentId: 'calc-2', importance: 'core' },
        { id: 'calc-2-7', code: 'diff.trig', name: 'Derivatives of Trigonometric Functions', parentId: 'calc-2', importance: 'core' },
        { id: 'calc-2-8', code: 'diff.exp-log', name: 'Derivatives of eˣ and ln(x)', parentId: 'calc-2', importance: 'core' },

        // Unit 3: Differentiation Composite, Implicit, Inverse (9-13%)
        { id: 'calc-3', code: 'diff-advanced', name: 'Differentiation: Composite, Implicit, and Inverse Functions', importance: 'core', examWeight: 11 },
        { id: 'calc-3-1', code: 'diff.chain-rule', name: 'Chain Rule', parentId: 'calc-3', importance: 'core' },
        { id: 'calc-3-2', code: 'diff.implicit', name: 'Implicit Differentiation', parentId: 'calc-3', importance: 'core' },
        { id: 'calc-3-3', code: 'diff.inverse', name: 'Differentiating Inverse Functions', parentId: 'calc-3', importance: 'advanced' },
        { id: 'calc-3-4', code: 'diff.inverse-trig', name: 'Differentiating Inverse Trigonometric Functions', parentId: 'calc-3', importance: 'advanced' },
        { id: 'calc-3-5', code: 'diff.higher-order', name: 'Higher-Order Derivatives', parentId: 'calc-3', importance: 'core' },

        // Unit 4: Contextual Applications of Differentiation (10-15%)
        { id: 'calc-4', code: 'diff-context', name: 'Contextual Applications of Differentiation', importance: 'core', examWeight: 12 },
        { id: 'calc-4-1', code: 'app.motion', name: 'Interpreting Motion (Position, Velocity, Acceleration)', parentId: 'calc-4', importance: 'core' },
        { id: 'calc-4-2', code: 'app.related-rates', name: 'Related Rates', parentId: 'calc-4', importance: 'core' },
        { id: 'calc-4-3', code: 'app.linearization', name: 'Linearization and Tangent Line Approximation', parentId: 'calc-4', importance: 'advanced' },
        { id: 'calc-4-4', code: 'app.lhopital', name: "L'Hôpital's Rule", parentId: 'calc-4', importance: 'advanced' },

        // Unit 5: Analytical Applications of Differentiation (15-18%)
        { id: 'calc-5', code: 'diff-analytical', name: 'Analytical Applications of Differentiation', importance: 'core', examWeight: 17 },
        { id: 'calc-5-1', code: 'analysis.mvt', name: 'Mean Value Theorem', parentId: 'calc-5', importance: 'core' },
        { id: 'calc-5-2', code: 'analysis.evt', name: 'Extreme Value Theorem', parentId: 'calc-5', importance: 'core' },
        { id: 'calc-5-3', code: 'analysis.critical-points', name: 'Determining Intervals of Increase/Decrease', parentId: 'calc-5', importance: 'core' },
        { id: 'calc-5-4', code: 'analysis.first-derivative', name: 'First Derivative Test', parentId: 'calc-5', importance: 'core' },
        { id: 'calc-5-5', code: 'analysis.concavity', name: 'Determining Concavity', parentId: 'calc-5', importance: 'core' },
        { id: 'calc-5-6', code: 'analysis.second-derivative', name: 'Second Derivative Test', parentId: 'calc-5', importance: 'core' },
        { id: 'calc-5-7', code: 'analysis.curve-sketching', name: 'Sketching Graphs of Functions', parentId: 'calc-5', importance: 'core' },
        { id: 'calc-5-8', code: 'analysis.optimization', name: 'Optimization Problems', parentId: 'calc-5', importance: 'core' },

        // Unit 6: Integration and Accumulation of Change (17-20%)
        { id: 'calc-6', code: 'integration', name: 'Integration and Accumulation of Change', importance: 'core', examWeight: 18 },
        { id: 'calc-6-1', code: 'int.riemann', name: 'Riemann Sums', parentId: 'calc-6', importance: 'core' },
        { id: 'calc-6-2', code: 'int.definite', name: 'Definite Integrals', parentId: 'calc-6', importance: 'core' },
        { id: 'calc-6-3', code: 'int.ftc', name: 'Fundamental Theorem of Calculus', parentId: 'calc-6', importance: 'core' },
        { id: 'calc-6-4', code: 'int.antiderivatives', name: 'Finding Antiderivatives', parentId: 'calc-6', importance: 'core' },
        { id: 'calc-6-5', code: 'int.properties', name: 'Properties of Definite Integrals', parentId: 'calc-6', importance: 'core' },
        { id: 'calc-6-6', code: 'int.u-substitution', name: 'u-Substitution', parentId: 'calc-6', importance: 'core' },

        // Unit 7: Differential Equations (6-12%)
        { id: 'calc-7', code: 'diff-eq', name: 'Differential Equations', importance: 'core', examWeight: 9 },
        { id: 'calc-7-1', code: 'de.intro', name: 'Modeling with Differential Equations', parentId: 'calc-7', importance: 'core' },
        { id: 'calc-7-2', code: 'de.slope-fields', name: 'Slope Fields', parentId: 'calc-7', importance: 'core' },
        { id: 'calc-7-3', code: 'de.separation', name: 'Separation of Variables', parentId: 'calc-7', importance: 'core' },
        { id: 'calc-7-4', code: 'de.exponential', name: 'Exponential Models (Growth/Decay)', parentId: 'calc-7', importance: 'core' },

        // Unit 8: Applications of Integration (10-15%)
        { id: 'calc-8', code: 'int-apps', name: 'Applications of Integration', importance: 'core', examWeight: 11 },
        { id: 'calc-8-1', code: 'intapp.average', name: 'Average Value of a Function', parentId: 'calc-8', importance: 'core' },
        { id: 'calc-8-2', code: 'intapp.area', name: 'Finding Area Between Curves', parentId: 'calc-8', importance: 'core' },
        { id: 'calc-8-3', code: 'intapp.volume-disk', name: 'Volume: Disk Method', parentId: 'calc-8', importance: 'core' },
        { id: 'calc-8-4', code: 'intapp.volume-washer', name: 'Volume: Washer Method', parentId: 'calc-8', importance: 'core' },
        { id: 'calc-8-5', code: 'intapp.cross-sections', name: 'Volume: Cross-Sectional Area', parentId: 'calc-8', importance: 'advanced' },
    ],
};

// ===================================
// AP PHYSICS 1
// College Board Units 1-8 (2024-2025)
// ===================================
export const AP_PHYSICS_1: Subject = {
    id: 'ap-physics-1',
    code: 'AP_PHYSICS_1',
    name: 'AP Physics 1',
    topics: [
        // Unit 1: Kinematics (12-18%)
        { id: 'phys-1', code: 'kinematics', name: 'Kinematics', importance: 'core', examWeight: 15 },
        { id: 'phys-1-1', code: 'kin.scalars-vectors', name: 'Scalars and Vectors', parentId: 'phys-1', importance: 'core' },
        { id: 'phys-1-2', code: 'kin.displacement', name: 'Displacement, Velocity, and Acceleration', parentId: 'phys-1', importance: 'core' },
        { id: 'phys-1-3', code: 'kin.motion-1d', name: 'Motion in One Dimension', parentId: 'phys-1', importance: 'core' },
        { id: 'phys-1-4', code: 'kin.motion-2d', name: 'Motion in Two Dimensions (Projectile)', parentId: 'phys-1', importance: 'core' },
        { id: 'phys-1-5', code: 'kin.reference-frames', name: 'Reference Frames and Relative Motion', parentId: 'phys-1', importance: 'advanced' },

        // Unit 2: Force and Translational Dynamics (16-20%)
        { id: 'phys-2', code: 'dynamics', name: 'Force and Translational Dynamics', importance: 'core', examWeight: 18 },
        { id: 'phys-2-1', code: 'dyn.systems', name: 'Systems and Center of Mass', parentId: 'phys-2', importance: 'core' },
        { id: 'phys-2-2', code: 'dyn.free-body', name: 'Forces and Free-Body Diagrams', parentId: 'phys-2', importance: 'core' },
        { id: 'phys-2-3', code: 'dyn.newton-first', name: "Newton's First Law", parentId: 'phys-2', importance: 'core' },
        { id: 'phys-2-4', code: 'dyn.newton-second', name: "Newton's Second Law", parentId: 'phys-2', importance: 'core' },
        { id: 'phys-2-5', code: 'dyn.newton-third', name: "Newton's Third Law", parentId: 'phys-2', importance: 'core' },
        { id: 'phys-2-6', code: 'dyn.gravity', name: 'Gravitational Force', parentId: 'phys-2', importance: 'core' },
        { id: 'phys-2-7', code: 'dyn.friction', name: 'Friction (Kinetic and Static)', parentId: 'phys-2', importance: 'core' },
        { id: 'phys-2-8', code: 'dyn.spring', name: 'Spring Forces', parentId: 'phys-2', importance: 'core' },

        // Unit 3: Work, Energy, and Power (12-18%)
        { id: 'phys-3', code: 'energy', name: 'Work, Energy, and Power', importance: 'core', examWeight: 15 },
        { id: 'phys-3-1', code: 'energy.work', name: 'Work Done by a Force', parentId: 'phys-3', importance: 'core' },
        { id: 'phys-3-2', code: 'energy.kinetic', name: 'Kinetic Energy', parentId: 'phys-3', importance: 'core' },
        { id: 'phys-3-3', code: 'energy.potential', name: 'Potential Energy (Gravitational, Spring)', parentId: 'phys-3', importance: 'core' },
        { id: 'phys-3-4', code: 'energy.conservation', name: 'Conservation of Mechanical Energy', parentId: 'phys-3', importance: 'core' },
        { id: 'phys-3-5', code: 'energy.power', name: 'Power', parentId: 'phys-3', importance: 'core' },

        // Unit 4: Linear Momentum (10-16%)
        { id: 'phys-4', code: 'momentum', name: 'Linear Momentum', importance: 'core', examWeight: 13 },
        { id: 'phys-4-1', code: 'mom.definition', name: 'Momentum and Impulse', parentId: 'phys-4', importance: 'core' },
        { id: 'phys-4-2', code: 'mom.conservation', name: 'Conservation of Momentum', parentId: 'phys-4', importance: 'core' },
        { id: 'phys-4-3', code: 'mom.collisions', name: 'Collisions (Elastic and Inelastic)', parentId: 'phys-4', importance: 'core' },

        // Unit 5: Torque and Rotational Dynamics (10-16%)
        { id: 'phys-5', code: 'rotation', name: 'Torque and Rotational Dynamics', importance: 'core', examWeight: 13 },
        { id: 'phys-5-1', code: 'rot.kinematics', name: 'Rotational Kinematics', parentId: 'phys-5', importance: 'core' },
        { id: 'phys-5-2', code: 'rot.linear-connection', name: 'Connecting Linear and Rotational Motion', parentId: 'phys-5', importance: 'core' },
        { id: 'phys-5-3', code: 'rot.torque', name: 'Torque', parentId: 'phys-5', importance: 'core' },
        { id: 'phys-5-4', code: 'rot.inertia', name: 'Rotational Inertia', parentId: 'phys-5', importance: 'core' },
        { id: 'phys-5-5', code: 'rot.equilibrium', name: 'Rotational Equilibrium', parentId: 'phys-5', importance: 'core' },

        // Unit 6: Energy and Momentum of Rotating Systems (6-10%)
        { id: 'phys-6', code: 'rot-energy', name: 'Energy and Momentum of Rotating Systems', importance: 'core', examWeight: 8 },
        { id: 'phys-6-1', code: 'roten.kinetic', name: 'Rotational Kinetic Energy', parentId: 'phys-6', importance: 'core' },
        { id: 'phys-6-2', code: 'roten.angular-momentum', name: 'Angular Momentum and Impulse', parentId: 'phys-6', importance: 'core' },
        { id: 'phys-6-3', code: 'roten.conservation', name: 'Conservation of Angular Momentum', parentId: 'phys-6', importance: 'core' },

        // Unit 7: Oscillations (6-10%)
        { id: 'phys-7', code: 'oscillations', name: 'Oscillations', importance: 'core', examWeight: 8 },
        { id: 'phys-7-1', code: 'osc.shm', name: 'Simple Harmonic Motion', parentId: 'phys-7', importance: 'core' },
        { id: 'phys-7-2', code: 'osc.pendulum', name: 'Pendulum Motion', parentId: 'phys-7', importance: 'core' },
        { id: 'phys-7-3', code: 'osc.spring-mass', name: 'Spring-Mass Systems', parentId: 'phys-7', importance: 'core' },

        // Unit 8: Fluids (New for 2024-2025, 6-10%)
        { id: 'phys-8', code: 'fluids', name: 'Fluids', importance: 'core', examWeight: 10 },
        { id: 'phys-8-1', code: 'fluid.pressure', name: 'Pressure and Density', parentId: 'phys-8', importance: 'core' },
        { id: 'phys-8-2', code: 'fluid.buoyancy', name: 'Buoyancy and Archimedes Principle', parentId: 'phys-8', importance: 'core' },
        { id: 'phys-8-3', code: 'fluid.continuity', name: 'Fluid Dynamics and Continuity', parentId: 'phys-8', importance: 'core' },
        { id: 'phys-8-4', code: 'fluid.bernoulli', name: "Bernoulli's Equation", parentId: 'phys-8', importance: 'advanced' },
    ],
};

// ===================================
// ALL AP SUBJECTS
// ===================================
export const AP_SUBJECTS: Subject[] = [
    AP_CALCULUS_AB,
    AP_PHYSICS_1,
];

// Helper: Get all topics as flat array
export function getAllTopics(subject: Subject): Topic[] {
    return subject.topics;
}

// Helper: Get parent topics only (units)
export function getUnits(subject: Subject): Topic[] {
    return subject.topics.filter(t => !t.parentId);
}

// Helper: Get child topics
export function getTopicsByUnit(subject: Subject, unitId: string): Topic[] {
    return subject.topics.filter(t => t.parentId === unitId);
}

// Helper: Find topic by code
export function findTopicByCode(subject: Subject, code: string): Topic | undefined {
    return subject.topics.find(t => t.code === code);
}
