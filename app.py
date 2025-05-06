from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import json
import os

app = Flask(__name__,static_folder='static')
# Path to JSON data file
CORS(app)

DATA_FILE = os.path.join("data", "bus_data.json")

# Load bus data from JSON
def load_bus_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as file:
            return json.load(file)
    return []

# Serve frontend HTML
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about.html')
def about():
    return render_template('about.html')  # Ensure the template is correctly referenced here


# API to search for buses based on start and destination
@app.route("/search_bus", methods=["GET"])
def search_bus():
    start = request.args.get("start", "").strip().lower()
    destination = request.args.get("destination", "").strip().lower()

    if not start or not destination:
        return jsonify({"error": "Please enter both start and destination locations."}), 400

    data = load_bus_data()
    filtered_buses = [bus for bus in data if bus["start"].lower() == start and bus["destination"].lower() == destination]

    if filtered_buses:
        return jsonify(filtered_buses)
    return jsonify({"message": "No buses found for this route."})

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
