import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/bellybutton.sqlite"
# db = SQLAlchemy(app)
# # reflect an existing database into a new model
# Base = automap_base()
# # reflect the tables
# Base.prepare(db.engine, reflect=True)
# # Save references to each table
# Samples_Metadata = Base.classes.sample_metadata
# Samples = Base.classes.samples

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/global_db.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
Export = Base.classes.export3
econ = Base.classes.global_econ_heritage





@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

# ////////////////////////////////////
# BELOW WORKS WITH CSV
# ///////////////////////////////////////
# @app.route("/names")
# def names():
#     """Return a list of sample names."""
#     df = pd.read_csv("db/country_trade.csv")


#     # Use Pandas to perform the sql query
#     # stmt = db.session.query(Samples).statement
#     # df = pd.read_sql_query(stmt, db.session.bind)

#     # Return a list of the column names (sample names)
#     # return jsonify(list(df.columns)[1:])
#     return jsonify(list(df["Country"]))



@app.route("/names")
def names():
    """Return a list of sample names."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(Export).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Return a list of the column names (sample names)
    # return jsonify(list(df.columns)[1:])//this was example where samples were the all the column headers
    return jsonify(list(df["country"]))



@app.route("/metadata/balrank")
def get_balance_rank():
    # stmt = db.session.query(Export).statement
    # df   = pd.read_sql_query(stmt, db.session.bind)
    #  results = db.session.query.filter(Export.bal_rank).all()

    results = db.session.query(Export.country, Export.bal_rank).all()
    # results = db.session.query(Export.country, Export.exp_ytd).all()
    #results = db.session.query(Export.exp_ytd).all()

    print('here are the results', results)

    jresults = []


    for result in results:
        # print("here is each result: ",result )
        jdic ={}
        jdic["country"] =result[0]
        jdic["balance_rank"] =result[1]
        jresults.append(jdic)

    return jsonify(jresults)



@app.route("/metadata/<sample>")
def sample_metadata(sample):
    """Return the MetaData for a given sample."""
    # sel = [
    #     Samples_Metadata.sample,
    #     Samples_Metadata.ETHNICITY,
    #     Samples_Metadata.GENDER,
    #     Samples_Metadata.AGE,
    #     Samples_Metadata.LOCATION,
    #     Samples_Metadata.BBTYPE,
    #     Samples_Metadata.WFREQ,
    # ]
    sel = [
            Export.country,
            Export.bal_september,
            Export.bal_ytd	,
            Export.bal_rank	,
            Export.exp_september,
            Export.exp_ytd	,
            Export.exp_rank	,
            Export.september_cus,
            Export.ytd_cus	,
         ]



    # results = db.session.query(*sel).filter(Samples_Metadata.sample == sample).all()

    results = db.session.query(*sel).filter(Export.country == sample).all()

    print("here are the results for country names", results)

    
    #///////////////////////////////////////////////////
    #//// this works with csv below ////
    # df = pd.read_csv("db/country_trade.csv")
    # df2= df.loc[df["Country"] == sample, : ] 
    # data = df2.set_index("Country")   
    ## print("this is the data")
    ##print(data)

    # sample_metadata = {
    #                      "Country" : sample,
    #                      "Balance Rank": data.iloc[0,2],
    #                      "Export Year To date" :  data.iloc[0,4],

    #                    }
    #///////////////////////////////////////////////////

    # Create a dictionary entry for each row of metadata information
    sample_metadata = {}


    for result in results:
        print("here is each result: ",result )
        sample_metadata["Country"] = result[0]
        sample_metadata["Balance September"] = result[1]
        sample_metadata["Balance Year To Date"] = result[2]
        sample_metadata["Balance Rank"] = result[3]
        sample_metadata["Exports For September 2019"] = result[4]
        sample_metadata["Exports Year To Date 2019"] = result[5]
        sample_metadata["Export Rank"] = result[6]
        sample_metadata["September CUS"] = result[7]
        sample_metadata["Year To Date CUS"] = result[8]

    print("here is the data", sample_metadata)
    return jsonify(sample_metadata)




# @app.route("/samples/<sample>")
# def samples(sample):
#     """Return `otu_ids`, `otu_labels`,and `sample_values`."""
#     # stmt = db.session.query(Samples).statement
#     # df = pd.read_sql_query(stmt, db.session.bind)

#     df = pd.read_csv("db/country_trade.csv")

#     # Filter the data based on the sample number and
#     # only keep rows with values above 1
#     sample_data = df.loc[df[sample] > 1, ["Year-to-Date:IMP:CFI", "Country", sample]]

#     # Sort by sample
#     sample_data.sort_values(by=sample, ascending=False, inplace=True)

#     # Format the data to send as json
#     data = {
#         "otu_ids": sample_data.otu_id.values.tolist(),
#         "sample_values": sample_data[sample].values.tolist(),
#         "otu_labels": sample_data.otu_label.tolist(),
#           }
#     return jsonify(data)


if __name__ == "__main__":
    app.run()
   # logictest.run()
