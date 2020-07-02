from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo
import json
from bson import json_util
from bson.json_util import dumps

app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = "mongodb+srv://queryuser:7pvrLAd50bbn@cluster0-pkkni.mongodb.net/Covid_DB?retryWrites=true&w=majority"
mongo = PyMongo(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/maps")
def maps():
    return render_template("maps.html")

@app.route("/diseases")
def diseases():
    return render_template("Diseases.html")

# DATA CALLS
@app.route("/deaths_gender")
def cases_gender():
    return convjson(mongo.db.genero_difuntos.find())

@app.route("/cases_gender")
def deaths_gender():
    return convjson(mongo.db.genero_casos.find())

@app.route("/hosp_cap")
def hosp_cap():
    return convjson(mongo.db.capacidad_hospitalaria.find())

@app.route("/case_date")
def case_date():
    return convjson(mongo.db.casos_fecha_ingreso.find())

@app.route("/case_del_date")
def case_del_date():
    return convjson(mongo.db.casos_delegacion_fecha.find())

@app.route("/case_afluencia")
def case_afluencia():
    return convjson(mongo.db.casos_vs_afluencia_diaria.find())

@app.route("/diseases_count")
def diseases_count():
    return convjson(mongo.db.enfermedades.find())

@app.route("/diseases_gender")
def diseases_count():
    return convjson(mongo.db.enfermedades_genero.find())

@app.route("/diseases_age")
def diseases_count():
    return convjson(mongo.db.enfermedades_edades.find())

def convjson(data):
    dataset = data
    json_projects = []
    for element in dataset:
        json_projects.append(element)
    json_projects = json.dumps(json_projects, default=json_util.default)
    return json_projects

if __name__ == "__main__":
    app.run(debug=True)