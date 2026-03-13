from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import json
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'ablaze_luxe_secret_key'

DATA_FILE = 'data/bookings.json'

if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)

def get_data():
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/booking')
def booking_page():
    return render_template('booking.html')

@app.route('/booking_submit', methods=['POST'])
def booking_submit():
    data = get_data()
    new_booking = {
        'id': len(data) + 1,
        'name': request.form.get('name'),
        'email': request.form.get('email'),
        'phone': request.form.get('phone'),
        'service': request.form.get('service'),
        'date': request.form.get('date'),
        'status': 'pending',
        'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    data.append(new_booking)
    save_data(data)
    return jsonify({"status": "success", "message": "Your experience is being prepared."})

@app.route('/admin')
def admin():
    if not session.get('logged_in'):
        return render_template('login.html')
    bookings = get_data()
    return render_template('admin.html', bookings=bookings)

@app.route('/login', methods=['POST'])
def login():
    if request.form.get('password') == 'admin123':
        session['logged_in'] = True
        return redirect(url_for('admin'))
    return "Unauthorized", 401

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('index'))

@app.route('/admin/update_status/<int:booking_id>', methods=['POST'])
def update_status(booking_id):
    if not session.get('logged_in'):
        return jsonify({"status": "error"}), 401
    
    data = get_data()
    for b in data:
        if b['id'] == booking_id:
            b['status'] = request.form.get('status')
            break
    save_data(data)
    return redirect(url_for('admin'))

if __name__ == '__main__':
    app.run(debug=True, port=5080)
