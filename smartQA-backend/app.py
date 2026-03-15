from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)   # ✅ create app FIRST
CORS(app)               # ✅ enable CORS AFTER app exists

@app.route("/ask", methods=["POST"])
def ask():

    data = request.json
    question = data.get("question")
    dataset = data.get("data")

    chart_type = "Bar Chart"
    category = "category"
    measure = "value"

    insight = f"""
Recommended Visualization: {chart_type}
Dataset rows received: {len(dataset)}
"""

    return jsonify({
        "chart": chart_type,
        "category": category,
        "measure": measure,
        "insight": insight
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)