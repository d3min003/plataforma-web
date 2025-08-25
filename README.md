# 💻 PROYECTO 3: PLATAFORMA WEB (CRM/PORTAL)

![estado](https://img.shields.io/badge/estado-EN%20DESARROLLO-blue)
![node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![next](https://img.shields.io/badge/Next.js-13%2B-black)
![typescript](https://img.shields.io/badge/TypeScript-5%2B-3178C6)
[![vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://plataforma-web-gules.vercel.app/)

## Producción (Vercel)
- URL: https://plataforma-web-gules.vercel.app/
- Estado actual: EN LÍNEA ✅

Rutas actuales:
- Páginas: `/`, `/dashboard`, `/leads`, `/properties`, `/404`
- APIs: `/api/health`, `/api/leads` (GET/POST), `/api/properties` (GET/POST)

Checklist rápido en Vercel para resolver 404 en Next.js (Pages Router):
- Root Directory: carpeta raíz del repo (no un subdirectorio)
- Framework Preset: Next.js
- Build Command: `npm run build` (por defecto)
- Output: `.next` (por defecto, no usar `out` salvo `next export`)
- package.json: debe existir con scripts `dev`, `build`, `start`
- Página de inicio: `pages/index.tsx` presente (ya existe en este repo)
- Logs de deploy: revisar “Build Logs” para errores de instalación/build

## Tabla de contenidos
- [Resumen del proyecto (CRM Web)](#resumen-del-proyecto-crm-web)
- [Cómo ejecutar (local)](#cómo-ejecutar-local)
- [Módulos principales detallados](#módulos-principales-detallados)
- [Arquitectura técnica detallada](#arquitectura-técnica-detallada)
- [Integración ecosistema](#integración-ecosistema)
- [Experiencia de usuario](#user-experience-optimizada)
- [Seguridad y autenticación](#seguridad-y-autenticación)
- [Performance y escalabilidad](#performance-y-escalabilidad)
- [Testing y calidad](#testing-y-calidad)
- [Analytics y reporting](#analytics-y-reporting)
- [Entregables específicos](#entregables-específicos)
- [Pipeline de desarrollo](#pipeline-desarrollo)
- [Stack tecnológico completo](#stack-tecnológico-completo)
- [Monitoreo y operaciones](#monitoreo-y-operaciones)
- [Reglas de negocio y compliance](#reglas-business-y-compliance)
- [SLA y expectativas](#sla-y-expectativas)

## Resumen ejecutivo
Plataforma web CRM para el ecosistema inmobiliario con enfoque en rendimiento, movilidad y analítica avanzada.
- Interfaz única para leads, clientes y propiedades.
- Actualizaciones en tiempo real (WebSocket) y soporte offline (PWA).
- Analytics con KPIs, embudos, pronósticos y reportes personalizables.
- Integraciones clave: Base Centralizada, Asesor Digital IA, Google/Microsoft, S3/CDN.
- Seguridad enterprise: MFA, RBAC granular, auditoría, cifrado en tránsito y reposo.
- Escalabilidad horizontal, monitoreo end-to-end y CI/CD con Vercel.

## Estado del proyecto
- Código fuente: base Next.js + TypeScript con MUI integrada (Leads, Propiedades, Dashboard y 404 personalizada).
- Despliegue Vercel: EN LÍNEA ✅ y verificado (ver sección Producción para checklist).

### Estado de implementación (UX/UI y Backend)
- UX/UI implementado: tema MUI con modo claro/oscuro, Layout con AppBar y navegación, páginas Inicio, Dashboard, Leads y Propiedades, 404 personalizada.
- UX/UI planificado: Drawer responsive, validación con React Hook Form + Yup, gráficos en Dashboard (Recharts/Victory), accesibilidad AA.
- Backend implementado: API Routes de Next.js con almacenamiento en memoria para leads y propiedades, endpoint de healthcheck.
- Backend planificado: autenticación (Auth0/NextAuth), base de datos (PostgreSQL), integración con Base Centralizada, almacenamiento de archivos (S3/CDN), colas y monitoreo.

## Siguientes pasos sugeridos
1) Añadir Drawer responsive y páginas de autenticación.
2) Conectar APIs reales (Base Centralizada) y estados con RTK Query.
3) Incorporar tests (unit e integración) y pipeline CI.
4) Agregar Dashboard con charts (Recharts/Victory) y KPIs reales.

## Cómo ejecutar (local)
Requisitos:
- Node.js 18 o superior
- npm, pnpm o yarn

Pasos (PowerShell en Windows):

```powershell
# 1) Instalar dependencias (usar uno)
npm install
# pnpm install
# yarn install

# 2) Ejecutar en modo desarrollo
npm run dev

# 3) Compilar para producción
npm run build

# 4) Iniciar en producción (requiere build previo)
npm run start
```

> Nota: Este repositorio ya incluye `package.json` y scripts estándar (dev, build, start).

## Resumen del proyecto (CRM Web)

**CONTEXTO:**
Desarrolla una plataforma web CRM integral que sirva como interfaz principal del ecosistema inmobiliario, integrándose seamlessly con Base Centralizada y Asesor Digital IA.

**CAPACIDAD OPERATIVA:**
- 50-100 usuarios concurrentes (asesores + gerentes + admin)
- Performance: <3s page load time, >95% uptime mensual
- Responsive design: Mobile-first approach + PWA capabilities
- Offline support: Core functionality disponible sin internet
- Real-time updates: WebSocket connections para sincronización instantánea

## MÓDULOS PRINCIPALES DETALLADOS:

### 1. DASHBOARD ANALYTICS AVANZADO:

**KPI Cards Real-time:**
- **Leads mensuales:** Total, nuevos hoy, conversión rate trending
- **Revenue:** MTD, YTD, forecast vs actual, growth rate
- **Propiedades:** Activas, vendidas mes, inventory turnover
- **Performance:** Top asesores, team rankings, individual metrics

**Gráficos Interactivos:**
- **Embudo ventas:** Lead → Prospect → Cliente → Cierre (drill-down capability)
- **Performance asesores:** Rankings individuales, metas vs actual
- **Trends mercado:** Precios zona, demanda tipos propiedad, seasonality
- **Heat maps geográficos:** Concentración leads, precios promedio zona
- **Time series:** Revenue mensual, leads generados, cierres

**Forecasting ML:**
- Predicciones ventas próximos 3-6 meses basado históricos
- Seasonal adjustments automáticos
- Confidence intervals + scenario planning
- Alert system para desvíos significativos vs forecast

**Custom Reports Builder:**
- Drag-and-drop interface para crear reportes personalizados
- Filtros múltiples: fecha, asesor, zona, tipo propiedad, rango precio
- Export options: PDF, Excel, CSV con scheduling automático
- Saved searches + report templates compartibles

### 2. GESTIÓN LEADS Y CLIENTES:

**Lead Capture Integration:**
- Forms integrados Asesor Digital con validation real-time
- Landing pages dinámicas por campaña marketing
- Lead import masivo desde Excel/CSV con data validation
- Deduplication automática + merge conflicts resolution

**Customer Journey Timeline:**
- Timeline completo interacciones: calls, emails, citas, visitas propiedades
- Activity tracking automático + manual entry
- Document attachments: contratos, identificaciones, comprobantes ingresos
- Communication history: Email threads, WhatsApp conversations, SMS records

**Segmentación Inteligente:**
- **Filtros avanzados:** presupuesto, zona, tipo, fuente, estado, asesor asignado
- **Saved searches** con alerts automáticos nuevos matches
- **Tags dinámicos:** Hot lead, Investor, First-time buyer, Corporate
- **Behavioral segmentation:** engagement level, response rate, visit frequency

**Communication Hub:**
- **Email templates** personalizables con merge fields dinámicos
- **SMS automation:** Welcome sequences, appointment reminders, follow-ups
- **Call logging:** Duration, notes, outcomes, next action items
- **WhatsApp integration:** Conversations threads desde Asesor Digital

**Task Management:**
- Follow-up automático basado en reglas business
- Calendario integrado: Appointments, deadlines, reminders
- Assignment logic: Round-robin, zone-based, expertise-based
- Escalation workflows: Manager notification overdue tasks

### 3. GESTIÓN PROPIEDADES:

**Property Listing Management:**
- Upload múltiple fotos con compression automática + image optimization
- Virtual tours integration: 360° photos, video walkthroughs
- Document management: Legal papers, permits, certificates
- Batch operations: Bulk price updates, status changes, assignments

**Multimedia Optimization:**
- Auto-resize images múltiples formatos (thumbnail, medium, full)
- WebP format conversion para performance
- CDN integration para fast loading global
- Watermark automático fotos con branding agency

**Map Integration Avanzada:**
- Google Maps embedding con clustering inteligente
- Filtros geográficos: Draw polygons, radius search, zone selection
- Points of interest: Schools, hospitals, malls, transport
- Traffic patterns + commute time calculations
- Street view integration + satellite imagery

**Price Analytics Intelligence:**
- Comparativas automáticas propiedades similares zona
- Price suggestion ML basado en características + market trends
- Historical price tracking + appreciation rates
- Market analysis reports automáticos por zona
- Competition monitoring + pricing strategy recommendations

**Marketing Tools Integrados:**
- Flyer generation automático con templates personalizables
- Social media posts automáticos: Facebook, Instagram, LinkedIn
- Email campaigns: Property showcases, market updates, newsletters
- QR codes generation para propiedades + tracking scans
- Print marketing materials: Brochures, business cards, signage

**Status Pipeline Management:**
- **Kanban boards:** Available → Under negotiation → Reserved → Sold
- Automated status transitions basado en actions
- Time tracking en cada stage + bottleneck identification
- Commission calculations automáticas + payout tracking
- Contract management: Templates, e-signatures, document storage

### 4. PORTAL ASESORES:

**Performance Dashboard Individual:**
- **Métricas personales:** Leads assigned, conversion rates, revenue generated
- **Goals tracking:** Monthly/quarterly targets, progress indicators
- **Rankings:** Position vs peers, historical performance trends
- **Commission tracker:** Earned, pending, paid with detailed breakdowns
- **Activity summary:** Calls made, appointments set, properties shown

**Mobile Apps Nativas:**
- **iOS/Android apps** para trabajo campo
- **Offline capability:** Property info, client details, forms
- **Photo upload:** Direct from phone con GPS tagging automático
- **Push notifications:** New leads, appointment reminders, urgent updates
- **Voice-to-text:** Quick note taking durante client meetings

**Commission Calculator Transparente:**
- Real-time calculations basado en deals pipeline
- Different commission structures: Percentage, tiered, bonuses
- Tax calculations + withholdings automáticos
- Payment projections: Expected dates, amounts
- Historical earnings: YTD, previous years comparisons

**Calendar Management:**
- Google/Outlook two-way sync
- Availability management: Working hours, vacation days, blocked time
- Appointment scheduling: Client meetings, property showings
- Team calendar: View colleagues availability, schedule team meetings
- Automated reminders: Email + SMS notifications pre-appointments

**Training Center:**
- **Onboarding modules:** Company policies, system training, sales techniques
- **Product updates:** New features announcements + training videos
- **Best practices:** Top performer strategies, market insights
- **Certification tracking:** Required courses, completion status
- **Resource library:** Scripts, objection handling, legal documents

## ARQUITECTURA TÉCNICA DETALLADA:

### Frontend Stack Moderno:
- **Framework:** React 18 + TypeScript para type safety
- **Meta-framework:** Next.js 13 con Pages Router (src/pages) para SSR + performance
- **State Management:** Redux Toolkit + RTK Query para server state
- **UI Framework:** Material-UI v7 con tema customizado + design system
- **Forms:** React Hook Form + Yup schema validation
- **Charts/Visualization:** Recharts + Victory + D3.js para analytics complejos
- **Maps:** Google Maps JavaScript API + custom clustering
- **Testing:** Jest + React Testing Library + Cypress E2E

### Backend Architecture:
- **API Gateway:** Kong/AWS API Gateway para centralized routing
- **Microservices:** FastAPI services especializados por dominio
- **Real-time:** WebSockets (Socket.io) para live updates
- **File Storage:** AWS S3 + CloudFront CDN para multimedia
- **Search Engine:** Elasticsearch para búsquedas complejas propiedades
- **Queue System:** Redis + Celery para background tasks
- **Email Service:** SendGrid API para transactional emails

### Database Strategy:
- **Primary:** PostgreSQL para data consistency + ACID compliance
- **Cache:** Redis cluster para session management + frequent queries
- **Search:** Elasticsearch cluster para complex property searches
- **Analytics:** ClickHouse para time-series analytics data
- **File Metadata:** MongoDB para multimedia metadata + tags

## INTEGRACIÓN ECOSISTEMA:

### Base Centralizada Integration:
- REST API consumption con retry logic + circuit breakers
- Real-time sync: WebSocket connections para updates instantáneos
- Caching strategy: Redis para frequent queries con TTL inteligente
- Data validation: Client-side + server-side consistency checks
- Offline support: Service workers + IndexedDB para offline operations

### Asesor Digital IA Integration:
- **Chat widget embebido:** Seamless handoff humano ↔ IA
- **Lead notifications:** Real-time alerts nuevos leads + hot prospects
- **Conversation insights:** Analytics conversaciones exitosas + patterns
- **Training data feedback:** User actions → IA improvement loop
- **Escalation management:** Smooth transition IA → human agent

### External Integrations:
- **Google Workspace:** Calendar sync, Drive storage, Gmail integration
- **Microsoft 365:** Outlook calendar, OneDrive, Teams meetings
- **Social Media APIs:** Facebook, Instagram, LinkedIn para marketing automation
- **Payment Gateways:** Stripe, PayPal para commission payments + client deposits
- **Document E-signature:** DocuSign, HelloSign para contratos digitales
- **Marketing Automation:** Mailchimp, HubSpot para email campaigns
- **Accounting Software:** QuickBooks, Xero para financial reporting

## USER EXPERIENCE OPTIMIZADA:

### Responsive Design Excellence:
- **Mobile-First:** Diseño optimizado smartphones/tablets priority
- **Progressive Web App:** Installable, push notifications, offline functionality
- **Accessibility:** WCAG 2.1 AA compliance, screen reader optimization
- **Performance:** <3s load time, lazy loading, code splitting automático
- **Cross-browser:** Chrome, Safari, Firefox, Edge compatibility

### Navigation Intuitiva:
- **Role-based menus:** Different navigation per user type
- **Breadcrumb navigation:** Clear path indication + quick navigation
- **Quick actions:** Floating action buttons para tareas frecuentes
- **Search functionality:** Global search across all entities
- **Favorites/Bookmarks:** Save frequent searches + quick access

### Data Visualization:
- **Interactive charts:** Hover details, click-to-drill-down
- **Export capabilities:** Charts as images, data as CSV/Excel
- **Real-time updates:** Live data streaming sin page refresh
- **Customizable dashboards:** Drag-and-drop widgets personalization
- **Color-coded indicators:** Status colors, performance metrics

## SEGURIDAD Y AUTENTICACIÓN:

### Multi-Factor Authentication:
- **Primary:** Email/SMS verification codes
- **Secondary:** Authenticator apps (Google, Authy, Microsoft)
- **Backup:** Recovery codes para account lockout situations
- **Biometric:** Fingerprint/FaceID para mobile apps
- **Enterprise:** SAML/OIDC integration para corporate environments

### Role-Based Access Control:
- **Granular permissions:** Module-level + feature-level restrictions
- **Dynamic roles:** Permissions based on hierarchy + territory
- **Permission inheritance:** Manager → Asesor role cascading
- **Audit trail:** Log completo permission changes + access attempts
- **Session management:** Concurrent session limits + automatic logout

### Data Security:
- **Encryption:** AES-256 at-rest, TLS 1.3 in-transit
- **API Security:** JWT tokens + API key authentication
- **Input validation:** XSS prevention, SQL injection protection
- **Rate limiting:** Per-user + per-endpoint request limits
- **CORS configuration:** Strict origin policies + preflight checks

### Session Management:
- **JWT tokens:** 24h expiry con refresh token automático
- **Remember me:** Extended sessions con security checkpoints
- **Device tracking:** Login notifications + suspicious activity alerts
- **Auto-logout:** Inactividad timeout + graceful warning notifications
- **Multi-device:** Concurrent sessions across devices permitidas

## PERFORMANCE Y ESCALABILIDAD:

### Frontend Optimization:
- **Code Splitting:** Dynamic imports per route + feature
- **Bundle Analysis:** Tree shaking + dependency optimization
- **Image Optimization:** WebP format, responsive images, lazy loading
- **Caching Strategy:** Browser cache + service worker + CDN
- **Resource Hints:** Preload, prefetch para critical resources

### Backend Scalability:
- **Horizontal Scaling:** Auto-scaling groups basado CPU/memory metrics
- **Load Balancing:** Application Load Balancer + health checks
- **Database Optimization:** Query optimization + connection pooling
- **Caching Layers:** Redis cluster + application-level caching
- **CDN Integration:** Static assets + API responses caching

### Monitoring Performance:
- **Real User Monitoring:** Core Web Vitals tracking
- **Synthetic Monitoring:** Automated performance testing
- **APM Integration:** New Relic/DataDog para backend performance
- **Error Tracking:** Sentry para JavaScript errors + stack traces
- **Business Metrics:** Conversion funnels + user journey analytics

## TESTING Y CALIDAD:

### Testing Strategy Comprehensive:
- **Unit Tests:** >85% coverage componentes críticos + business logic
- **Integration Tests:** API endpoints + database operations
- **E2E Tests:** Critical user journeys + regression prevention
- **Performance Tests:** Load testing 100+ concurrent users
- **Security Tests:** OWASP Top 10 + penetration testing quarterly
- **Accessibility Tests:** axe-core integration + manual testing

### Quality Assurance Process:
- **Code Review:** Mandatory PR reviews + automated linting (ESLint, Prettier)
- **Staging Environment:** Production replica para comprehensive testing
- **User Acceptance Testing:** Real users testing pre-launch features
- **Beta Testing:** Gradual rollout features con feedback collection
- **Monitoring:** Real user monitoring + automated error detection

### CI/CD Pipeline:
- **Source Control:** Git workflow con feature branches + PR process
- **Build Process:** Automated builds + dependency scanning
- **Testing Automation:** Unit + integration tests pre-deployment
- **Deployment:** Blue-green deployment zero downtime
- **Rollback:** Automated rollback capability si issues detectados

## ANALYTICS Y REPORTING:

### Business Intelligence:
- **Revenue Analytics:** Monthly/quarterly/yearly trends + forecasting
- **Lead Analytics:** Source attribution, conversion funnels, cost per lead
- **Property Analytics:** Time on market, price trends, inventory turnover
- **Asesor Analytics:** Individual performance, team comparisons, productivity metrics
- **Customer Analytics:** Lifetime value, satisfaction scores, retention rates

### Custom Reporting:
- **Report Builder:** Drag-and-drop interface para custom reports
- **Scheduled Reports:** Automated delivery via email + dashboard
- **Export Options:** PDF, Excel, CSV con formatting preservation
- **Data Visualization:** Charts, graphs, pivot tables + interactive elements
- **Sharing:** Report sharing con permission controls + collaboration

### Real-time Analytics:
- **Live Dashboards:** Real-time KPIs + performance indicators
- **Alert System:** Automated notifications threshold breaches
- **Trend Analysis:** Pattern recognition + anomaly detection
- **Predictive Analytics:** ML-powered forecasting + recommendations
- **Mobile Analytics:** App usage, feature adoption, user engagement

## ENTREGABLES ESPECÍFICOS:
1. Portal web completo responsive con todos módulos funcionales
2. Mobile apps nativas (iOS + Android) con offline capabilities
3. Dashboard analytics tiempo real con ML insights operativos
4. Sistema automation workflows completo + email sequences
5. Integration marketplace para third-party tools + APIs
6. Testing suite completo (unit, integration, E2E, performance)
7. Documentation técnica completa + user guides + video tutorials
8. Training materials + onboarding sequences para diferentes roles
9. Security audit + penetration testing results + remediation
10. Performance optimization + monitoring setup completo

## PIPELINE DESARROLLO:

### MVP (Meses 1-3):
- Dashboard básico con métricas core + real-time updates
- CRUD completo: leads, propiedades, asesores con validation
- Integración API Base Centralizada + sync real-time
- Authentication system + roles básicos + security implementation
- Mobile responsive design + PWA functionality
- Basic reporting + export capabilities

### Fase 2 (Meses 4-5):
- Analytics avanzado: ML insights + predictive forecasting
- Mobile apps nativas: iOS/Android con offline support
- Automation workflows: Email sequences + task assignments
- Advanced search: Elasticsearch integration + complex filters
- Real-time notifications: WebSocket implementation + push notifications
- Performance optimization + caching strategies

### Fase 3 (Meses 6-7):
- AI-powered recommendations: Properties para clients + cross-selling
- Advanced reporting: Custom builder + scheduled delivery
- Voice search/commands: Speech recognition + natural language
- Integration marketplace: Third-party connectors + API ecosystem
- Multi-tenant architecture: Franchise/agency separation
- Advanced analytics: Behavioral tracking + conversion optimization

## STACK TECNOLÓGICO COMPLETO:

### Frontend Complete Stack:
- **Core:** React 18 + TypeScript + Next.js 13 (Pages Router)
- **State:** Redux Toolkit + RTK Query + React Query para server state
- **UI:** Material-UI v7 + Emotion + Framer Motion para animations
- **Forms:** React Hook Form + Yup validation + conditional logic
- **Charts:** Recharts + Victory + D3.js + Chart.js para different needs
- **Maps:** Google Maps API + Mapbox + clustering algorithms
- **PWA:** Service Worker + Web App Manifest + push notifications
- **Testing:** Jest + React Testing Library + Cypress + Playwright

### Backend Complete Stack:
- **API:** FastAPI + Node.js Express hybrid architecture
- **Database:** PostgreSQL primary + Redis cache + Elasticsearch search
- **Queue:** Celery + RabbitMQ para background processing
- **Storage:** AWS S3 + CloudFront + image optimization
- **Auth:** Auth0 + JWT + OAuth2 + SAML integration
- **Monitoring:** DataDog + CloudWatch + Sentry + Prometheus
- **Documentation:** OpenAPI + Swagger + automated generation

### Infrastructure Stack:
- **Hosting:** AWS ECS + Fargate + Application Load Balancer
- **CDN:** CloudFront global distribution + edge locations
- **Database:** RDS PostgreSQL Multi-AZ + Read Replicas
- **Cache:** ElastiCache Redis cluster + automatic failover
- **Security:** WAF + Shield + VPC + Security Groups
- **Monitoring:** CloudWatch + DataDog + PagerDuty alerting
- **CI/CD:** GitHub Actions + Docker + automated testing
- **SSL:** ACM certificates + automatic renewal

## MONITOREO Y OPERACIONES:

### Application Monitoring:
- **Uptime Monitoring:** Pingdom + StatusCake para availability 24/7
- **Performance:** New Relic + DataDog para application performance
- **Error Tracking:** Sentry para runtime errors + stack traces
- **User Analytics:** Google Analytics + Mixpanel para user behavior
- **Business Metrics:** Custom dashboards conversion + revenue metrics

### Operational Excellence:
- **Health Checks:** Automated endpoint testing + service dependency checks
- **Backup Strategy:** Daily database backups + point-in-time recovery capability
- **Disaster Recovery:** Multi-region deployment + automated failover procedures
- **Documentation:** Comprehensive technical docs + troubleshooting runbooks
- **Support Procedures:** L1-L2-L3 escalation + SLA definitions

### Security Monitoring:
- **Vulnerability Scanning:** Automated OWASP + dependency scanning
- **Intrusion Detection:** AWS GuardDuty + CloudTrail monitoring
- **Access Monitoring:** Failed login attempts + suspicious activity detection
- **Compliance:** SOC 2 + GDPR + local privacy regulations compliance
- **Incident Response:** Automated alerting + escalation procedures

## REGLAS BUSINESS Y COMPLIANCE:

### Data Protection Requirements:
- **Privacy Policy:** GDPR compliance + local privacy laws
- **Data Retention:** Automated purging + archival policies
- **User Rights:** Data export + deletion requests + consent management
- **Encryption:** End-to-end encryption sensitive data + secure transmission
- **Audit Trail:** Comprehensive logging + tamper-proof records

### Business Rules Enforcement:
- **User Permissions:** Least privilege principle + regular access reviews
- **Data Validation:** Business rule enforcement + data integrity checks
- **Integration Standards:** API versioning + backward compatibility requirements
- **Performance SLAs:** Response time monitoring + automatic scaling
- **Backup Policies:** Regular backups + disaster recovery testing

### Compliance Requirements:
- **Financial:** Anti-money laundering + financial reporting requirements
- **Real Estate:** Local real estate regulations + licensing requirements
- **Data:** Privacy laws + cross-border data transfer compliance
- **Security:** Industry security standards + regular audits
- **Accessibility:** WCAG compliance + inclusive design principles

## SLA Y EXPECTATIVAS:

### Performance Targets:
- **Page Load:** <3s first contentful paint, <1s subsequent pages
- **API Response:** <200ms average, <1s P95 para queries complejas
- **Uptime:** >95% monthly availability + planned maintenance windows
- **Mobile Performance:** <2s load time + smooth 60fps animations
- **Search:** <500ms para búsquedas complejas + real-time suggestions

### User Experience Goals:
- **User Satisfaction:** >4.5/5 rating NPS surveys + feedback collection
- **Task Completion:** >95% successful task completion rate
- **Learning Curve:** <30 min onboarding para new users + contextual help
- **Mobile Adoption:** >70% mobile usage + feature parity desktop
- **Accessibility:** WCAG 2.1 AA compliance + screen reader optimization

### Business Impact Metrics:
- **Productivity:** 40% reduction manual tasks vs legacy systems
- **Lead Conversion:** 25% improvement lead → customer conversion
- **Revenue Impact:** Measurable ROI + cost reduction demonstration
- **User Adoption:** >90% active daily users + feature utilization
- **Integration Success:** Seamless data flow + zero data loss migrations

## Variables de entorno
Copia `.env.example` a `.env.local` y completa las credenciales (no las publiques).
- `NEXT_PUBLIC_SITE_URL` = URL del sitio (ej: http://localhost:3000)
- `NEXT_PUBLIC_API_URL` = URL base de la API (ej: http://localhost:3000/api)
- `NEXT_PUBLIC_WS_URL` = URL de WebSocket (ej: ws://localhost:3001)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` = clave de Maps (frontend)
- `SENDGRID_API_KEY` = email transaccional (backend)
- `SENTRY_DSN` = monitoreo de errores

## Convenciones de desarrollo y contribución
- Ramificación: feature/*, fix/*, docs/*, chore/*; PRs con revisión obligatoria.
- Commits: Conventional Commits (feat, fix, docs, chore, refactor, test, build).
- Estilo: ESLint + Prettier; TypeScript estricto.
- Testing: Jest + Testing Library; E2E con Cypress/Playwright.
- CI/CD: GitHub Actions + Vercel (preview por PR, producción en main/master).

## Rutas de prueba (local)
- Página principal: http://localhost:3000/
- Leads: http://localhost:3000/leads
- Propiedades: http://localhost:3000/properties
- API health: http://localhost:3000/api/health
- API leads: GET/POST http://localhost:3000/api/leads
- API propiedades: GET/POST http://localhost:3000/api/properties

## Despliegue en Vercel (guía paso a paso)
1) Conectar el repositorio
   - En Vercel, Import Project → From Git → selecciona `d3min003/plataforma-web`.
2) Configuración básica
   - Production Branch: `master` (Project → Settings → Git)
   - Framework Preset: `Next.js`
   - Root Directory: `/` (raíz del repo)
   - Install Command: `npm install` (o `npm ci` si usas lockfile)
   - Build Command: `npm run build`
   - Output Directory: `.next`
3) Variables de entorno (opcional en esta base)
   - Usa `.env.example` como referencia; define en Project → Settings → Environment Variables.
4) Deploy
   - Click en Deploy. Al finalizar, verifica la URL pública.

### Troubleshooting 404 (NOT_FOUND) en Next.js
- Rama incorrecta
  - Asegura que Production Branch sea `master` o cambia a `main` en Git y actualiza Vercel.
- Root Directory erróneo
  - Debe ser la raíz del repo; evita subdirectorios.
- Falta de páginas
  - Revisa que exista `src/pages/index.tsx` (o `pages/index.tsx`). Esta base usa `src/pages`.
- Build/Output
  - Build: `npm run build`; Output: `.next`. No uses `out/` salvo `next export`.
- Logs de build
  - En el deployment, abre “Build Logs” y busca errores (dependencias, versiones, TS, etc.).
- Cache de Vercel
  - Trigger: “Redeploy” → “Clear Build Cache”.
- Versión de Node
  - Por defecto Vercel usa Node 18. Si necesitas fijarla, crea `package.json` engines o `vercel.json`.

### Forzar redeploy
- Vercel Dashboard → Project → Deployments → botón “Redeploy” → marca “Clear Build Cache”.
- O realiza un commit en `master` (cambio mínimo en README) para disparar un nuevo deploy.
