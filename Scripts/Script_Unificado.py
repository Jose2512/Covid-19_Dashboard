import pandas as pd
import numpy as np
import pymongo

myclient = pymongo.MongoClient("mongodb+srv://teamcovid:projecttwo@cluster0-pkkni.mongodb.net/Covid_DB?retryWrites=true&w=majority")

#DATABASE
covid = myclient.Covid_DB

file_to_load = "../../Resources/casos-asociados-a-covid-19.csv"

covid_cases_data = pd.read_csv(file_to_load)

file_to_load = "../../Resources/capacidad-hospitalaria.csv"

capacidad_hospitalaria = pd.read_csv(file_to_load)

file_to_load = "../../Resources/afluencia-preliminar-en-transporte-publico.csv"

daily_transport_data = pd.read_csv(file_to_load)

clean_covid_data = covid_cases_data[covid_cases_data["positivo"]=="Positivo SARS-CoV-2"]
clean_covid_data = clean_covid_data[["ID_REGISTRO","SEXO","MUNICIPIO RESIDENCIA","FECHA INGRESO", "FECHA DEFUNCION","INTUBADO","EDAD","DIABETES","EPOC","ASMA","INMUNOSUPRESION","HIPERTENSION","CARDIOVASCULAR","OBESIDAD","RENAL CRONICA","TABAQUISMO"]]
clean_covid_data = clean_covid_data.fillna("NO")

capacidad_hospitalaria_limpia = capacidad_hospitalaria[capacidad_hospitalaria["Fecha"]==capacidad_hospitalaria["Fecha"].iloc[-1]].reset_index().drop(columns=["index"])
capacidad_hospitalaria_limpia = capacidad_hospitalaria_limpia[capacidad_hospitalaria_limpia["Estatus_capacidad_hospitalaria"]!="Sin dato"]
coordenadas = capacidad_hospitalaria_limpia["Coordenadas"].str.split(",", n = 1, expand = True) 
capacidad_hospitalaria_limpia["Lat"]= coordenadas[0] 
capacidad_hospitalaria_limpia["Lon"]= coordenadas[1] 
capacidad_hospitalaria_limpia.drop(columns =["Coordenadas"], inplace = True) 

# pd.DataFrame.to_csv(capacidad_hospitalaria_limpia,'../assets/data/capacidad_hospitalaria.csv',encoding='latin1')
# capacidad_hospitalaria_limpia.to_json('../assets/data/capacidad_hospitalaria.json',orient='records')

#COLLECTION
capacidad_hospitalaria=covid.capacidad_hospitalaria
capacidad_hospitalaria.drop()
data_dict = capacidad_hospitalaria_limpia.to_dict("records")

for record in data_dict:
    capacidad_hospitalaria.insert_one(record)
    

delegacion_fecha = clean_covid_data.groupby(["FECHA INGRESO","MUNICIPIO RESIDENCIA"]).count().reset_index().rename(columns={'ID_REGISTRO':'CASOS','FECHA INGRESO':'FECHA'}).drop(['SEXO','FECHA DEFUNCION','INTUBADO','EDAD','DIABETES','EPOC','ASMA','INMUNOSUPRESION','HIPERTENSION','CARDIOVASCULAR','OBESIDAD','RENAL CRONICA','TABAQUISMO'],axis=1)
delegacion_fecha = delegacion_fecha[delegacion_fecha["MUNICIPIO RESIDENCIA"] != "NO"]
# delegacion_fecha

# pd.DataFrame.to_csv(delegacion_fecha,'../assets/data/casos_delegacion_fecha.csv',encoding='latin1')
# delegacion_fecha.to_json('../assets/data/casos_delegacion_fecha.json',orient='records')

#COLLECTION
casos_delegacion_fecha=covid.casos_delegacion_fecha
casos_delegacion_fecha.drop()
data_dict = delegacion_fecha.to_dict("records")

for record in data_dict:
    casos_delegacion_fecha.insert_one(record)
    


cases_per_date = clean_covid_data.copy()
cases_per_date = cases_per_date.groupby(['FECHA INGRESO']).count().reset_index().rename(columns={'FECHA INGRESO':'FECHA','ID_REGISTRO':'CASOS_TOTALES'}).drop(['SEXO','FECHA DEFUNCION','MUNICIPIO RESIDENCIA','INTUBADO','EDAD','DIABETES','EPOC','ASMA','INMUNOSUPRESION','HIPERTENSION','CARDIOVASCULAR','OBESIDAD','RENAL CRONICA','TABAQUISMO'],axis=1)


casos_fecha_mujeres = clean_covid_data.copy()
casos_fecha_mujeres = casos_fecha_mujeres[casos_fecha_mujeres["SEXO"]=="MUJER"]
casos_fecha_mujeres = casos_fecha_mujeres.groupby(['FECHA INGRESO']).count().reset_index().rename(columns={'FECHA INGRESO':'FECHA','ID_REGISTRO':'CASOS_MUJERES'}).drop(['SEXO','FECHA DEFUNCION','MUNICIPIO RESIDENCIA','INTUBADO','EDAD','DIABETES','EPOC','ASMA','INMUNOSUPRESION','HIPERTENSION','CARDIOVASCULAR','OBESIDAD','RENAL CRONICA','TABAQUISMO'],axis=1)


casos_fecha_hombres = clean_covid_data.copy()
casos_fecha_hombres = casos_fecha_hombres[casos_fecha_hombres["SEXO"]=="HOMBRE"]
casos_fecha_hombres = casos_fecha_hombres.groupby(['FECHA INGRESO']).count().reset_index().rename(columns={'FECHA INGRESO':'FECHA','ID_REGISTRO':'CASOS_HOMBRES'}).drop(['SEXO','FECHA DEFUNCION','MUNICIPIO RESIDENCIA','INTUBADO','EDAD','DIABETES','EPOC','ASMA','INMUNOSUPRESION','HIPERTENSION','CARDIOVASCULAR','OBESIDAD','RENAL CRONICA','TABAQUISMO'],axis=1)


casos_diarios_genero = pd.DataFrame.merge(cases_per_date,casos_fecha_mujeres,how='left',on='FECHA')
casos_diarios_genero = pd.DataFrame.merge(casos_diarios_genero,casos_fecha_hombres,how='left',on='FECHA')
casos_diarios_genero = casos_diarios_genero.sort_values(by=["FECHA"],ascending=True).fillna(0)


# pd.DataFrame.to_csv(casos_diarios_genero,'../assets/data/casos_fecha_ingreso.csv',encoding='latin1')
# casos_diarios_genero.to_json('../assets/data/casos_fecha_ingreso.json',orient='records')

#COLLECTION
casos_fecha_ingreso=covid.casos_fecha_ingreso
casos_fecha_ingreso.drop()
data_dict = casos_diarios_genero.to_dict("records")

for record in data_dict:
    casos_fecha_ingreso.insert_one(record)


bins = [-1, 15, 20, 30, 40, 50, 60, 70, 80, 90, 999]
group_labels=['0-15','16-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90','91+']
analisis_genero = clean_covid_data.copy()
analisis_genero["RANGO DE EDAD"] = pd.cut(analisis_genero["EDAD"], bins, labels=group_labels)
analisis_genero = analisis_genero.groupby(['RANGO DE EDAD']).count().drop(['SEXO','FECHA DEFUNCION','MUNICIPIO RESIDENCIA','FECHA INGRESO','INTUBADO','EDAD','DIABETES','EPOC','ASMA','INMUNOSUPRESION','HIPERTENSION','CARDIOVASCULAR','OBESIDAD','RENAL CRONICA','TABAQUISMO'],axis=1).reset_index()
data=[]
generos = ["MUJER","HOMBRE"]
datos = ["CASOS","DIFUNTOS"]
for dato in datos:
    for genero in generos:
        resumen = clean_covid_data.copy()
        if genero != "TODOS":
            resumen = resumen[resumen["SEXO"]==genero]
        if dato == "DIFUNTOS":
            resumen = resumen[resumen["FECHA DEFUNCION"]!="NO"]
        resumen["RANGO DE EDAD"] = pd.cut(resumen["EDAD"], bins, labels=group_labels)
        resumen = resumen.groupby(['RANGO DE EDAD']).count().rename(columns={'ID_REGISTRO':f'{genero} - {dato}'}).drop(['SEXO','FECHA DEFUNCION','MUNICIPIO RESIDENCIA','FECHA INGRESO','INTUBADO','EDAD','DIABETES','EPOC','ASMA','INMUNOSUPRESION','HIPERTENSION','CARDIOVASCULAR','OBESIDAD','RENAL CRONICA','TABAQUISMO'],axis=1).reset_index()
        analisis_genero = pd.DataFrame.merge(analisis_genero,resumen,how='left',on='RANGO DE EDAD')
genero_casos_ = analisis_genero.drop(['ID_REGISTRO','MUJER - DIFUNTOS','HOMBRE - DIFUNTOS'],axis=1).rename(columns={'RANGO DE EDAD':'age','MUJER - CASOS':'female','HOMBRE - CASOS':'male'})
genero_difuntos_ = analisis_genero.drop(['ID_REGISTRO','MUJER - CASOS','HOMBRE - CASOS'],axis=1).rename(columns={'RANGO DE EDAD':'age','MUJER - DIFUNTOS':'female','HOMBRE - DIFUNTOS':'male'})


# genero_casos_.to_json('../assets/data/genero_casos.json',orient='records')
# genero_difuntos_.to_json('../assets/data/genero_difuntos.json',orient='records')

#COLLECTION
genero_casos=covid.genero_casos
genero_casos.drop()
data_dict = genero_casos_.to_dict("records")

for record in data_dict:
    genero_casos.insert_one(record)

#COLLECTION
genero_difuntos=covid.genero_difuntos
genero_difuntos.drop()
data_dict = genero_difuntos_.to_dict("records")

for record in data_dict:
    genero_difuntos.insert_one(record)
    


generos = ["TODOS","MUJER","HOMBRE"]
condiciones = ["TODOS","SIN CONDICION","DIABETES","EPOC","ASMA","INMUNOSUPRESION","HIPERTENSION","CARDIOVASCULAR","OBESIDAD","RENAL CRONICA","TABAQUISMO"]
datos = ["TODOS","INTUBADOS","DIFUNTOS"]
bins = [-1, 15, 20, 30, 40, 50, 60, 70, 80, 90, 999]
group_labels=['0-15','16-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90','91+']
data=[]
for condicion in condiciones:
    for dato in datos:
        for genero in generos:
            resumen = clean_covid_data.copy()
            if genero != "TODOS":
                resumen = resumen[resumen["SEXO"]==genero]
            if condicion != "TODOS":
                if condicion == "SIN CONDICION":
                    resumen = resumen[(resumen['DIABETES']=="NO") & (resumen['TABAQUISMO']=="NO") & (resumen['EPOC']=="NO") & (resumen['ASMA']=="NO") & (resumen['INMUNOSUPRESION']=="NO") & (resumen['HIPERTENSION']=="NO") & (resumen['CARDIOVASCULAR']=="NO") & (resumen['RENAL CRONICA']=="NO") & (resumen['OBESIDAD']=="NO")]
                else:
                    resumen = resumen[resumen[condicion]=="SI"]
            if dato == "INTUBADOS":
                resumen = resumen[resumen["INTUBADO"]=="SI"]
            if dato == "DIFUNTOS":
                resumen = resumen[resumen["FECHA DEFUNCION"]!="NO"]
            resumen["RANGO DE EDAD"] = pd.cut(resumen["EDAD"], bins, labels=group_labels)
            resumen = resumen.groupby(['RANGO DE EDAD']).count().rename(columns={'ID_REGISTRO':f'{genero} - {condicion} - {dato}'}).drop(['SEXO','FECHA DEFUNCION','MUNICIPIO RESIDENCIA','FECHA INGRESO','INTUBADO','EDAD','DIABETES','EPOC','ASMA','INMUNOSUPRESION','HIPERTENSION','CARDIOVASCULAR','OBESIDAD','RENAL CRONICA','TABAQUISMO'],axis=1).reset_index()
            resumen = resumen.transpose()
            resumen = resumen.rename(columns=resumen.iloc[0])
            resumen = resumen.drop(["RANGO DE EDAD"])
            data.append(resumen)
analisis_enfermedades = pd.concat(data)
analisis_enfermedades["TOTAL"] = analisis_enfermedades["0-15"]+analisis_enfermedades["16-20"]+analisis_enfermedades["21-30"]+analisis_enfermedades["31-40"]+analisis_enfermedades["41-50"]+analisis_enfermedades["51-60"]+analisis_enfermedades["61-70"]+analisis_enfermedades["71-80"]+analisis_enfermedades["81-90"]+analisis_enfermedades["91+"]
analisis_enfermedades = analisis_enfermedades.rename_axis("Grupo").reset_index()
separado = analisis_enfermedades["Grupo"].str.split(" - ", n = 2, expand = True) 
analisis_enfermedades["CONDICION"]= separado[1]
analisis_enfermedades["DATO"]= separado[2]
analisis_enfermedades["GENERO"]= separado[0]
analisis_enfermedades.drop(columns =["Grupo"], inplace = True)
analisis_enfermedades = analisis_enfermedades[['CONDICION','DATO','GENERO','0-15','16-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90','91+','TOTAL']]

# pd.DataFrame.to_csv(analisis_enfermedades,'../assets/data/enfermedades.csv',encoding='latin1')
# analisis_enfermedades.to_json('../assets/data/enfermedades.json',orient='records')

#COLLECTION
enfermedades=covid.enfermedades
enfermedades.drop()
data_dict = analisis_enfermedades.to_dict("records")

for record in data_dict:
    enfermedades.insert_one(record)


afluencia_total_diaria = daily_transport_data.rename(columns={'AFLUENCIA TOTAL\n(cifras preliminares)':'AFLUENCIA TOTAL'})[["FECHA","AFLUENCIA TOTAL"]]
afluencia_total_diaria = afluencia_total_diaria.groupby(["FECHA"]).sum()
casos_afluencia_diaria = pd.DataFrame.merge(cases_per_date,afluencia_total_diaria,how='left',on='FECHA')


# pd.DataFrame.to_csv(casos_afluencia_diaria,'../assets/data/casos_vs_afluencia_diaria.csv',encoding='latin1')
# casos_afluencia_diaria.to_json('../assets/data/casos_vs_afluencia_diaria.json',orient='records')

#COLLECTION
casos_vs_afluencia_diaria=covid.casos_vs_afluencia_diaria
casos_vs_afluencia_diaria.drop()
data_dict = casos_afluencia_diaria.to_dict("records")

for record in data_dict:
    casos_vs_afluencia_diaria.insert_one(record)

generos = ["TODOS","MUJER","HOMBRE"]
condiciones = ["TODOS","SIN_CONDICION","DIABETES","EPOC","ASMA","INMUNOSUPRESION","HIPERTENSION","CARDIOVASCULAR","OBESIDAD","RENAL_CRONICA","TABAQUISMO"]
datos = ["TODOS","INTUBADOS","DIFUNTOS"]
bins = [-1, 15, 20, 30, 40, 50, 60, 70, 80, 90, 999]
group_labels=['0-15','16-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90','91+']
enfermedades_edades = pd.DataFrame(columns=['RANGO_DE_EDAD'], data=group_labels)
for condicion in condiciones:
    resumen = clean_covid_data.rename(columns={'FECHA INGRESO':'FECHA_INGRESO','RENAL CRONICA':'RENAL_CRONICA'}).copy()
    if condicion != "TODOS":
        if condicion == "SIN_CONDICION":
            resumen = resumen[(resumen['DIABETES']=="NO") & (resumen['TABAQUISMO']=="NO") & (resumen['EPOC']=="NO") & (resumen['ASMA']=="NO") & (resumen['INMUNOSUPRESION']=="NO") & (resumen['HIPERTENSION']=="NO") & (resumen['CARDIOVASCULAR']=="NO") & (resumen['RENAL_CRONICA']=="NO") & (resumen['OBESIDAD']=="NO")]
        else:
            resumen = resumen[resumen[condicion]=="SI"]
    resumen["RANGO_DE_EDAD"] = pd.cut(resumen["EDAD"], bins, labels=group_labels)
    resumen = resumen.groupby(['RANGO_DE_EDAD']).count().drop(['SEXO','FECHA DEFUNCION','MUNICIPIO RESIDENCIA','FECHA_INGRESO','INTUBADO','EDAD','DIABETES','EPOC','ASMA','INMUNOSUPRESION','HIPERTENSION','CARDIOVASCULAR','OBESIDAD','RENAL_CRONICA','TABAQUISMO'],axis=1).rename(columns={'ID_REGISTRO':f'{condicion}'}).reset_index()
    enfermedades_edades = enfermedades_edades.merge(resumen, how='left', on='RANGO_DE_EDAD')
enfermedades__edades = enfermedades_edades

#COLLECTION
enfermedades_edades=covid.enfermedades_edades
enfermedades_edades.drop()
data_dict = enfermedades__edades.to_dict("records")

for record in data_dict:
    enfermedades_edades.insert_one(record)

generos = ["TODOS","MUJER","HOMBRE"]
condiciones = ["TODOS","SIN_CONDICION","DIABETES","EPOC","ASMA","INMUNOSUPRESION","HIPERTENSION","CARDIOVASCULAR","OBESIDAD","RENAL_CRONICA","TABAQUISMO"]
datos = ["TODOS","INTUBADOS","DIFUNTOS"]
enfermedades_genero = pd.DataFrame(columns=['SEXO'], data=clean_covid_data['SEXO'].unique().tolist())
for condicion in condiciones:
    resumen = clean_covid_data.rename(columns={'FECHA INGRESO':'FECHA_INGRESO','RENAL CRONICA':'RENAL_CRONICA'}).copy()
    if condicion != "TODOS":
        if condicion == "SIN_CONDICION":
            resumen = resumen[(resumen['DIABETES']=="NO") & (resumen['TABAQUISMO']=="NO") & (resumen['EPOC']=="NO") & (resumen['ASMA']=="NO") & (resumen['INMUNOSUPRESION']=="NO") & (resumen['HIPERTENSION']=="NO") & (resumen['CARDIOVASCULAR']=="NO") & (resumen['RENAL_CRONICA']=="NO") & (resumen['OBESIDAD']=="NO")]
        else:
            resumen = resumen[resumen[condicion]=="SI"]
    resumen = resumen.groupby(['SEXO']).count().drop(['FECHA DEFUNCION','MUNICIPIO RESIDENCIA','FECHA_INGRESO','INTUBADO','EDAD','DIABETES','EPOC','ASMA','INMUNOSUPRESION','HIPERTENSION','CARDIOVASCULAR','OBESIDAD','RENAL_CRONICA','TABAQUISMO'],axis=1).rename(columns={'ID_REGISTRO':f'{condicion}'}).reset_index()
    enfermedades_genero = enfermedades_genero.merge(resumen, how='left', on='SEXO')
enfermedades_genero = enfermedades_genero.rename(columns={'SEXO':'CONDICION'}).transpose().reset_index()
enfermedades_genero = enfermedades_genero.rename(columns=enfermedades_genero.iloc[0])
enfermedades_genero = enfermedades_genero.drop([0])
enfermedades__genero = enfermedades_genero

#COLLECTION
enfermedades_genero=covid.enfermedades_genero
enfermedades_genero.drop()
data_dict = enfermedades__genero.to_dict("records")

for record in data_dict:
    enfermedades_genero.insert_one(record)