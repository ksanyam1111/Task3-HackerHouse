import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = "0"
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
import uvicorn
import uuid

from face_utils import detect_and_encode_face
from search_utils import upload_image_to_tmp, search_social_media
from blockchain_storage import verify_data_on_chain


app = FastAPI(title="Face to Blockchain MVP")


@app.get("/")
async def serve_frontend():
    return FileResponse("index.html")

@app.post("/api/process-face")
async def process_face(file: UploadFile = File(...)):
    """
    Main pipeline endpoint:
    1. Reads uploaded image.
    2. Detects and encodes the face.
    3. Uploads the image temporarily to get a URL.
    4. Searches the web (via SerpApi) using the image URL to find a matching post.
    5. Verifies the discovered data on the blockchain.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    image_bytes = await file.read()
    
    # 1. Face Detection & Encoding
    face_result = detect_and_encode_face(image_bytes)
    if not face_result["success"]:
        return {"step": "face_detection", "error": face_result["message"]}
        
    # 2. Upload image temporarily to get a public URL for SerpApi
    temp_filename = f"{uuid.uuid4().hex}.jpg"
    image_url = upload_image_to_tmp(image_bytes, temp_filename)
    if not image_url:
        return {"step": "image_upload", "error": "Failed to upload image for reverse search."}
        
    # 3. Social Media / Web Search
    search_result = search_social_media(image_url)
    if not search_result["success"]:
        return {"step": "web_search", "error": search_result["message"]}
        
    # 4. Blockchain Verification
    blockchain_result = verify_data_on_chain({
        "post_title": search_result["post_title"],
        "post_url": search_result["post_url"]
    })
    
    # Final successful response
    return {
        "success": True,
        "face_detected": True,
        "search_result": {
            "title": search_result["post_title"],
            "url": search_result["post_url"],
            "source": search_result["source"],
            "thumbnail": search_result["thumbnail"]
        },
        "blockchain_record": blockchain_result
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
