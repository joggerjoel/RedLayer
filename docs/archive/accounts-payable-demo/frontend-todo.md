# Front-End To-Do

## API and Data Contract

- [ ] Copy the normalized `AttackAttempt` type into the front-end project
- [ ] Add types for scan state, evidence, summary, replay, and API errors
- [ ] Create API client for `POST /scan/start`
- [ ] Create API client for `GET /scan/:id/status`
- [ ] Create API client for `POST /scan/:id/replay`
- [ ] Use polling every 750 to 1,000 milliseconds
- [ ] Stop polling on `vulnerable`, `secured`, or `error`
- [ ] Keep mock responses aligned exactly with the real API contract

## Start State

- [ ] Show Accounts Payable Agent as the target
- [ ] Show the forbidden outcome
- [ ] Show $42,850 amount at risk
- [ ] Add Start Autonomous Scan button
- [ ] Add scan-creation loading state
- [ ] Add scan-start failure message and Retry button

## Running Scan

- [ ] Build the attempt list from normalized data
- [ ] Show attempt number, label, and technique
- [ ] Show pending status with icon and text
- [ ] Show running status with icon and text
- [ ] Show blocked status with icon and text
- [ ] Show succeeded status with icon and text
- [ ] Show error status with icon and text
- [ ] Show a short block reason under every blocked attempt
- [ ] Highlight the current attempt without assuming attempt 5

## Attempt Detail Panel

- [ ] Use one shared component for all attempt types
- [ ] Show payload summary
- [ ] Show poisoned source cards
- [ ] Show agent response
- [ ] Show tool calls
- [ ] Show tool-call arguments in readable JSON
- [ ] Show block reason for failed attacks
- [ ] Show exploit result for successful attacks

## End-of-Run Summary

- [ ] Show attempts executed
- [ ] Show blocked count
- [ ] Show successful exploit count
- [ ] Show amount at risk
- [ ] Display summary before the vulnerability card

## Evidence and Finding

- [ ] Build Critical Vulnerability card
- [ ] Show invoice number
- [ ] Show vendor name
- [ ] Show approved account ending 3381
- [ ] Show attempted account ending 9017
- [ ] Show amount $42,850
- [ ] Show forbidden outcome
- [ ] Show successful attempt name
- [ ] Show `prepare_payment` function name
- [ ] Show payment function parameters
- [ ] Show tool result

## Attack Chain

- [ ] Render poisoned invoice node
- [ ] Render fake CFO approval node
- [ ] Render poisoned verification node
- [ ] Render skipped approval node
- [ ] Render unauthorized payment call node
- [ ] Connect nodes with simple arrows

## Patch and Replay

- [ ] Add Apply Patch and Replay button
- [ ] Send successful `attempt_id` in replay request
- [ ] Send mitigation ID in replay request
- [ ] Show replay-running state
- [ ] Poll status during replay
- [ ] Show before-patch result
- [ ] Show after-patch result
- [ ] Show replay block reason
- [ ] Show applied mitigation text
- [ ] Add Patch Precision panel: malicious (9017) blocked vs legitimate (7742) allowed
- [ ] Read both precision rows from the replay payload `control_case`, not hard-coded
- [ ] Use icon plus text (not color alone) for each precision row

## Reset and Resilience

- [ ] Make Reset a must-have button
- [ ] Stop active polling on reset
- [ ] Clear the current scan state
- [ ] Return to the start screen
- [ ] Confirm multiple back-to-back runs work
- [ ] Retry one failed poll automatically
- [ ] Show connection error after repeated failures
- [ ] Show waiting state for slow backend
- [ ] Add scan timeout handling
- [ ] Add mock-mode fallback

## Timing and Presentation

- [ ] Keep attempt animation delays between 3 and 5 seconds
- [ ] Keep full demo under 90 seconds
- [ ] Test on a projector-sized window
- [ ] Verify text is readable from a distance
- [ ] Do not rely on color alone for status
- [ ] Record a backup demo video

## Manual Review Checklist

- [ ] Mock and backend schemas match exactly
- [ ] Block reasons explain the escalation story
- [ ] Successful attempt is selected dynamically
- [ ] Evidence proves the actual payment tool call
- [ ] Patch replay calls the backend
- [ ] Patch Precision panel shows malicious blocked AND legitimate allowed, both from payload
- [ ] Reset works without refreshing the browser
- [ ] Failure states do not break the demo
- [ ] End-of-run summary creates a clear conclusion
