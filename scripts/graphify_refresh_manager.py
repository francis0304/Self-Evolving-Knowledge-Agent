#!/usr/bin/env python3
"""
Graphify Refresh Manager — Smart Knowledge Graph Freshness Monitoring

Tracks file changes since last graphify build and recommends refresh
when meaningful thresholds are met. Designed to be called by the
.agent system's graphify-check skill at session start.

Usage:
    python scripts/graphify_refresh_manager.py --check     # Exit 0=fresh, 1=stale
    python scripts/graphify_refresh_manager.py --status    # Detailed report
    python scripts/graphify_refresh_manager.py --snapshot  # Save new baseline

Customization:
    Edit THRESHOLDS below to match your repo's change frequency.
    Edit TRACKED_PATTERNS to match your file types.
"""

import argparse
import hashlib
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

# === CUSTOMIZE THESE FOR YOUR REPO ===

THRESHOLDS = {
    "wiki_pages": 3,        # Wiki/doc pages changed before recommending refresh
    "source_modules": 2,    # Source code modules changed
    "domain_files": 1,      # Domain-specific files (e.g., SQL, configs)
    "total_files": 10,      # Total tracked files changed
    "max_age_days": 14,     # Maximum graph age before recommending refresh
}

TRACKED_PATTERNS = {
    "wiki_pages": [
        "knowledge/wiki/*.md",
        "docs/**/*.md",
    ],
    "source_modules": [
        "src/**/*.py",
        "src/**/*.ts",
        "lib/**/*.py",
    ],
    "domain_files": [
        # Add your domain files here, e.g.:
        # "migrations/**/*.sql",
        # "configs/**/*.yaml",
    ],
}

# === END CUSTOMIZATION ===

STATE_FILE = ".graphify_state.json"
GRAPH_DIR = "graphify-out"


def get_repo_root():
    """Find the repository root (where .git lives)."""
    path = Path.cwd()
    while path != path.parent:
        if (path / ".git").exists():
            return path
        path = path.parent
    return Path.cwd()


def hash_file(filepath):
    """Get MD5 hash of file content."""
    try:
        with open(filepath, "rb") as f:
            return hashlib.md5(f.read()).hexdigest()
    except (IOError, OSError):
        return None


def find_tracked_files(repo_root):
    """Find all files matching tracked patterns."""
    import glob as glob_mod

    files = {}
    for category, patterns in TRACKED_PATTERNS.items():
        category_files = []
        for pattern in patterns:
            full_pattern = str(repo_root / pattern)
            matches = glob_mod.glob(full_pattern, recursive=True)
            category_files.extend(matches)
        files[category] = [str(Path(f).relative_to(repo_root)) for f in category_files]
    return files


def load_state(repo_root):
    """Load previous state from JSON file."""
    state_path = repo_root / STATE_FILE
    if state_path.exists():
        with open(state_path) as f:
            return json.load(f)
    return None


def save_state(repo_root, tracked_files):
    """Save current file hashes as new baseline."""
    state = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "hashes": {},
    }

    for category, files in tracked_files.items():
        for filepath in files:
            full_path = repo_root / filepath
            file_hash = hash_file(full_path)
            if file_hash:
                state["hashes"][filepath] = {
                    "hash": file_hash,
                    "category": category,
                }

    state_path = repo_root / STATE_FILE
    with open(state_path, "w") as f:
        json.dump(state, f, indent=2)

    print(f"Baseline saved: {len(state['hashes'])} files tracked")
    print(f"State file: {state_path}")


def get_graph_age(repo_root):
    """Get age of the knowledge graph in days."""
    graph_manifest = repo_root / GRAPH_DIR / "manifest.json"
    graph_html = repo_root / GRAPH_DIR / "graph.html"

    for candidate in [graph_manifest, graph_html]:
        if candidate.exists():
            mtime = datetime.fromtimestamp(
                candidate.stat().st_mtime, tz=timezone.utc
            )
            age = datetime.now(timezone.utc) - mtime
            return age.days, mtime

    return None, None


def compute_changes(repo_root, state, tracked_files):
    """Compare current files against saved baseline."""
    changes = {
        "wiki_pages": 0,
        "source_modules": 0,
        "domain_files": 0,
        "total": 0,
        "details": [],
    }

    if not state:
        # No baseline — everything is "changed"
        for category, files in tracked_files.items():
            changes[category] = len(files)
            changes["total"] += len(files)
        return changes

    saved_hashes = state.get("hashes", {})

    for category, files in tracked_files.items():
        for filepath in files:
            full_path = repo_root / filepath
            current_hash = hash_file(full_path)

            if current_hash is None:
                continue

            saved = saved_hashes.get(filepath)
            if saved is None or saved["hash"] != current_hash:
                changes[category] += 1
                changes["total"] += 1
                changes["details"].append(f"  {category}: {filepath}")

    return changes


def check(repo_root):
    """Quick check: exit 0 if fresh, exit 1 if stale."""
    graph_dir = repo_root / GRAPH_DIR
    if not graph_dir.exists():
        print("No graph found. Run `/graphify .` to build.")
        sys.exit(1)

    state = load_state(repo_root)
    tracked_files = find_tracked_files(repo_root)
    changes = compute_changes(repo_root, state, tracked_files)
    age_days, _ = get_graph_age(repo_root)

    reasons = []

    if changes["wiki_pages"] >= THRESHOLDS["wiki_pages"]:
        reasons.append(
            f"{changes['wiki_pages']} wiki pages changed "
            f"(threshold: {THRESHOLDS['wiki_pages']})"
        )
    if changes["source_modules"] >= THRESHOLDS["source_modules"]:
        reasons.append(
            f"{changes['source_modules']} source modules changed "
            f"(threshold: {THRESHOLDS['source_modules']})"
        )
    if changes["domain_files"] >= THRESHOLDS["domain_files"]:
        reasons.append(
            f"{changes['domain_files']} domain files changed "
            f"(threshold: {THRESHOLDS['domain_files']})"
        )
    if changes["total"] >= THRESHOLDS["total_files"]:
        reasons.append(
            f"{changes['total']} total files changed "
            f"(threshold: {THRESHOLDS['total_files']})"
        )
    if age_days is not None and age_days >= THRESHOLDS["max_age_days"]:
        reasons.append(
            f"Graph is {age_days} days old "
            f"(threshold: {THRESHOLDS['max_age_days']})"
        )

    if reasons:
        print("REFRESH RECOMMENDED")
        for r in reasons:
            print(f"  - {r}")
        sys.exit(1)
    else:
        print("Graph is up-to-date")
        sys.exit(0)


def status(repo_root):
    """Detailed status report."""
    graph_dir = repo_root / GRAPH_DIR

    print("Graphify Status Report")
    print("=" * 60)

    if not graph_dir.exists():
        print("\nNo graph found. Run `/graphify .` to build initial graph.")
        print("=" * 60)
        sys.exit(1)

    state = load_state(repo_root)
    tracked_files = find_tracked_files(repo_root)
    changes = compute_changes(repo_root, state, tracked_files)
    age_days, last_modified = get_graph_age(repo_root)

    print("\nCurrent Graph:")
    file_count = sum(len(f) for f in tracked_files.values())
    print(f"   Files tracked: {file_count}")
    if last_modified:
        print(f"   Last modified: {last_modified.strftime('%Y-%m-%dT%H:%M:%S')}")
        print(f"   Age: {age_days} days")

    if state:
        print(f"\n   Baseline from: {state['timestamp'][:19]}")

    print(f"\nChanges Since Last Refresh:")
    print(f"   Wiki pages: {changes['wiki_pages']}")
    print(f"   Source modules: {changes['source_modules']}")
    print(f"   Domain files: {changes['domain_files']}")
    print(f"   Total: {changes['total']}")

    # Determine if refresh is needed
    reasons = []
    if changes["wiki_pages"] >= THRESHOLDS["wiki_pages"]:
        reasons.append(
            f"{changes['wiki_pages']} wiki pages changed "
            f"(threshold: {THRESHOLDS['wiki_pages']})"
        )
    if changes["source_modules"] >= THRESHOLDS["source_modules"]:
        reasons.append(
            f"{changes['source_modules']} source modules changed "
            f"(threshold: {THRESHOLDS['source_modules']})"
        )
    if changes["domain_files"] >= THRESHOLDS["domain_files"]:
        reasons.append(
            f"{changes['domain_files']} domain files changed "
            f"(threshold: {THRESHOLDS['domain_files']})"
        )
    if changes["total"] >= THRESHOLDS["total_files"]:
        reasons.append(
            f"{changes['total']} total files changed "
            f"(threshold: {THRESHOLDS['total_files']})"
        )
    if age_days is not None and age_days >= THRESHOLDS["max_age_days"]:
        reasons.append(
            f"Graph is {age_days} days old "
            f"(threshold: {THRESHOLDS['max_age_days']})"
        )

    if reasons:
        print(f"\nREFRESH RECOMMENDED")
        print("Reasons:")
        for r in reasons:
            print(f"   - {r}")
        print(f"\nRun: /graphify . --update")
    else:
        print(f"\nUP TO DATE")
        print("No refresh needed at this time.")

    print("=" * 60)


def main():
    parser = argparse.ArgumentParser(
        description="Graphify Refresh Manager — Smart knowledge graph freshness monitoring"
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Quick check: exit 0 if fresh, exit 1 if stale",
    )
    parser.add_argument(
        "--status", action="store_true", help="Detailed status report"
    )
    parser.add_argument(
        "--snapshot",
        action="store_true",
        help="Save current file hashes as new baseline",
    )

    args = parser.parse_args()
    repo_root = get_repo_root()

    if args.snapshot:
        tracked_files = find_tracked_files(repo_root)
        save_state(repo_root, tracked_files)
    elif args.status:
        status(repo_root)
    elif args.check:
        check(repo_root)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
