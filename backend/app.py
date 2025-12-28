from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import re
import mysql.connector
from datetime import date

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="password",
    database="mcd_feedback",
    auth_plugin="mysql_native_password"
)

cursor = db.cursor(dictionary=True)

@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route("/feedback", methods=["POST"])
def submit_feedback():
    data = request.form

    name = data.get("name")
    phone = data.get("phone")
    email = data.get("email")

    if name.lower() in ["aaa", "xyz", "pqr"]:
        return jsonify({"error": "Invalid name"}), 400

    if re.match(r"(1234567890|9876543210)", phone):
        return jsonify({"error": "Invalid phone"}), 400

    image = request.files.get("image")
    if not image:
       return jsonify({"error": "Image is required"}), 400
    image.save(os.path.join(UPLOAD_FOLDER, image.filename))

    cursor.execute("SELECT COUNT(*) AS count FROM feedback WHERE date = CURDATE()")
    serial = cursor.fetchone()["count"] + 1

    sql = """
    INSERT INTO feedback
    (serial_no, name, phone, email, time_slot, food, image, date)
    VALUES (%s,%s,%s,%s,%s,%s,%s,CURDATE())
    """


    cursor.execute(sql, (
        serial,
        name,
        phone,
        email,
        data.get("time_slot"),
        ",".join(request.form.getlist("food")),
        image.filename
))


    db.commit()

    return jsonify({"message": "Thank you for your feedback!"})
@app.route("/feedback-list", methods=["GET"])
def feedback_list():
    cursor.execute("""
        SELECT serial_no, name, phone, email, time_slot, food, image
        FROM feedback
        ORDER BY id DESC
    """)
    rows = cursor.fetchall()

    result = []
    for row in rows:
        result.append({
            "serial_no": row["serial_no"],
            "name": row["name"],
            "phone": row["phone"],
            "email": row["email"],
            "time_slot": row["time_slot"],
            "food": row["food"],
            "image_url": f"http://127.0.0.1:9000/uploads/{row['image']}"

        })

    return jsonify(result)

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=9000,
        debug=True
    )


