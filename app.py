from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo
import json
from bson import json_util
from bson.json_util import dumps

app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/Covid_DB"
mongo = PyMongo(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/maps")
def maps():
    return render_template("maps.html")

@app.route("/diseases")
def diseases():
    return render_template("diseases.html")

@app.route("/genders")
def genders():
    gender = mongo.db.gender.find()
    json_projects = []
    for element in gender:
        json_projects.append(element)
    json_projects = json.dumps(json_projects, default=json_util.default)
    return json_projects

@app.route("/cases_MF")
def cases_MF():
    gender = mongo.db.cases_MF.find()
    json_projects = []
    for element in gender:
        json_projects.append(element)
    json_projects = json.dumps(json_projects, default=json_util.default)
    return json_projects

if __name__ == "__main__":
    app.run(debug=True)