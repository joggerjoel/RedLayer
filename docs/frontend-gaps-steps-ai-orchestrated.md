# Frontend Implementation Steps — AI-Orchestrated Interface

**Purpose:** Step-by-step implementation to achieve the AI-orchestrated, zero-chrome interface discussed. Transform traditional screens into context-aware, alert-driven, command-first UX.

**Vision:** Simple surface, powerful depths. No permanent navigation. Alert-driven discovery. Command palette for everything. Progressive disclosure (shallow → medium → deep).

---

## 🎯 Implementation Philosophy

### From Traditional UI to AI-Orchestrated

**Before (Traditional):**
- Permanent sidebar with all nav links
- Top-level tabs on every page
- Filter bars always visible
- Multiple grids stacked on one page
- Settings gear icons everywhere

**After (AI-Orchestrated):**
- Clean canvas, content appears on-demand
- Cmd+K command palette (type to go anywhere)
- Cmd+/ Quick Actions Grid (power users)
- Alert system surfaces critical info with 3-option prong
- Components scale: shallow → medium → deep

---

## Framework: AI-Orchestrated Decision Tree

Use this for **every** feature you implement:

```
1. How does the user discover this?
   → Critical issue?     → 🔴 Alert [Fix Now] [Investigate] [Escalate]
   → Performance warning? → 🟡 Alert [Quick Fix] [Details] [Snooze]
   → Optimization tip?   → 🔵 Alert [Apply] [Learn More] [Dismiss]
   → Regular access?     → Cmd+K command (AI interprets intent)
   → Power user?         → Cmd+/ Quick Actions Grid

2. What depth does this need?
   → Shallow: Card with 3-4 metrics, click to expand
   → Medium: List with row details, show related context
   → Deep:   Full editor/grid with all capabilities
   
   AI decides initial depth based on user context.

3. Does this have permanent UI?
   → Navigation?   → NO. Use Cmd+K command palette
   → Tabs?         → NO top-level tabs. Use context cards that expand
   → Filters?      → NO permanent bars. Show inline when relevant
   → Toolbar?      → NO. Actions via right-click or Cmd+K
   
4. How does the user interact?
   → Alert-driven?  → 3 options exactly (primary, secondary, tertiary)
   → Form/modal?    → One focus, minimal fields, progressive disclosure
   → Grid/list?     → Shallow by default, expand on-demand
   → Config/edit?   → JSON by default, structured forms behind "Edit" action
```

---

## 🏗️ Core Infrastructure (Build First)

### Phase 0: Foundation Components

These enable the AI-orchestrated pattern. Build once, use everywhere.

#### 0.1 Command Palette (Cmd+K)

**Purpose:** Universal navigation and action. Replaces traditional navigation.

| Step | Action | File |
|------|--------|------|
| 0.1.1 | Create CommandPalette component with keyboard shortcut (Cmd+K) | `frontend/src/components/CommandPalette/CommandPalette.tsx` |
| 0.1.2 | Add AI command interpreter hook that calls backend to parse natural language | `frontend/src/hooks/useAICommandProcessor.ts` |
| 0.1.3 | Implement command execution router (navigate, filter, analyze, create) | `frontend/src/services/commandExecutor.ts` |
| 0.1.4 | Add recent commands and AI suggestions to palette | CommandPalette.tsx |
| 0.1.5 | Create global keyboard shortcut registration | `frontend/src/hooks/useGlobalHotkeys.ts` |

**Commands to support:**
```typescript
// Navigation
"budget" → /workflow/budget (with last-used groupBy)
"instances" → /workflow/instances
"agents" → /workflow/agents
"slow nodes" → /workflow/reports (slow nodes section)

// Filtered navigation
"budget by user" → /workflow/budget?groupBy=user
"expensive workflows" → /workflow/budget?sortBy=cost&order=desc
"failing workflows" → /workflow/failed-executions

// Actions
"register agent" → Open RegisterAgentModal
"create workflow" → Navigate to editor
"fix workflow X" → Open workflow X with validation errors highlighted

// Analysis
"what's using my budget" → AI analyzes and shows breakdown
"why is workflow X slow" → AI investigates and surfaces slow nodes
```

#### 0.2 Quick Actions Grid (Cmd+/)

**Purpose:** Organized shortcuts for power users. Appears on-demand only.

| Step | Action | File |
|------|--------|------|
| 0.2.1 | Create QuickActionsGrid component (3-column layout) | `frontend/src/components/QuickActionsGrid/QuickActionsGrid.tsx` |
| 0.2.2 | Define action categories (Workflows, Monitoring, Budget, Tasks, Admin, AI) | Same file |
| 0.2.3 | Add keyboard shortcut (Cmd+/) and filter functionality | Same file |
| 0.2.4 | Implement AI-enhanced filtering (semantic search) | `frontend/src/hooks/useActionFilter.ts` |

**Grid structure:**
```
WORKFLOWS          MONITORING         BUDGET
📝 Definitions     📊 Reports         💰 Summary
▶️ Instances       🐌 Slow Nodes      📈 Trends
🤖 Agents          ⚠️ Failed          🎯 Optimize
```

#### 0.3 Alert System

**Purpose:** Proactive system that surfaces issues with 3-option interaction.

| Step | Action | File |
|------|--------|------|
| 0.3.1 | Create Alert types (Critical, Warning, Info) with severity styling | `frontend/src/types/alerts.ts` |
| 0.3.2 | Create AlertStack component (floating, bottom-right) | `frontend/src/components/Alerts/AlertStack.tsx` |
| 0.3.3 | Create AlertCard with 3-option action prong | `frontend/src/components/Alerts/AlertCard.tsx` |
| 0.3.4 | Implement AlertOrchestrator service (context-aware alert prioritization) | `frontend/src/services/alertOrchestrator.ts` |
| 0.3.5 | Add backend endpoint for AI alert generation | `backend/src/services/ai/alertGenerator.ts` |

**Alert structure:**
```typescript
interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  actions: [
    { label: string; type: 'primary'; action: () => void },
    { label: string; type: 'secondary'; action: () => void },
    { label: string; type: 'tertiary'; action: () => void }
  ]; // Always exactly 3 actions
  context: Record<string, any>; // For AI decision-making
  relatedAlerts: string[]; // For consolidation
  timestamp: number;
}
```

#### 0.4 AI Orchestrator

**Purpose:** Context-aware system that decides what to show and when.

| Step | Action | File |
|------|--------|------|
| 0.4.1 | Create UserContext tracking (current view, recent actions, preferences) | `frontend/src/contexts/UserContext.tsx` |
| 0.4.2 | Implement AIOrchestrator service with caching and prefetching | `frontend/src/services/aiOrchestrator.ts` |
| 0.4.3 | Add predictive prefetching hook | `frontend/src/hooks/useAIPrefetching.ts` |
| 0.4.4 | Create component depth system (shallow/medium/deep) | `frontend/src/types/componentDepth.ts` |
| 0.4.5 | Add backend AI endpoints for command interpretation and next-action prediction | `backend/src/services/ai/` |

#### 0.5 Clean Canvas Layout

**Purpose:** Zero-chrome container that shows only current focus.

| Step | Action | File |
|------|--------|------|
| 0.5.1 | Create OrchestrationLayout (replaces DashboardLayout for new pages) | `frontend/src/layouts/OrchestrationLayout.tsx` |
| 0.5.2 | Remove permanent navigation (sidebar hidden by default) | Same file |
| 0.5.3 | Add floating components: AlertStack, CommandPalette, QuickActionsGrid | Same file |
| 0.5.4 | Add minimal status indicator (connection, notifications count) | `frontend/src/components/StatusIndicator.tsx` |

---

## 📋 Implementation Phases (Transformed)

### Phase 1: Navigation → Command System

**Transform permanent navigation into command-driven access.**

#### 1.1 Remove Permanent Sidebar (for new AI-orchestrated pages)

| Step | Action | File |
|------|--------|------|
| 1.1.1 | Create new OrchestrationLayout without sidebar | `frontend/src/layouts/OrchestrationLayout.tsx` |
| 1.1.2 | Add keyboard shortcut indicator (subtle "Press Cmd+K" on first visit) | Same file |
| 1.1.3 | Keep DashboardLayout for legacy pages (gradual migration) | — |

**DO NOT** add Instances to sidebar. Instead:

| Step | Action | File |
|------|--------|------|
| 1.1.4 | Add "instances" command to CommandPalette | `frontend/src/components/CommandPalette/commands.ts` |
| 1.1.5 | Add "Instances" to Quick Actions Grid under WORKFLOWS | `frontend/src/components/QuickActionsGrid/actions.ts` |
| 1.1.6 | Create AI alert for new instances (when workflow completes) | `backend/src/services/ai/alertGenerator.ts` |

#### 1.2 Command Palette: Workflow Commands

| Step | Action | File |
|------|--------|------|
| 1.2.1 | Register "instances" → navigate to /workflow/instances | `frontend/src/components/CommandPalette/commands.ts` |
| 1.2.2 | Register "budget" → navigate with last groupBy preference | Same file |
| 1.2.3 | Register "budget by user/agent/category" → navigate + filter | Same file |
| 1.2.4 | Register "agents" → /workflow/agents | Same file |
| 1.2.5 | Add AI interpretation for variations ("show instances", "view runs") | `frontend/src/hooks/useAICommandProcessor.ts` |

---

### Phase 2: Register Agent → Modal + Alert Pattern

**Transform: Toolbar button → Command-triggered modal.**

#### 2.1 Register Agent via Command Palette

| Step | Action | File |
|------|--------|------|
| 2.1.1 | Create RegisterAgentModal (dialog-style, not full screen) | `frontend/src/components/Workflow/RegisterAgentModal.tsx` |
| 2.1.2 | Add "register agent" command to palette | `frontend/src/components/CommandPalette/commands.ts` |
| 2.1.3 | Add API call for POST /api/agents/register | `frontend/src/services/agentsService.ts` |
| 2.1.4 | Implement form with required fields visible, optional in `<details>` | RegisterAgentModal.tsx |
| 2.1.5 | On success, show success toast + invalidate agents query | Same file |
| 2.1.6 | On error, show inline error (no error modal) | Same file |

**Progressive Disclosure in Modal:**
```tsx
<Modal>
  <h2>Register Agent</h2>
  
  {/* Always visible */}
  <Input label="Name" required />
  <Input label="Version" required />
  <Select label="Type" required />
  
  {/* Collapsible */}
  <details>
    <summary>Advanced Options</summary>
    <Textarea label="Capabilities JSON" />
    <Textarea label="Config Schema" />
    <Input label="Estimated Cost" type="number" />
  </details>
  
  <Button primary>Register</Button>
</Modal>
```

#### 2.2 AI Alert: Missing Agent

**Proactive suggestion when editing workflow with unregistered agent.**

| Step | Action | File |
|------|--------|------|
| 2.2.1 | Detect unregistered agents in workflow editor | `frontend/src/components/Workflow/WorkflowFlowEditor.tsx` |
| 2.2.2 | Generate alert: "Register required agents" | `frontend/src/services/alertOrchestrator.ts` |
| 2.2.3 | Alert actions: [Register Now] [View All] [Later] | Same file |
| 2.2.4 | "Register Now" opens RegisterAgentModal pre-filled | AlertCard.tsx action handler |

---

### Phase 3: Slow Nodes → Alert + On-Demand Section

**Transform: Always-visible section → Alert when problems detected.**

#### 3.1 Slow Nodes as Alert

| Step | Action | File |
|------|--------|------|
| 3.1.1 | Backend: Detect slow nodes (avg > threshold) | `backend/src/services/ai/alertGenerator.ts` |
| 3.1.2 | Generate alert when slow nodes found: "3 nodes averaging >5s" | Same file |
| 3.1.3 | Alert actions: [View Details] [Optimize] [Dismiss] | Same file |
| 3.1.4 | "View Details" opens SlowNodesPanel (slide-over, not full page) | `frontend/src/components/Workflow/SlowNodesPanel.tsx` |

#### 3.2 Slow Nodes Panel (On-Demand)

| Step | Action | File |
|------|--------|------|
| 3.2.1 | Create SlowNodesPanel as slide-over (Sheet component) | `frontend/src/components/Workflow/SlowNodesPanel.tsx` |
| 3.2.2 | Show simple table (not full grid): Node, Workflow, Avg Duration, Count | Same file |
| 3.2.3 | Add filter: Min Duration dropdown (1s, 5s, 10s) | Same file |
| 3.2.4 | Click node → opens workflow editor with that node highlighted | Same file |

**Also accessible via:**
- Command palette: "slow nodes" → opens panel
- Quick Actions Grid: Monitoring → 🐌 Slow Nodes

---

### Phase 4: Budget → Composable Depth Pattern

**Transform: Full-page grid → Shallow card that expands.**

#### 4.1 Budget Shallow View (Default)

| Step | Action | File |
|------|--------|------|
| 4.1.1 | Create BudgetPage with OrchestrationLayout (no sidebar) | `frontend/src/pages/BudgetPage.tsx` |
| 4.1.2 | Show AI-generated summary card only: "You've spent $X this month" | Same file |
| 4.1.3 | Show 3 metric cards: Total Spend, Most Expensive, Optimization | Same file |
| 4.1.4 | Add "View Breakdown" button to expand to medium | Same file |

**Shallow view (default):**
```tsx
<div className="space-y-6">
  {/* AI Summary */}
  <Card className="p-6 bg-gradient">
    <p>💰 You've spent <strong>$1,247</strong> this month. 
       That's <strong>12% under budget</strong>.</p>
  </Card>
  
  {/* Quick metrics */}
  <div className="grid grid-cols-3 gap-4">
    <MetricCard label="Total" value="$1,247" onClick={() => setDepth('medium')} />
    <MetricCard label="Top Spend" value="Data Pipeline" onClick={() => goToDetail('data-pipeline')} />
    <MetricCard label="Save" value="$127/mo" onClick={() => showOptimizations()} />
  </div>
  
  <Button onClick={() => setDepth('medium')}>View Breakdown →</Button>
</div>
```

#### 4.2 Budget Medium View (On Click)

| Step | Action | File |
|------|--------|------|
| 4.2.1 | Add groupBy selector (Pills: Category \| Agent \| User) | `frontend/src/pages/BudgetPage.tsx` |
| 4.2.2 | Show list (not grid) of categories with cost bars | Same file |
| 4.2.3 | Click category → expands to deep view with grid | Same file |

**Medium view:**
```tsx
<div className="space-y-6">
  <div className="flex items-center justify-between">
    <h1>Budget Breakdown</h1>
    <Button variant="ghost" onClick={() => setDepth('shallow')}>← Overview</Button>
  </div>
  
  {/* Pill selector */}
  <div className="flex gap-2">
    <Pill active={groupBy === 'category'} onClick={() => setGroupBy('category')}>
      By Category
    </Pill>
    <Pill active={groupBy === 'agent'} onClick={() => setGroupBy('agent')}>
      By Agent
    </Pill>
    <Pill active={groupBy === 'user'} onClick={() => setGroupBy('user')}>
      By User
    </Pill>
  </div>
  
  {/* List with cost bars */}
  <div className="space-y-2">
    {categories.map(cat => (
      <Card 
        key={cat.id}
        className="p-4 cursor-pointer hover:shadow"
        onClick={() => { setDepth('deep'); setSelectedCategory(cat.id); }}
      >
        <div className="flex justify-between items-center">
          <span className="font-medium">{cat.label}</span>
          <span className="text-lg">${cat.totalCost}</span>
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded">
          <div className="h-2 bg-blue-500 rounded" style={{ width: `${cat.percentage}%` }} />
        </div>
        <p className="text-sm text-muted mt-1">
          {cat.instanceCount} instances • {cat.executionCount} executions
        </p>
      </Card>
    ))}
  </div>
</div>
```

#### 4.3 Budget Deep View (Drill-Down)

| Step | Action | File |
|------|--------|------|
| 4.3.1 | Show full grid (SchemaGrid) for selected category | `frontend/src/pages/BudgetPage.tsx` |
| 4.3.2 | Add sort, pagination, export capabilities | Same file |
| 4.3.3 | Add breadcrumb: Overview > Breakdown > [Category Name] | Same file |
| 4.3.4 | Implement back navigation to medium view | Same file |

#### 4.4 Budget Alerts

| Step | Action | File |
|------|--------|------|
| 4.4.1 | Detect budget spikes (>20% increase in 24h) | `backend/src/services/ai/alertGenerator.ts` |
| 4.4.2 | Generate warning alert: "Budget spike detected" | Same file |
| 4.4.3 | Alert actions: [View Details] [Set Alert] [Dismiss] | Same file |
| 4.4.4 | "View Details" opens BudgetPage filtered to spike source | Alert action handler |

---

### Phase 5: Editor Node Forms → Context Cards

**Transform: Permanent tabs → JSON default + Edit actions.**

#### 5.1 Node Inspector: JSON-First

| Step | Action | File |
|------|--------|------|
| 5.1.1 | Show JSON editor by default (compact, syntax-highlighted) | `frontend/src/components/Workflow/WorkflowFlowEditor.tsx` |
| 5.1.2 | Add "Edit Config" action button (not tabs) | Same file |
| 5.1.3 | Click "Edit Config" → shows modal with structured form | `frontend/src/components/Workflow/NodeConfigModal.tsx` |
| 5.1.4 | Modal has sections: Parallel, Human, Agent, AI (based on node type) | Same file |
| 5.1.5 | Save in modal → updates JSON, closes modal | Same file |

**Inspector layout:**
```tsx
<div className="node-inspector">
  {/* Header */}
  <div className="flex items-center justify-between mb-4">
    <h3>{node.label || node.id}</h3>
    <div className="flex gap-2">
      <Button size="sm" onClick={() => openConfigModal()}>
        Edit Config
      </Button>
      <Button size="sm" variant="ghost" onClick={() => copyJSON()}>
        Copy JSON
      </Button>
    </div>
  </div>
  
  {/* JSON (always visible, compact) */}
  <div className="h-64 overflow-auto">
    <CodeEditor value={JSON.stringify(node, null, 2)} readOnly />
  </div>
  
  {/* Validation errors as alerts */}
  {validationErrors.map(error => (
    <Alert severity="warning" className="mt-2">
      <AlertTitle>{error.field}</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  ))}
</div>
```

#### 5.2 Node Config Modal

| Step | Action | File |
|------|--------|------|
| 5.2.1 | Create NodeConfigModal with dynamic sections based on node type | `frontend/src/components/Workflow/NodeConfigModal.tsx` |
| 5.2.2 | Parallel node: show ForkStrategyForm | `frontend/src/components/Workflow/config/ForkStrategyForm.tsx` |
| 5.2.3 | Human task: show HumanTaskForm (assignee, timeout, form_schema) | `frontend/src/components/Workflow/config/HumanTaskForm.tsx` |
| 5.2.4 | Agent node: show AgentConfigForm (agent picker, inputs/outputs) | `frontend/src/components/Workflow/config/AgentConfigForm.tsx` |
| 5.2.5 | AI node: show AIConfigForm (model, provider, prompt) | `frontend/src/components/Workflow/config/AIConfigForm.tsx` |

---

### Phase 6: Human Task Forms → Dynamic Shallow Cards

**Transform: Fixed form → Schema-driven progressive form.**

#### 6.1 Task Card (Shallow)

| Step | Action | File |
|------|--------|------|
| 6.1.1 | Show task card with title, description, assignee | `frontend/src/components/Workflow/TaskCard.tsx` |
| 6.1.2 | Add "Complete Task" button | Same file |
| 6.1.3 | Click → expands to show form inline (not new page) | Same file |

#### 6.2 Dynamic Form Renderer

| Step | Action | File |
|------|--------|------|
| 6.2.1 | Create schema-to-form renderer (supports: text, number, select, date, checkbox) | `frontend/src/components/Workflow/DynamicFormRenderer.tsx` |
| 6.2.2 | Add client-side validation based on schema rules | Same file |
| 6.2.3 | Group fields if schema defines sections | Same file |
| 6.2.4 | Render form inline in TaskCard when expanded | TaskCard.tsx |
| 6.2.5 | Submit → POST /workflow/tasks/:id/complete with form data | Same file |

---

### Phase 7: Join Override → Alert + Inline Panel

**Transform: Permanent panel → Alert when join pending.**

#### 7.1 Join Pending Alert

| Step | Action | File |
|------|--------|------|
| 7.1.1 | Detect when workflow is waiting at join | `backend/src/services/ai/alertGenerator.ts` |
| 7.1.2 | Generate warning: "Workflow waiting at join condition" | Same file |
| 7.1.3 | Alert actions: [Override] [View Logs] [Wait] | Same file |

#### 7.2 Join Override Panel (On-Demand)

| Step | Action | File |
|------|--------|------|
| 7.2.1 | Create JoinOverridePanel as inline expansion (not separate page) | `frontend/src/components/Workflow/JoinOverridePanel.tsx` |
| 7.2.2 | Show: (1) Condition summary, (2) Reason field, (3) Override button | Same file |
| 7.2.3 | Add collapsible "Past Overrides" audit log | Same file |
| 7.2.4 | Submit → POST /workflow/instances/:id/join-override | Same file |

```tsx
<div className="join-override-panel">
  {/* Condition (read-only) */}
  <div className="mb-4">
    <Label>Join Condition</Label>
    <Card className="p-3 bg-muted">
      <code>{condition.expression}</code>
    </Card>
  </div>
  
  {/* Reason */}
  <div className="mb-4">
    <Label>Override Reason</Label>
    <Textarea 
      placeholder="Why are you overriding this decision?"
      value={reason}
      onChange={(e) => setReason(e.target.value)}
    />
  </div>
  
  {/* Action */}
  <div className="flex gap-2">
    <Button onClick={handleOverride} disabled={!reason}>
      Override Decision
    </Button>
    <Button variant="ghost" onClick={onCancel}>
      Cancel
    </Button>
  </div>
  
  {/* Collapsible audit */}
  <details className="mt-4">
    <summary className="cursor-pointer text-sm text-muted-foreground">
      View Past Overrides
    </summary>
    <div className="mt-2 space-y-2">
      {pastOverrides.map(override => (
        <Card key={override.id} className="p-2 text-sm">
          <strong>{override.user}</strong> on {formatDate(override.timestamp)}
          <p className="text-muted-foreground">{override.reason}</p>
        </Card>
      ))}
    </div>
  </details>
</div>
```

---

## 🎨 Component Patterns (Reusable)

### Composable Component Template

Every component should support depth switching:

```typescript
interface ComposableProps<T> {
  data: T;
  depth: 'shallow' | 'medium' | 'deep';
  onDepthChange?: (depth: string) => void;
}

function ComposableComponent({ data, depth, onDepthChange }: ComposableProps) {
  if (depth === 'shallow') {
    return (
      <Card onClick={() => onDepthChange?.('medium')}>
        <h3>{data.title}</h3>
        <p>{data.summary}</p>
      </Card>
    );
  }
  
  if (depth === 'medium') {
    return (
      <Card>
        <Button variant="ghost" onClick={() => onDepthChange?.('shallow')}>
          ← Back
        </Button>
        <h3>{data.title}</h3>
        <div className="grid grid-cols-2 gap-4">
          {data.metrics.map(m => (
            <MetricCard key={m.id} {...m} />
          ))}
        </div>
        <Button onClick={() => onDepthChange?.('deep')}>
          View Details →
        </Button>
      </Card>
    );
  }
  
  // Deep: Full grid/editor
  return <FullDetailView data={data} />;
}
```

### Alert Pattern Template

Every alert follows the 3-option pattern:

```typescript
interface AlertPattern {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  actions: [
    { label: string; type: 'primary'; action: () => void },
    { label: string; type: 'secondary'; action: () => void },
    { label: string; type: 'tertiary'; action: () => void }
  ];
}

// Example: Budget Spike
{
  severity: 'warning',
  title: 'Budget spike detected',
  message: 'Spending increased 24% in last 24h',
  actions: [
    { 
      label: 'View Details', 
      type: 'primary',
      action: () => navigate('/budget', { filter: 'spike-source' })
    },
    { 
      label: 'Set Alert', 
      type: 'secondary',
      action: () => openModal('budget-alert-config')
    },
    { 
      label: 'Dismiss', 
      type: 'tertiary',
      action: () => dismissAlert('budget-spike')
    }
  ]
}
```

---

## 🚀 Migration Path

### Gradual Transition

**Week 1-2: Foundation**
- Build CommandPalette, QuickActionsGrid, AlertStack
- Create OrchestrationLayout (new pages only)
- Keep existing DashboardLayout for legacy pages

**Week 3-4: New Features**
- Budget page uses AI-orchestrated pattern
- Register agent uses command palette
- Slow nodes uses alert system

**Week 5-6: Migrate Existing**
- Workflow instances page → composable depth
- Task detail → dynamic forms
- Editor node inspector → JSON-first + modal

**Week 7+: Polish**
- AI command interpretation (Claude API)
- Predictive prefetching
- Context-aware alert generation
- User preference learning

---

## ✅ Acceptance Criteria (Per Phase)

### Phase 0: Foundation
- ✓ Cmd+K opens command palette
- ✓ Typing "budget" navigates to budget page
- ✓ Cmd+/ shows Quick Actions Grid
- ✓ Alerts appear in bottom-right with 3 options
- ✓ OrchestrationLayout has no permanent navigation

### Phase 1: Navigation
- ✓ No "Instances" in sidebar
- ✓ "instances" command works
- ✓ Quick Actions Grid has "Instances" under WORKFLOWS

### Phase 2: Register Agent
- ✓ "register agent" command opens modal
- ✓ Required fields visible, optional in `<details>`
- ✓ Alert appears when unregistered agent detected

### Phase 3: Slow Nodes
- ✓ Alert appears when slow nodes detected
- ✓ "View Details" opens slide-over panel
- ✓ Panel has simple table + filter

### Phase 4: Budget
- ✓ Default view is shallow (summary card + 3 metrics)
- ✓ Click expands to medium (list with pills)
- ✓ Click category expands to deep (full grid)
- ✓ Budget spike generates alert

### Phase 5: Editor
- ✓ Node inspector shows JSON by default
- ✓ "Edit Config" opens modal with forms
- ✓ Changes update JSON and persist

### Phase 6: Tasks
- ✓ Task card shows summary
- ✓ Click expands to show dynamic form
- ✓ Form validates and submits

### Phase 7: Join Override
- ✓ Alert appears when join pending
- ✓ "Override" action opens inline panel
- ✓ Panel has: condition, reason, button, collapsible audit

---

## 📚 Technology Stack

**Same as before, plus:**

### AI Layer
- **Claude API** (Sonnet 4) via Anthropic Messages endpoint
- **Backend AI services:**
  - `/api/ai/interpret-command` - Natural language → actions
  - `/api/ai/generate-alerts` - Context → prioritized alerts
  - `/api/ai/predict-next` - Current context → likely next actions

### New Components
- CommandPalette (cmdk base)
- QuickActionsGrid
- AlertStack, AlertCard
- OrchestrationLayout
- Composable wrappers (ComposableWorkflowCard, ComposableBudgetView)

### Keep From Original
- React Query for server state
- Zustand for UI preferences (+ depth state)
- TailwindCSS
- lucide-react icons
- SchemaGrid (for deep views only)

---

## 🎯 Implementation Checklist

### Foundation (Week 1-2)
- [ ] CommandPalette with Cmd+K
- [ ] AI command processor hook
- [ ] QuickActionsGrid with Cmd+/
- [ ] AlertStack component
- [ ] AlertCard with 3-option pattern
- [ ] OrchestrationLayout
- [ ] UserContext tracking
- [ ] AIOrchestrator service

### Navigation (Week 2)
- [ ] Remove Instances from sidebar plan
- [ ] Add "instances" command
- [ ] Add "budget" command with groupBy support
- [ ] Add Quick Actions Grid entries

### Features (Week 3-4)
- [ ] Register Agent modal + command
- [ ] Missing agent alert
- [ ] Slow nodes alert + panel
- [ ] Budget shallow view
- [ ] Budget medium view
- [ ] Budget deep view
- [ ] Budget spike alert

### Advanced (Week 5-6)
- [ ] Node inspector JSON-first
- [ ] Node config modal
- [ ] Task dynamic form renderer
- [ ] Join pending alert
- [ ] Join override panel

### AI Integration (Week 7+)
- [ ] Backend command interpretation
- [ ] Backend alert generation
- [ ] Predictive prefetching
- [ ] User preference learning
- [ ] Semantic action search

---

**This implementation achieves the AI-orchestrated interface vision: zero chrome, alert-driven, command-first, progressively disclosed depth.**
