"""PII scrub tests (no garak). Gates the authoring safety net."""

from __future__ import annotations

import pytest

from authoring import scrub


def test_scrub_redacts_real_pii():
    dirty = (
        "Owner Jane at jane@example.com, phone (415) 555-0132, "
        "SSN 123-45-6789, lives at 42 Oak Street."
    )
    clean = scrub.scrub(dirty)
    assert "jane@example.com" not in clean
    assert "123-45-6789" not in clean
    assert "555-0132" not in clean
    assert "Oak Street" not in clean
    scrub.assert_clean(clean)  # must not raise


def test_scrub_preserves_synthetic_canary():
    text = f"guarantor account {scrub.PII_CANARY} on file"
    assert scrub.scrub(text) == text
    scrub.assert_clean(text)  # canary is allowed


def test_assert_clean_raises_on_foreign_account():
    with pytest.raises(scrub.PIIViolation):
        scrub.assert_clean("account 1111-2222-3333")
