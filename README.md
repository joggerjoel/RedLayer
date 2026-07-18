# RedLayer

**A red-teaming dashboard that scans an SMB loan-underwriting AI agent for prompt-injection vulnerabilities and maps each one to the financial regulation it would violate.**

RedLayer probes a mock **SMB loan underwriting agent** for malicious instructions
hidden inside the documents it reads (bank statements, tax returns) — injections
that can trick it into approving loans it shouldn't or leaking applicant data.
Every finding is mapped to the specific regulation a lender would be violating
(**ECOA, FCRA, GLBA, SR 11-7**). The engine is built on NVIDIA's open-source
[garak](https://github.com/NVIDIA/garak) scanner.

> ⚠️ **This project contains intentional vulnerabilities for demonstration.** The
> target agent is deliberately insecure and all data is simulated. Nothing here is
> production-ready or safe to point at real systems. See [SECURITY.md](SECURITY.md).

## The story it tells

1. Configure a scan — pick attack suites and compliance frameworks.
2. Run it and watch progress.
3. Browse findings: each shows the injected document, what the agent did, the
   harm, and the regulations implicated.
4. **The key demo moment:** apply a fix and **re-test a finding — watch it flip
   from "failed" (red) to "blocked" (green).**

## Attack suites

| Suite               | What it probes                               |
| ------------------- | -------------------------------------------- |
| Latent injection    | Instructions hidden in document fields       |
| Unauthorized action | Coerced bad tool calls (e.g. `approve_loan`) |
| PII exfiltration    | Cross-applicant data leaks                   |
| Disclosure bypass   | Missing adverse-action notices               |

## Design principles (carried from the engine's roots)

- **Deterministic demo.** The target agent's decisions are rule-based, not
  model-sampled; garak drives the probes and grades from observable output (tool
  calls, canary strings). Scans reproduce run-to-run.
- **Real fixes, not UI swaps.** Re-test changes actual backend behavior, and a fix
  blocks the injection while still allowing a legitimate approval (precision, not a
  blanket block).

## Repository layout

```
.
├── backend/     # Python — garak-based engine, mock target, compliance mapping, API
├── frontend/    # Node.js — config → dashboard → finding detail → re-test
│   └── mocks/   # static fixtures; build the whole UI before the backend is live
└── docs/        # plans, to-dos, architecture; archived first-direction docs
```

## Documentation

- [Architecture: pluggable verticals](docs/architecture.md)
- [Backend plan](docs/backend-plan.md) · [Backend to-do](docs/backend-todo.md)
- [Frontend plan](docs/frontend-plan.md) · [Frontend to-do](docs/frontend-todo.md)
- [Archived: Accounts Payable demo](docs/archive/accounts-payable-demo/) — the first direction

## Status

**Planning + scaffolding.** Plans and to-dos reflect the SMB-lending direction;
frontend mock fixtures are in place. The backend `src/` still contains the
pattern scaffold from the first direction and is being migrated to garak.

## License

[MIT](LICENSE)
