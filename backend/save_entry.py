import json
from datetime import datetime
from pathlib import Path

DATA_FILE = Path(__file__).parent / "reflections.json"

def load_entries():
    if not DATA_FILE.exists():
        return []
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except json.JSONDecodeError:
        return []

def save_entries(entries):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(entries, f, indent=2, ensure_ascii=False)

def main():
    print("=== Learning Journal (Python -> JSON) ===")
    reflection = input("Type your reflection: ").strip()

    if not reflection:
        print("❌ Reflection cannot be empty.")
        return

    now = datetime.now()
    entry = {
        "id": int(now.timestamp()),
        "date": now.strftime("%Y-%m-%d"),
        "time": now.strftime("%H:%M"),
        "reflection": reflection
    }

    entries = load_entries()
    entries.append(entry)
    save_entries(entries)

    print(f"✅ Saved entry. Total entries: {len(entries)}")
    print(f"File updated: {DATA_FILE}")

if __name__ == "__main__":
    main()
