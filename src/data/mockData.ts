export const revenueData = [
  { month: 'Mar', revenue: 3200, expenses: 820 },
  { month: 'Abr', revenue: 4100, expenses: 950 },
  { month: 'May', revenue: 3800, expenses: 1100 },
  { month: 'Jun', revenue: 5200, expenses: 1250 },
  { month: 'Jul', revenue: 4750, expenses: 900 },
  { month: 'Ago', revenue: 4250, expenses: 1050 },
];

export const projects = [
  {
    id: 1,
    name: 'Rediseño Web Cliente XYZ',
    client: 'Cliente XYZ',
    status: 'active' as const,
    progress: 65,
    startDate: '2026-06-01',
    endDate: '2026-09-30',
    budget: 8500,
    hoursLogged: 124,
    color: '#2EC4B6',
    description: 'Rediseño completo del sitio corporativo con enfoque en conversión y experiencia de usuario.',
    team: ['JP', 'MG', 'AR'],
  },
  {
    id: 2,
    name: 'App Móvil E-commerce',
    client: 'RetailCo S.A.',
    status: 'active' as const,
    progress: 30,
    startDate: '2026-07-15',
    endDate: '2026-12-01',
    budget: 12000,
    hoursLogged: 68,
    color: '#FF6B35',
    description: 'Aplicación nativa iOS/Android para plataforma de comercio electrónico.',
    team: ['JP', 'CL'],
  },
  {
    id: 3,
    name: 'Consultoría SEO',
    client: 'MárkTech',
    status: 'active' as const,
    progress: 80,
    startDate: '2026-05-01',
    endDate: '2026-09-01',
    budget: 3500,
    hoursLogged: 96,
    color: '#6366F1',
    description: 'Estrategia y ejecución de posicionamiento SEO para mercado hispanohablante.',
    team: ['MG'],
  },
  {
    id: 4,
    name: 'Dashboard Analytics',
    client: 'DataVision',
    status: 'active' as const,
    progress: 45,
    startDate: '2026-07-01',
    endDate: '2026-10-30',
    budget: 6000,
    hoursLogged: 52,
    color: '#8B5CF6',
    description: 'Panel de control con visualizaciones avanzadas de datos de negocio.',
    team: ['JP', 'MG', 'CL'],
  },
  {
    id: 5,
    name: 'Branding Corporativo',
    client: 'StartupXL',
    status: 'paused' as const,
    progress: 20,
    startDate: '2026-08-01',
    endDate: '2026-11-15',
    budget: 4200,
    hoursLogged: 18,
    color: '#F59E0B',
    description: 'Identidad visual corporativa, manual de marca y sistema de diseño.',
    team: ['AR'],
  },
  {
    id: 6,
    name: 'API REST Microservices',
    client: 'TechFlow Inc.',
    status: 'active' as const,
    progress: 90,
    startDate: '2026-05-15',
    endDate: '2026-09-15',
    budget: 9800,
    hoursLogged: 186,
    color: '#10B981',
    description: 'Arquitectura de microservicios con Node.js y contenedores Docker.',
    team: ['CL', 'JP'],
  },
];

export type Task = {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  assigneeColor: string;
  dueDate: string;
  project: string;
};

export type Column = 'todo' | 'doing' | 'done';

export type KanbanState = { todo: Task[]; doing: Task[]; done: Task[] };

export const kanbanTasksInitial: KanbanState = {
  todo: [
    { id: 't1', title: 'Diseñar wireframes de onboarding', priority: 'high', assignee: 'MG', assigneeColor: '#2EC4B6', dueDate: '2026-09-05', project: 'Rediseño Web Cliente XYZ' },
    { id: 't2', title: 'Configurar entorno de staging', priority: 'medium', assignee: 'CL', assigneeColor: '#6366F1', dueDate: '2026-09-10', project: 'API REST Microservices' },
    { id: 't3', title: 'Investigación de competidores', priority: 'low', assignee: 'JP', assigneeColor: '#FF6B35', dueDate: '2026-09-15', project: 'Branding Corporativo' },
    { id: 't4', title: 'Revisión de paleta de colores', priority: 'medium', assignee: 'AR', assigneeColor: '#F59E0B', dueDate: '2026-09-08', project: 'Rediseño Web Cliente XYZ' },
  ],
  doing: [
    { id: 't5', title: 'Desarrollo de componentes UI', priority: 'high', assignee: 'JP', assigneeColor: '#FF6B35', dueDate: '2026-09-03', project: 'Dashboard Analytics' },
    { id: 't6', title: 'Integración API de pagos', priority: 'high', assignee: 'CL', assigneeColor: '#6366F1', dueDate: '2026-09-02', project: 'App Móvil E-commerce' },
    { id: 't7', title: 'Optimización de consultas DB', priority: 'medium', assignee: 'MG', assigneeColor: '#2EC4B6', dueDate: '2026-09-07', project: 'API REST Microservices' },
  ],
  done: [
    { id: 't8', title: 'Análisis de requerimientos', priority: 'high', assignee: 'JP', assigneeColor: '#FF6B35', dueDate: '2026-08-20', project: 'Rediseño Web Cliente XYZ' },
    { id: 't9', title: 'Setup del repositorio Git', priority: 'low', assignee: 'CL', assigneeColor: '#6366F1', dueDate: '2026-08-15', project: 'API REST Microservices' },
    { id: 't10', title: 'Brief de diseño aprobado', priority: 'medium', assignee: 'AR', assigneeColor: '#F59E0B', dueDate: '2026-08-25', project: 'Branding Corporativo' },
    { id: 't11', title: 'Investigación de palabras clave', priority: 'medium', assignee: 'MG', assigneeColor: '#2EC4B6', dueDate: '2026-08-22', project: 'Consultoría SEO' },
  ],
};

export const teamMembers = [
  { id: 1, name: 'Juan Pérez', initials: 'JP', color: '#FF6B35', role: 'Admin', email: 'juan@taskflow.io', projects: 6, hours: 186, status: 'active' as const },
  { id: 2, name: 'María García', initials: 'MG', color: '#2EC4B6', role: 'Miembro', email: 'maria@taskflow.io', projects: 4, hours: 124, status: 'active' as const },
  { id: 3, name: 'Carlos López', initials: 'CL', color: '#6366F1', role: 'Miembro', email: 'carlos@taskflow.io', projects: 3, hours: 98, status: 'active' as const },
  { id: 4, name: 'Ana Rodríguez', initials: 'AR', color: '#F59E0B', role: 'Invitada', email: 'ana@gmail.com', projects: 2, hours: 32, status: 'active' as const },
  { id: 5, name: 'Pedro Martínez', initials: 'PM', color: '#8B5CF6', role: 'Miembro', email: 'pedro@taskflow.io', projects: 2, hours: 67, status: 'inactive' as const },
  { id: 6, name: 'Laura Sánchez', initials: 'LS', color: '#10B981', role: 'Miembro', email: 'laura@taskflow.io', projects: 3, hours: 89, status: 'active' as const },
  { id: 7, name: 'Roberto Díaz', initials: 'RD', color: '#EC4899', role: 'Invitado', email: 'roberto@client.com', projects: 1, hours: 12, status: 'active' as const },
  { id: 8, name: 'Sofía Torres', initials: 'ST', color: '#14B8A6', role: 'Miembro', email: 'sofia@taskflow.io', projects: 4, hours: 145, status: 'inactive' as const },
];

export const invoices = [
  { id: 'INV-2026-001', client: 'Cliente XYZ', project: 'Rediseño Web Cliente XYZ', date: '2026-08-01', amount: 4250, status: 'paid' as const },
  { id: 'INV-2026-002', client: 'RetailCo S.A.', project: 'App Móvil E-commerce', date: '2026-08-05', amount: 3600, status: 'pending' as const },
  { id: 'INV-2026-003', client: 'MárkTech', project: 'Consultoría SEO', date: '2026-07-28', amount: 1750, status: 'paid' as const },
  { id: 'INV-2026-004', client: 'DataVision', project: 'Dashboard Analytics', date: '2026-08-10', amount: 2800, status: 'pending' as const },
  { id: 'INV-2026-005', client: 'TechFlow Inc.', project: 'API REST Microservices', date: '2026-07-15', amount: 5400, status: 'paid' as const },
  { id: 'INV-2026-006', client: 'StartupXL', project: 'Branding Corporativo', date: '2026-07-01', amount: 840, status: 'overdue' as const },
];

export const projectRevenueData = [
  { name: 'Web XYZ', value: 8500, color: '#2EC4B6' },
  { name: 'App E-com', value: 12000, color: '#FF6B35' },
  { name: 'SEO', value: 3500, color: '#6366F1' },
  { name: 'Analytics', value: 6000, color: '#8B5CF6' },
  { name: 'Branding', value: 4200, color: '#F59E0B' },
  { name: 'API REST', value: 9800, color: '#10B981' },
];

export const hoursVsRevenue = [
  { project: 'Web XYZ', hours: 124, revenue: 4250 },
  { project: 'App', hours: 68, revenue: 3600 },
  { project: 'SEO', hours: 96, revenue: 1750 },
  { project: 'Analytics', hours: 52, revenue: 2800 },
  { project: 'Branding', hours: 18, revenue: 840 },
  { project: 'API', hours: 186, revenue: 5400 },
];

export const recentActivity = [
  { id: 1, action: 'Completaste la tarea "Análisis de requerimientos"', time: 'hace 2 horas', icon: 'check' },
  { id: 2, action: 'Factura INV-2026-005 marcada como pagada', time: 'hace 4 horas', icon: 'invoice' },
  { id: 3, action: 'María García se unió al Dashboard Analytics', time: 'hace 6 horas', icon: 'user' },
  { id: 4, action: 'Registraste 3.5h en API REST Microservices', time: 'ayer, 18:30', icon: 'time' },
  { id: 5, action: 'Nuevo comentario en "Wireframes de onboarding"', time: 'ayer, 15:00', icon: 'comment' },
];

export const projectTasks = [
  { id: 1, title: 'Análisis de requerimientos', done: true, priority: 'high' as const, assignee: 'JP', assigneeColor: '#FF6B35', dueDate: '2026-08-20' },
  { id: 2, title: 'Diseño de wireframes principales', done: true, priority: 'high' as const, assignee: 'MG', assigneeColor: '#2EC4B6', dueDate: '2026-08-28' },
  { id: 3, title: 'Desarrollo de componentes UI', done: false, priority: 'high' as const, assignee: 'JP', assigneeColor: '#FF6B35', dueDate: '2026-09-03' },
  { id: 4, title: 'Revisión de paleta de colores', done: false, priority: 'medium' as const, assignee: 'AR', assigneeColor: '#F59E0B', dueDate: '2026-09-08' },
  { id: 5, title: 'Diseñar wireframes de onboarding', done: false, priority: 'medium' as const, assignee: 'MG', assigneeColor: '#2EC4B6', dueDate: '2026-09-05' },
  { id: 6, title: 'Pruebas de usabilidad con usuarios', done: false, priority: 'low' as const, assignee: 'CL', assigneeColor: '#6366F1', dueDate: '2026-09-20' },
  { id: 7, title: 'Integración con backend existente', done: false, priority: 'high' as const, assignee: 'CL', assigneeColor: '#6366F1', dueDate: '2026-09-15' },
  { id: 8, title: 'Despliegue en producción', done: false, priority: 'medium' as const, assignee: 'JP', assigneeColor: '#FF6B35', dueDate: '2026-09-30' },
];

export const timeEntries = [
  { id: 1, member: 'Juan Pérez', initials: 'JP', color: '#FF6B35', date: '2026-08-30', hours: 6.5, task: 'Desarrollo de componentes UI', billable: true },
  { id: 2, member: 'María García', initials: 'MG', color: '#2EC4B6', date: '2026-08-30', hours: 4.0, task: 'Diseño de wireframes', billable: true },
  { id: 3, member: 'Carlos López', initials: 'CL', color: '#6366F1', date: '2026-08-29', hours: 3.5, task: 'Revisión técnica del servidor', billable: false },
  { id: 4, member: 'Juan Pérez', initials: 'JP', color: '#FF6B35', date: '2026-08-29', hours: 7.0, task: 'Revisión de diseño con cliente', billable: true },
  { id: 5, member: 'Ana Rodríguez', initials: 'AR', color: '#F59E0B', date: '2026-08-28', hours: 2.0, task: 'Feedback de identidad visual', billable: true },
  { id: 6, member: 'María García', initials: 'MG', color: '#2EC4B6', date: '2026-08-28', hours: 5.5, task: 'Prototipado interactivo', billable: true },
];

export const projectFiles = [
  { id: 1, name: 'Brief_Proyecto_XYZ.pdf', size: '2.4 MB', type: 'pdf', uploadedBy: 'JP', date: '2026-06-02' },
  { id: 2, name: 'Wireframes_v2.fig', size: '18.7 MB', type: 'figma', uploadedBy: 'MG', date: '2026-08-15' },
  { id: 3, name: 'Propuesta_Comercial.docx', size: '1.1 MB', type: 'doc', uploadedBy: 'JP', date: '2026-06-01' },
  { id: 4, name: 'Assets_Marca.zip', size: '45.2 MB', type: 'zip', uploadedBy: 'AR', date: '2026-08-20' },
  { id: 5, name: 'Contrato_Firmado.pdf', size: '0.8 MB', type: 'pdf', uploadedBy: 'JP', date: '2026-06-01' },
  { id: 6, name: 'Paleta_Colores.png', size: '0.3 MB', type: 'image', uploadedBy: 'MG', date: '2026-08-10' },
];

export const milestones = [
  { id: 1, label: 'Kickoff y brief aprobado', done: true, date: '2026-06-05' },
  { id: 2, label: 'Wireframes aprobados', done: true, date: '2026-07-01' },
  { id: 3, label: 'Diseño visual aprobado', done: false, date: '2026-08-15' },
  { id: 4, label: 'Desarrollo frontend completado', done: false, date: '2026-09-10' },
  { id: 5, label: 'QA y ajustes finales', done: false, date: '2026-09-22' },
  { id: 6, label: 'Entrega y despliegue', done: false, date: '2026-09-30' },
];
