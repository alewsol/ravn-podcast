# RAVN — Positioning Context

## One-liner
RAVN — Infrastructure for companies building specialized robot workers.

## What we are
RAVN is the infrastructure layer for building, training, deploying, and evaluating specialized robot workers. We give enterprises and AI companies a platform to turn a job into a robot worker — not a robot we hand you off the shelf, and not a hardware line we manufacture.

## What we are not
- Not a hardware manufacturer. We don't build the physical units ourselves — same relationship Stripe has to banking.
- Not "Lovable for hardware." That framing is retired.
- Not a single-purpose robot company (no fixed vertical like underwater inspection or drones only).
- Not a generic AI agent platform. The output is a *worker* that operates in the physical world, not a chatbot.

## The core mechanic: Build → Train → Deploy → Evaluate → Improve
1. **Build** — Define the worker: its responsibilities, tools, and capabilities.
2. **Train** — Teach it your procedures, equipment, environments, and way of working, using your SOPs, machinery specs, work history, and expert knowledge.
3. **Deploy** — Put workers into real operations, manage them across sites and fleets.
4. **Evaluate** — Test how reliably they perform the jobs they were built for.
5. **Improve** — Feed real-world results and human feedback back in to make them better over time.

This is the same pipeline regardless of customer type — what changes is the job, not the platform.

## Worker types (enterprise motion)
- **Robot technicians** — diagnose, repair, and maintain robots and industrial machinery
- **Maintenance workers** — recurring equipment maintenance and repair
- **Field service workers** — service and repair jobs across physical locations
- **Inspection workers** — inspect assets, catch problems before they become failures
- **Production workers** — specialized physical tasks across manufacturing operations

## The problem we sell against
The most valuable operational work is highly specialized and chronically understaffed: a machine breaks down, a repair needs a technician, a specialist isn't available. RAVN turns that job into a specialized robot worker trained around the customer's own operation, instead of the customer trying to hire for a role nobody wants or can fill.

## Second motion: AI companies building physical products
Same infrastructure, different buyer. AI companies whose agents need to act in the physical world use RAVN to build the physical worker behind their agent — same Build/Train/Deploy/Evaluate/Improve pipeline, framed as giving their AI agent a body rather than staffing an operation.

- Underlying mechanic: the customer's AI/agent never calls low-level control tools directly. It sends a natural-language instruction; RAVN's internal middleware agent translates that into the actual control actions.
- Public surface is intentionally minimal: `instruct()`, `autonomous_instruct()`, `check()`. Everything else — motion, sensing, manipulation — is internal to RAVN.
- RAVN also ships "skills" so the customer's AI/team understands how the system works without needing to know the internals.

## Why one platform, not one robot
Customers build multiple workers for multiple jobs without rebuilding infrastructure each time — one worker for maintenance, another for inspection, another for field service, another for production. Each is trained differently. All of them run on RAVN. This is the actual "all-in-one" claim: not a bigger buzzword, but one platform underneath every worker type and every customer motion.

## Traction anchors (for pitches/applications)
- 4,000+ users
- Enterprise LOIs signed (distinct from closed/cash contracts — track separately)
- National African government deployment in pipeline
- Contracted ARR and national AI institute partnerships used as anchors in fundraising pitches
- Slingshot 2026 (Singapore) — advanced to top 250
- Techstars interview secured (top 3% of applicants)
- Viral proof point: OpenClaw agent autonomously designing its own physical body using RAVN via MCP (X/LinkedIn push)

## Landing page copy (current draft)

**Nav:** Platform · Workers · For AI companies · Talk to us

**Eyebrow:** (removed from hero)

**Headline:** Specialized robotic workers, built for you.

**Subhead:** RAVN gives enterprises the infrastructure to build, train, deploy, and evaluate robot workers on their SOPs, equipment, machinery, and operational knowledge.

**CTAs:** [Build a worker] [Talk to us]

**Proof:** 4,000+ builders already running on RAVN

**Hero marquee:** Trained on how you already operate. — SOPs, machinery specs, equipment, work history, expert knowledge, sites & fleets.

**Section — A platform, not a product.**
RAVN is the infrastructure layer for building, training, deploying, and evaluating specialized robot workers. Give us the job. We turn it into a worker that can do it.

What RAVN is: the layer underneath every worker; turns SOPs, equipment specs, and work history into a worker trained on how you operate.

What RAVN is not: not a hardware manufacturer (Stripe-to-bank relationship); not built around one job; not a chatbot — the output is a physical-world worker.

**Section — One pipeline. Every worker runs through it.**
Same five stages regardless of who's building or what the job is. What changes is the job, not the platform. Build → Train → Deploy → Evaluate → Improve.

**Section — Built for the roles nobody can fill.**
Robot technicians, maintenance workers, field service workers, inspection workers, production workers.

Pull quote: A machine breaks down. A repair needs a technician who isn't available. RAVN builds the worker trained on your operation instead.

**Section — Give your agent a body.**
Same infrastructure, different buyer. Public API: `instruct(task)`, `autonomous_instruct(goal)`, `check(task_id)`. Skills ship so the customer's AI/team can work with the system without internals.

**Closing:** Turn a job into a robot worker.

**Footer:** RAVN — Infrastructure for companies building specialized robot workers.

## Notes for future edits
- If positioning shifts again, update this file rather than starting a new one — this is meant to be the single source of truth for external-facing copy.
- Historical positioning ("AI operating system for service firms," "give your AI a body" as the sole framing) is retired — don't resurrect it in new copy.
