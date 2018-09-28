import pandas as pd 
from flask import Flask, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def data():
    data = pd.read_csv('data/data.csv')
    return jsonify(data.to_dict(orient='records'))

if __name__ == "__main__":
    app.run(debug=True)
