from flask import Flask, request, jsonify
import shutil
import librosa
import numpy as np
import sounddevice as sd
import os
import tempfile
import uuid
import joblib
import warnings
import soundfile as sf  
from datetime import datetime
from pydub import AudioSegment
from flask_socketio import SocketIO, emit
from pydub.utils import mediainfo
from pydub.silence import detect_nonsilent


warnings.filterwarnings("ignore")

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

# Load the trained model and expected features
model = joblib.load("random_forest_model.pkl")
selected_features = joblib.load("selected_features.pkl")

# Label mapping dictionary
label_mapping = {
    0: "asphyxia",
    1: "deaf",
    2: "hunger",
    3: "normal",
    4: "pain",
}

# Suggestions based on prediction
suggestions = {
    "asphyxia": "Please check if your baby’s sleeping position is comfortable and their nose and mouth are not covered. If the crying continues or seems unusual, it’s best to consult your doctor.",
    "deaf": "Your baby might be crying loudly or in an unusual pattern. Try to soothe them in a quiet environment and observe if they respond to sounds. If concerned, consider seeking advice from a specialist.",
    "hunger": "Your baby may be hungry. Try offering a feeding or their usual meal.",
    "normal": "Your baby seems to be crying normally. There’s likely nothing to worry about. Keep an eye on them, and if the crying stops soon, all is well.",
    "pain": "Your baby might be experiencing mild discomfort, like gas or needing a diaper change. Try gently checking and comforting them."
}

# Create a temp directory if it doesn't exist
os.makedirs("temp", exist_ok=True)

# Global history for responses
prediction_history = []

# Feature extraction function

def extract_features(file_path):
    y, sr = librosa.load(file_path, sr=22050)
    if np.max(np.abs(y)) < 0.01:
        return None  # No valid sound detected
    
    print("Audio shape:", y.shape)
    print("Max amplitude:", np.max(np.abs(y)))
    print("Duration (seconds):", librosa.get_duration(y=y, sr=sr))
    features_dict = {}
    features_dict["ZeroCrossingRate"] = np.mean(librosa.feature.zero_crossing_rate(y))
    features_dict["SpectralCentroid"] = np.mean(librosa.feature.spectral_centroid(y=y, sr=sr))
    features_dict["SpectralBandwidth"] = np.mean(librosa.feature.spectral_bandwidth(y=y, sr=sr))
    contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
    features_dict["SpectralContrast_1"] = np.mean(contrast[0])
    features_dict["SpectralContrast_3"] = np.mean(contrast[2])
    features_dict["SpectralContrast_6"] = np.mean(contrast[5])
    features_dict["RMSE"] = np.mean(librosa.feature.rms(y=y))
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    for i in range(13):
        features_dict[f"MFCC{i+1}"] = np.mean(mfccs[i])
    # Select only the needed features
    feature_vector = [features_dict[feat] for feat in selected_features if feat in features_dict]
    return feature_vector


def predict_class(audio_path):
    features = extract_features(audio_path)

    if features is None:
        return {"error": "No valid sound detected"}
    
    # Ensure it's a proper NumPy array or list of floats
    if isinstance(features, dict):
        return {"error": "Invalid feature format: expected numeric array, got dictionary"}

    try:
        prediction = model.predict([features])[0]
        class_name = label_mapping[prediction]
        return {
            "prediction": class_name,
            "recommendation": suggestions[class_name]
        }
    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}
    

# @socketio.on('audio_chunk')
# def handle_audio_chunk(data):
#     try:
#         with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as f:
#             f.write(data)
#             f.flush()
#             result = predict_class(f.name)

#             if "error" in result:
#                 emit('error', {'message': result["error"]})
#             else:
#                 # This format matches what your frontend expects!
#                 emit('analysis-result', {
#                       "prediction": result["prediction"],
#                       "recommendation": result["recommendation"]
# })
#     except Exception as e:
#         emit('error', {'message': str(e)})


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to the Baby Cry Classifier API"})

@app.route("/predictions/", methods=["GET"])
def get_predictions():

    return jsonify({
        "count": len(prediction_history),
        "history": prediction_history
    })

@app.route("/predict/", methods=["POST"])
def predict_audio():
    try:
        file = request.files.get('file')
        if file is None:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        print("Received file:", file)

        temp_path = os.path.join(tempfile.gettempdir(), file.filename)
        file.save(temp_path)

        # Check file is not empty
        if os.path.getsize(temp_path) == 0:
            return jsonify({"error": "Uploaded audio file is empty"}), 400


        # Convert to WAV if not already
        if not temp_path.endswith(".wav"):
            audio = AudioSegment.from_file(temp_path)
            temp_wav = temp_path + ".wav"
            audio.export(temp_wav, format="wav")
            temp_path = temp_wav

        # Extract features
        features = extract_features(temp_path)
        if features is None:
            return jsonify({"error": "No valid sound detected"}), 400

        # Call your prediction function
        result = predict_class(temp_path) 
        print("Prediction result:", result)
        

        if "error" in result:
            return jsonify({"error": result["error"]}), 400

        return jsonify({
            "message": "Prediction successful",
            "filename": file.filename,
            "prediction": result["prediction"],
            "suggestion": result["recommendation"]
        })

    except Exception as e:
        print("Flask API Error:", e)
        return jsonify({"message": "Internal server error", "error": str(e)}), 500



@app.route("/record", methods=["POST"])
def predict_from_recording():
    try:
        # Accept recorded audio (e.g., from MediaRecorder in frontend)
        file = request.files.get('file')
        if file is None:
            return jsonify({'error': 'No recorded audio uploaded'}), 400

        # Save the uploaded blob to a temp WAV file
        temp_path = os.path.join(tempfile.gettempdir(), f"recorded_{uuid.uuid4().hex}.wav")
        file.save(temp_path)

        # If it's not WAV, convert using pydub
        if not temp_path.endswith(".wav"):
            audio = AudioSegment.from_file(temp_path)
            temp_wav = temp_path + ".wav"
            audio.export(temp_wav, format="wav")
            temp_path = temp_wav

        # Predict using existing logic
        result = predict_class(temp_path)
        print("Recorded Audio Prediction Result:", result)

        if "error" in result:
            return jsonify({"error": result["error"]}), 400

        return jsonify({
            "message": "Prediction successful",
            "filename": file.filename,
            "prediction": result["prediction"],
            "suggestion": result["recommendation"]
        })

    except Exception as e:
        print("Recording Prediction Error:", str(e))
        return jsonify({"message": "Internal server error", "error": str(e)}), 500

if __name__ == '__main__':
   app.run(port=5000, debug=True)

   