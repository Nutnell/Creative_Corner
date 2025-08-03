import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import blog_routes, test_rag, chat_routes
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, '..', '..'))
sys.path.insert(0, parent_dir)
from utils.llm_factory import get_llm

load_dotenv()

llm = get_llm()

app = FastAPI(
    title="Social Blogging AI",
    description="API for an AI agent crew that generates social media blog posts.",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS policies to allow communication with the frontend
origins = ["*"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the blog post generation routes
app.include_router(blog_routes.router, prefix="/api")
app.include_router(test_rag.router, prefix="/api")
app.include_router(chat_routes.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Social Blogging AI API!"}