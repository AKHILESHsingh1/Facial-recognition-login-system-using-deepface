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



    

# def compare_base64_images(img1, img2):
#     # Decode the base64 encoded images
#     img1_bytes = base64.b64decode(img1)
#     img2_bytes = base64.b64decode(img2)
    
#     # Convert the bytes to numpy arrays
#     img1 = np.frombuffer(img1_bytes, np.uint8)
#     img2 = np.frombuffer(img2_bytes, np.uint8)
    
#     # Convert the numpy arrays to OpenCV images
#     img1 = cv2.imdecode(img1, cv2.IMREAD_GRAYSCALE)
#     img2 = cv2.imdecode(img2, cv2.IMREAD_GRAYSCALE)
    
#     # Compare the two images using OpenCV
#     ssim = cv2.quality.StructuralSimilarity(cv2.quality.QualityBase.BRISQUE)
#     similarity = ssim.compute(img1, img2)
    
#     # Return the result of the comparison
#     return similarity





    # # opencv(openFace, deepface,    not working




    # # Decode the image from base64 to binary
    # known_image= face_recognition.load_image_file(image1_encoded)

    # # Load the image of the person that is being verified
    # unknown_image = face_recognition.load_image_file(image2_encoded)


    # # Get the face encodings of the known and unknown images
    # known_encoding = face_recognition.face_encodings(known_image)[0]
    # unknown_encoding = face_recognition.face_encodings(unknown_image)[0]

    # # Compare the face encodings
    # result = face_recognition.compare_faces([known_encoding], unknown_encoding)

    # # Check if the result is True (person is verified) or False (person is not verified)
    # if result[0] == True:
    #     print("Person is verified")
    # else:
    #     print("Person is not verified")
  
      
# Running app
if __name__ == '__main__':
    port = 5001
    app.run(port=port)