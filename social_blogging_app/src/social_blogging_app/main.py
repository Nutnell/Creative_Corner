# app/main.py
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from crewai import Crew, Process
from crewai_tools import SerperDevTool
from src.social_blogging_app.agents import SocialBloggingAgents
from src.social_blogging_app.tools.custom_tool import get_llm, get_current_trends, generate_draft, edit_draft, summarize_post
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Social Blogging AI Agent API")

class BlogRequest(BaseModel):
    topic: str = Field(..., description="The topic for the blog post.")
    tone: str = Field(
        ...,
        description="The desired tone for the blog post. e.g., 'professional', 'casual', 'humorous'",
    )

@app.post("/api/generate-blog", tags=["Blog Generation"])
async def generate_blog(request: BlogRequest):
    """
    Generates a social media-ready blog post based on a topic and tone.
    """
    try:
        # Get the LLM instance to pass to the agents and crew
        llm_instance = get_llm()

        # Initialize the agents with the LLM instance
        agents = SocialBloggingAgents(llm=llm_instance)
        trend_hunter = agents.trend_hunter_agent()
        draft_writer = agents.draft_writer_agent()
        editor = agents.editor_agent()
        social_media_manager = agents.social_media_manager_agent()

        # Initialize the crew
        crew = Crew(
            agents=[trend_hunter, draft_writer, editor, social_media_manager],
            tasks=agents.blog_post_tasks(
                topic=request.topic, tone=request.tone
            ),
            process=Process.sequential,
            verbose=True,
            llm=llm_instance # <-- THIS IS THE CRUCIAL LINE
        )

        # Kickoff the crew and get the result
        result = crew.kickoff()

        return {"result": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while running the crew: {e}")

# Add a simple root endpoint to confirm the server is running
@app.get("/")
def read_root():
    return {"message": "Social Blogging AI Agent API is running."}

