# src/utils/llm_factory.py

import os
from dotenv import load_dotenv

load_dotenv()

def get_llm_model_name() -> str:
    """
    Returns the model name string for LiteLLM-compatible providers like CrewAI.
    """
    # Just validate the key exists
    if not os.getenv("GOOGLE_API_KEY"):
        raise ValueError("GOOGLE_API_KEY not found in environment variables.")
    
    return "gemini/gemini-1.5-flash"  # LiteLLM-compatible Gemini model name

# social_blogging_app/app/utils/llm_factory.py
from langchain_google_genai import ChatGoogleGenerativeAI
import os

def get_llm(temp: float = 0.2) -> ChatGoogleGenerativeAI:
    google_api_key = os.environ.get("GOOGLE_API_KEY")
    if not google_api_key:
        raise ValueError("GOOGLE_API_KEY not found in environment variables.")
    
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        google_api_key=google_api_key,
        temperature=temp
    )
