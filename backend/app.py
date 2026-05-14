from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
import pandas as pd
import bcrypt
import jwt
import datetime

app = Flask(__name__)
CORS(app)

# =========================
# MySQL Configuration
# =========================

app.config['MYSQL_HOST'] = 'yamanote.proxy.rlwy.net'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'bHMnfVXWXyARMHGkXaNEYFkoFffZtQgn'
app.config['MYSQL_DB'] = 'railway'
app.config['MYSQL_PORT'] = 37733

mysql = MySQL(app)

# =========================
# Secret Key
# =========================

app.config['SECRET_KEY'] = 'travel_secret_key'

# =========================
# Load Excel Dataset
# =========================

df = pd.read_excel('travel_dataset.xlsx')

# =========================
# Signup Route
# =========================

@app.route('/signup', methods=['POST'])
def signup():

    data = request.json

    username = data['username']
    email = data['email']
    password = data['password']

    hashed_password = bcrypt.hashpw(
        password.encode('utf-8'),
        bcrypt.gensalt()
    ).decode('utf-8')

    cursor = mysql.connection.cursor()

    cursor.execute(
        '''
        INSERT INTO users(username, email, password)
        VALUES(%s, %s, %s)
        ''',
        (username, email, hashed_password)
    )

    mysql.connection.commit()

    cursor.close()

    return jsonify({
        'message': 'Signup successful'
    })

# =========================
# Login Route
# =========================

@app.route('/login', methods=['POST'])
def login():

    data = request.json

    email = data['email']
    password = data['password']

    cursor = mysql.connection.cursor()

    cursor.execute(
        'SELECT * FROM users WHERE email=%s',
        (email,)
    )

    user = cursor.fetchone()

    cursor.close()

    if user:

        stored_password = user[3]

        if bcrypt.checkpw(
            password.encode('utf-8'),
            stored_password.encode('utf-8')
        ):

            token = jwt.encode(
                {
                    'user_id': user[0],
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
                },
                app.config['SECRET_KEY'],
                algorithm='HS256'
            )

            return jsonify({
                'token': token,
                'username': user[1]
            })

    return jsonify({
        'message': 'Invalid credentials'
    }), 401

# =========================
# Recommendation Route
# =========================

@app.route('/recommend', methods=['POST'])
def recommend():

    data = request.json

    state = data['state']
    rating = float(data['rating'])
    max_budget = float(data['maxBudget'])
    limit = int(data['limit'])

    filtered = df[
        (df['State/UT'] == state) &
        (df['Rating_Out_of_10'] >= rating) &
        (df['Average_Budget_Per_Day_INR'] <= max_budget)
    ]

    result = filtered.head(limit)

    final_result = []

    for _, row in result.iterrows():

        final_result.append({

            'City': row['City'],
            'State/UT': row['State/UT'],
            'Average_Budget_Per_Day_INR': row['Average_Budget_Per_Day_INR'],
            'Rating_Out_of_10': row['Rating_Out_of_10'],
            'Description': row['Description']

        })

    return jsonify(final_result)


# =========================
# Add Favorite Route
# =========================

@app.route('/add_favorite', methods=['POST'])
def add_favorite():

    data = request.json

    token = data['token']
    city = data['city']
    state = data['state']

    decoded = jwt.decode(
        token,
        app.config['SECRET_KEY'],
        algorithms=['HS256']
    )

    user_id = decoded['user_id']

    cursor = mysql.connection.cursor()

    # Check already exists

    cursor.execute(
        '''
        SELECT * FROM favorites
        WHERE user_id=%s AND city_name=%s
        ''',
        (user_id, city)
    )

    existing = cursor.fetchone()

    if existing:

        cursor.close()

        return jsonify({
            'message': 'Already added to wishlist'
        })

    # Insert new favorite

    cursor.execute(
        '''
        INSERT INTO favorites(user_id, city_name, state_name)
        VALUES(%s, %s, %s)
        ''',
        (user_id, city, state)
    )

    mysql.connection.commit()

    cursor.close()

    return jsonify({
        'message': 'Added to favorites'
    })

# =========================
# Get Favorites Route
# =========================

@app.route('/favorites', methods=['POST'])
def favorites():

    data = request.json

    token = data['token']

    decoded = jwt.decode(
        token,
        app.config['SECRET_KEY'],
        algorithms=['HS256']
    )

    user_id = decoded['user_id']

    cursor = mysql.connection.cursor()

    cursor.execute(
        '''
        SELECT city_name, state_name
        FROM favorites
        WHERE user_id=%s
        ''',
        (user_id,)
    )

    favorites = cursor.fetchall()

    final_data = []

    for item in favorites:

        final_data.append({

            'city': item[0],
            'state': item[1]

        })

    cursor.close()

    return jsonify(final_data)


# =========================
# Run App
# =========================

if __name__ == '__main__':
    app.run(debug=True)