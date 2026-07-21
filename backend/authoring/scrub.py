"""PII scrub + validation for authored fixtures.

Tavily returns real web content, so anything composed from it MUST pass through
here before being written to a committed fixture. Two entry points:

- ``scrub(text)``   -> redacts disallowed PII, returning safe text.
- ``assert_clean(text)`` -> raises ``PIIViolation`` if any disallowed PII remains
  (used both after scrubbing and as a CI gate on committed fixtures).

The one intentional exception is the synthetic cross-applicant canary
``5521-9910-7723`` — the demo needs it, and it is not real PII.
"""

from __future__ import annotations

import re

# The synthetic account canary the PII probe grades on. Allowed to remain.
PII_CANARY = "5521-9910-7723"

SSN_RE = re.compile(r"\b\d{3}-\d{2}-\d{4}\b")
ACCOUNT_RE = re.compile(r"\b\d{4}-\d{4}-\d{4}\b")
EMAIL_RE = re.compile(r"\b[\w.+-]+@[\w-]+\.[\w.-]+\b")
PHONE_RE = re.compile(r"\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b")
STREET_RE = re.compile(
    r"\b\d{1,5}\s+[A-Z][a-z]+\s+"
    r"(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Lane|Ln|Dr|Drive|Way|Ct|Court)\b"
)


class PIIViolation(ValueError):
    """A fixture contains PII that must not be committed."""


def find_violations(text: str) -> list[str]:
    """List disallowed PII found in ``text`` (empty list == clean)."""
    violations: list[str] = []
    if SSN_RE.search(text):
        violations.append("ssn")
    for match in ACCOUNT_RE.finditer(text):
        if match.group() != PII_CANARY:
            violations.append(f"account:{match.group()}")
    if EMAIL_RE.search(text):
        violations.append("email")
    if PHONE_RE.search(text):
        violations.append("phone")
    if STREET_RE.search(text):
        violations.append("street-address")
    return violations


def scrub(text: str) -> str:
    """Redact disallowed PII, preserving the synthetic canary."""
    text = EMAIL_RE.sub("[redacted-email]", text)
    text = PHONE_RE.sub("[redacted-phone]", text)
    text = STREET_RE.sub("[redacted-address]", text)
    text = SSN_RE.sub("[redacted-ssn]", text)
    text = ACCOUNT_RE.sub(
        lambda m: m.group() if m.group() == PII_CANARY else "[redacted-account]", text
    )
    return text


def assert_clean(text: str) -> None:
    """Raise if ``text`` still contains disallowed PII."""
    violations = find_violations(text)
    if violations:
        raise PIIViolation(f"fixture contains PII: {sorted(set(violations))}")
