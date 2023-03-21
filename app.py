# Import flask and datetime module for showing date and time
from flask import Flask, request, Response, jsonify
import datetime
import matplotlib.pyplot as plt
from models import User, UserError
from deepface import DeepFace

  
# Initializing flask app
app = Flask(__name__)

def invalid_request(msg = "Invalid request"):
    return Response("Invalid request",status=403)

# Route for seeing a data
@app.route('/compare',methods=['POST','GET'])

def compare_faces():
    print("started...")
    if request.method == "GET":
        return invalid_request()
    username = request.json.get("username",None)

    if not username:
        return invalid_request()
    
    try:
        user = User(username)
        img1= user.get_face_image()
    except UserError as e:
        return invalid_request(jsonify(e.to_dict()))

    if not img1:
        return invalid_request("No face image found for the provided username!")
    img2=request.json.get("face")

    models = ["VGG-Face", "Facenet", "OpenFace", "DeepFace", "DeepID", "Dlib", "ArcFace"]
    detectors = ["opencv", "ssd", "mtcnn", "dlib", "retinaface"]

    verified=DeepFace.verify(img1_path=img1,img2_path=img2,model_name=models[0],detector_backend = detectors[0],distance_metric='cosine')
    
    print({
        "verified": verified.get('verified'),
        "distance": verified.get('distance'),
    })
    print("--------------- End -----------------")
    return verified


  
# Running app
if __name__ == '__main__':
    port = 5001
    app.run(port=port)
