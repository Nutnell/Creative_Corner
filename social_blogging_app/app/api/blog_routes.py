import os
import sys
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from datetime import datetime

from social_blogging_app.crew import SocialBloggingAi

router = APIRouter()

class GenerateBlogRequest(BaseModel):
    topic: str = Field(..., description="The topic for the blog post.")
    tone: str = Field("professional", description="The desired tone of the blog post (e.g., casual, professional).")

@router.post("/generate-blog")
async def generate_blog_post(request: GenerateBlogRequest):
    """
    Triggers the multi-agent crew to generate a blog post based on a given topic.
    """
    try:
        current_year = str(datetime.now().year)
        
        inputs = {
            'topic': request.topic,
            'current_year': current_year,
            'tone': request.tone
        }
        
        # Instantiate and run the crew
        crew = SocialBloggingAi().crew()
        result = crew.kickoff(inputs=inputs)
        
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

        os.makedirs("logs", exist_ok=True)
        filename = f"logs/blog_{timestamp}.txt"

        session_id = datetime.now().strftime("%Y%m%d%H%M%S")
        log_file = f"logs/blog_{session_id}.txt"

        with open(log_file, "w", encoding="utf-8") as f:
            f.write(str(result))

        return {
            "message": "Blog post successfully generated.",
            "topic": request.topic,
            "result": result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while running the crew: {e}")

        print(f"[Blog Log] Prompt tokens: {len(result.split())}")