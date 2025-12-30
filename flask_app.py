from flask import Flask, request, jsonify, render_template
import os, json
from datetime import datetime

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "backend")
DATA_FILE = os.path.join(DATA_DIR, "reflections.json")

def ensure_data_file():
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump([], f, indent=2)

def load_reflections():
    ensure_data_file()
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_reflections(reflections):
    ensure_data_file()
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(reflections, f, indent=2, ensure_ascii=False)

# ---------- Pages ----------
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/journal")
def journal():
    return render_template("journal.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/projects")
def projects():
    return render_template("projects.html")

@app.route("/offline")
def offline():
    return render_template("offline.html")



# ---------- API Routes (Lab 6 Required) ----------
@app.route("/reflections", methods=["GET"])
def get_reflections():
    return jsonify(load_reflections())

@app.route("/add_reflection", methods=["POST"])
def add_reflection():
    data = request.get_json(force=True) or {}
    name = (data.get("name") or "").strip()
    reflection = (data.get("reflection") or "").strip()

    if name == "":
        return jsonify({"error": "Name is required."}), 400
    if len(reflection) < 10:
        return jsonify({"error": "Reflection must be at least 10 characters."}), 400

    reflections = load_reflections()

    new_entry = {
        "id": int(datetime.now().timestamp() * 1000),
        "name": name,
        "date": datetime.now().strftime("%a %b %d %Y"),
        "time": datetime.now().strftime("%H:%M"),
        "reflection": reflection
    }

    reflections.append(new_entry)
    save_reflections(reflections)
    return jsonify(new_entry), 201


# ---------- Extra Feature (Lab 6 Extra Backend Feature) ----------
@app.route("/delete_reflection/<int:entry_id>", methods=["DELETE"])
def delete_reflection(entry_id):
    reflections = load_reflections()
    updated = [r for r in reflections if r.get("id") != entry_id]

    if len(updated) == len(reflections):
        return jsonify({"error": "Reflection not found."}), 404

    save_reflections(updated)
    return jsonify({"deleted": entry_id}), 200


if __name__ == "__main__":
    app.run(debug=True)
