import cv2
import numpy as np
from deepface import DeepFace

def detect_and_encode_face(image_bytes: bytes):
    """
    Detects a face in the provided image bytes and returns its encoding.
    Returns:
        dict containing 'success' (bool), 'encoding' (list of floats, if successful), 
        and 'message' (str, if failed).
    """
    try:
        # Convert bytes to numpy array for opencv
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return {"success": False, "message": "Failed to decode image."}

        try:
            # Extract face representation (embedding).
            # We use Facenet which is highly accurate and doesn't require C++ build tools.
            representations = DeepFace.represent(img_path=img, model_name="Facenet", detector_backend="mtcnn", enforce_detection=True)
            
            if not representations:
                return {"success": False, "message": "No face detected in the image."}
                
            if len(representations) > 1:
                return {"success": False, "message": "Multiple faces detected. Please upload an image with a single face."}
                
            embedding = representations[0]["embedding"]
            
            return {
                "success": True, 
                "encoding": embedding,
                "message": "Face detected and encoded successfully."
            }
        except ValueError as e:
            # DeepFace raises a ValueError if it cannot detect a face when enforce_detection=True
            if "Face could not be detected" in str(e) or "Face not found" in str(e) or "could not be detected" in str(e):
                return {"success": False, "message": "No face detected in the image. Please make sure your face is clearly visible."}
            else:
                # Re-raise if it's a different ValueError
                raise e
        
    except Exception as e:
        return {"success": False, "message": f"Error processing image: {str(e)}"}
