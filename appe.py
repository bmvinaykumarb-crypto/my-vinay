from flask import Flask, render_template, request, jsonify, abort
from flask_mail import Mail, Message

app = Flask(__name__)

# --- Email configuration (fill in later) ---
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'youremail@gmail.com'
app.config['MAIL_PASSWORD'] = 'your-16-char-app-password'
app.config['MAIL_DEFAULT_SENDER'] = 'youremail@gmail.com'

mail = Mail(app)

# --- Project data ---
# Add/edit your real projects here. 'id' must be unique.
projects = [
    {
        "id": 1,
        "title": "SMART ATTADENCE SYSTEM",
        "short_desc": " A Smart Attadence System is build for upgrading from old book and paper style attadence or manual attadence enterig and this project is smarter one because it as  live 'face scanning' and 'qr code scanner'",
        "full_desc": """web-based applications using modern technologies. His technical skills used include: Python, Flask, HTML, CSS, JavaScript, SQL, CSV handling, and basic database management. He enjoys learning new technologies and applying them to solve real-world problems.
        Technical Skills:=
        Python Programming,Flask Framework,HTML5,CSS3,JavaScript,SQL Database,CSV File Handling,Web Development,Database Management,Basic Computer Vision Concepts and hear the main working is hear is core engine of this project whare opencv which runs the lively face scanner whare it decate the face  and  it converts the face into an 128d binary code  and it binnary code mataches user must blink the eys the it takes the attadence and other option for porting attadence is QR code scanner whare student must regester thair name and rollnumber by this it generates one qrcode which is used to put attendence using qrscanner.
        """,
        "tech": ["Python","pandas", "HTML", "CSS","CSV","STREAMLIT"],
        "image": "pp.png",
        "live_link": "http://localhost:8501/",
        "github_link": "#"
    },
    {
        "id": 2,
        "title": "Project Name Two",
        "short_desc": "Short description of what the project does.",
        "full_desc": "A longer, detailed explanation of the project — what problem it solves, how you built it, and what you learned.",
        "tech": ["JavaScript", "React", "Node.js"],
        "image": "project2.jpg",
        "live_link": "#",
        "github_link": "#"
    },
    {
        "id": 3,
        "title": "Project Name Three",
        "short_desc": "Short description of what the project does.",
        "full_desc": "A longer, detailed explanation of the project — what problem it solves, how you built it, and what you learned.",
        "tech": ["Python", "Pandas", "SQL"],
        "image": "project3.jpg",
        "live_link": "#",
        "github_link": "#"
    },
]

@app.route('/')
def home():
    return render_template('index.html', projects=projects)

@app.route('/project/<int:project_id>')
def project_detail(project_id):
    project = next((p for p in projects if p["id"] == project_id), None)
    if project is None:
        abort(404)
    return render_template('project.html', project=project)

@app.route('/send-message', methods=['POST'])
def send_message():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    if not name or not email or not message:
        return jsonify(success=False, error="All fields are required."), 400

    try:
        msg = Message(
            subject=f"New portfolio message from {name}",
            recipients=['youremail@gmail.com'],
            body=f"From: {name} ({email})\n\n{message}"
        )
        mail.send(msg)
        return jsonify(success=True)
    except Exception as e:
        return jsonify(success=False, error=str(e)), 500

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run(debug=True, port=5050)