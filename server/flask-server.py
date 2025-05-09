
"""
Flask server for face embedding and comparison
This file would be in a separate Python project, not part of the React frontend.
It's included here for documentation purposes only.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import uuid
import os
import face_recognition  # You would need to install this

app = Flask(__name__)
CORS(app)

# In-memory database of embeddings (in a real app, use a database)
embeddings = {}

@app.route('/register', methods=['POST'])
def register_face():
    """Register a face and generate an embedding"""
    if 'image' not in request.files:
        return jsonify({'success': False, 'message': 'No image provided'})
    
    image_file = request.files['image']
    
    try:
        # Read image from uploaded file
        image_array = np.frombuffer(image_file.read(), np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        
        # Convert BGR to RGB (face_recognition uses RGB)
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Find all faces in the image
        face_locations = face_recognition.face_locations(rgb_image)
        
        # If no face detected
        if not face_locations:
            return jsonify({'success': False, 'message': 'No face detected in image'})
        
        # If multiple faces detected
        if len(face_locations) > 1:
            return jsonify({'success': False, 'message': 'Multiple faces detected. Please use an image with only one face'})
        
        # Get the face embedding
        face_encodings = face_recognition.face_encodings(rgb_image, face_locations)
        
        # Generate a unique ID for the embedding
        embedding_id = str(uuid.uuid4())
        
        # Store the embedding with the ID
        embeddings[embedding_id] = face_encodings[0]
        
        return jsonify({
            'success': True,
            'message': 'Face registered successfully',
            'embedding_id': embedding_id
        })
        
    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({'success': False, 'message': f'Error processing image: {str(e)}'})

@app.route('/verify', methods=['POST'])
def verify_face():
    """Verify a face against a stored embedding"""
    if 'image' not in request.files:
        return jsonify({'success': False, 'message': 'No image provided'})
        
    if 'user_id' not in request.form:
        return jsonify({'success': False, 'message': 'No user ID provided'})
    
    user_id = request.form['user_id']
    image_file = request.files['image']
    
    # Check if user embedding exists
    if user_id not in embeddings:
        return jsonify({'success': False, 'message': 'User not found'})
    
    try:
        # Read image from uploaded file
        image_array = np.frombuffer(image_file.read(), np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        
        # Convert BGR to RGB (face_recognition uses RGB)
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Find all faces in the image
        face_locations = face_recognition.face_locations(rgb_image)
        
        # If no face detected
        if not face_locations:
            return jsonify({'success': False, 'message': 'No face detected in image'})
        
        # If multiple faces detected
        if len(face_locations) > 1:
            return jsonify({'success': False, 'message': 'Multiple faces detected. Please use an image with only one face'})
        
        # Get the face embedding
        face_encodings = face_recognition.face_encodings(rgb_image, face_locations)
        
        # Compare with stored embedding
        stored_encoding = embeddings[user_id]
        match = face_recognition.compare_faces([stored_encoding], face_encodings[0], tolerance=0.6)[0]
        
        if match:
            # Calculate confidence score (similarity)
            distance = face_recognition.face_distance([stored_encoding], face_encodings[0])[0]
            confidence = 1.0 - distance  # Convert distance to similarity score
            
            return jsonify({
                'success': True,
                'message': 'Face verified successfully',
                'confidence': float(confidence)
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Face verification failed'
            })
        
    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({'success': False, 'message': f'Error processing image: {str(e)}'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
