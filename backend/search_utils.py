import os
import requests
from dotenv import load_dotenv

load_dotenv()

def upload_image_to_tmp(image_bytes: bytes, filename: str) -> str:
    """
    Uploads an image to tmpfiles.org to get a temporary public URL.
    This is useful for APIs that require a public image URL instead of raw bytes.
    """
    try:
        data = {'reqtype': 'fileupload'}
        files = {'fileToUpload': (filename, image_bytes, 'image/jpeg')}
        response = requests.post('https://catbox.moe/user/api.php', data=data, files=files)
        response.raise_for_status()
        
        # catbox returns the raw direct URL in plaintext
        url = response.text.strip()
        return url
    except Exception as e:
        print(f"Failed to upload temporary image: {e}")
        return None

def search_social_media(image_url: str):
    """
    Searches the web using SerpApi's Google Lens Engine.
    """
    api_key = os.getenv("SERPAPI_KEY")
    if not api_key:
        return {
            "success": False,
            "message": "SERPAPI_KEY environment variable not found. Please create a .env file and add your SerpApi key."
        }
    
    try:
        params = {
          "engine": "google_lens",
          "url": image_url,
          "api_key": api_key
        }
        
        response = requests.get("https://serpapi.com/search", params=params)
        response.raise_for_status()
        
        data = response.json()
        
        visual_matches = data.get("visual_matches", [])
        
        if not visual_matches:
            return {"success": False, "message": "No visual matches found on the web."}
            
        # Try to find a match that looks like a social media post (twitter, instagram, facebook, etc.)
        social_platforms = ["twitter.com", "instagram.com", "facebook.com", "linkedin.com", "tiktok.com", "pinterest.com"]
        
        best_match = None
        for match in visual_matches:
            link = match.get("link", "")
            if any(platform in link for platform in social_platforms):
                best_match = match
                break
                
        # If no strict social media match, just return the top match
        if not best_match and visual_matches:
            best_match = visual_matches[0]
            
        return {
            "success": True,
            "post_title": best_match.get("title", "Unknown Title"),
            "post_url": best_match.get("link", "No URL"),
            "source": best_match.get("source", "Unknown Source"),
            "thumbnail": best_match.get("thumbnail", "")
        }
        
    except Exception as e:
        return {"success": False, "message": f"Error during web search: {str(e)}"}
