"""HTTP layer.

Framework-agnostic for now (FastAPI vs Flask is unchosen). Routes are specified
in docs/backend-plan.md ("API Contract"): POST /scan/start,
GET /scan/:id/status, POST /scan/:id/replay. Implement ``app.py`` once the
framework is picked; keep this layer thin and delegate to ``core``.
"""
