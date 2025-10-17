from flask import Flask
from flask_cors import CORS


app = Flask (__name__)
CORS(app) #Enable CORS on ALL Routes


@app.route('/')
def hello_world():
    return'Hello, World!'

@app.route('/api/users')
def get_users():
    return{
        'users':['Alice','Bob','Charlie']
    }

@app.route
def get_fruits():
    return{
        'fruits':['Apple','Bananna','Cherry']
    }



if __name__ == '__main__':
    app.run(debug=True)