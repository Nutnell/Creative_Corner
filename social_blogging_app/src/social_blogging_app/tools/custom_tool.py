import os
import requests
from dotenv import load_dotenv
from crewai import Agent
from crewai.tools import tool
from crewai_tools import SerperDevTool
from langchain_google_genai import ChatGoogleGenerativeAI
from src.social_blogging_app.utils.embedding_store import query_similar_documents

load_dotenv()


search_tool = SerperDevTool()


def get_langchain_llm(temp: float = 0.2) -> ChatGoogleGenerativeAI:
    """
    Returns a configured instance of ChatGoogleGenerativeAI with the desired temperature.
    Used ONLY inside tools.
    """
    google_api_key = os.environ.get("GOOGLE_API_KEY")
    if not google_api_key:
        raise ValueError("GOOGLE_API_KEY not found in environment variables.")

    return ChatGoogleGenerativeAI(
        model="gemini-1.5-flash", google_api_key=google_api_key, temperature=temp
    )


# Tool definitions
from crewai_tools import SerperDevTool

search_tool = SerperDevTool()

@tool("Get Current Trends")
def get_current_trends(topic: str) -> str:
    """
    Searches for and analyzes the latest trends on a given topic using search results.
    """
    try:
        search_results = search_tool.run(f"latest trends on {topic}")
        llm = get_langchain_llm(temp=0.2)

        prompt = f"""
        Analyze these search results to extract trending insights on '{topic}'.
        Provide a structured summary with key points and suggest a compelling blog title.

        Search Results:
        {search_results}
        """
        response = llm.invoke(prompt)
        return response.content

    except Exception as e:
        return f"An error occurred while getting trends: {e}"



@tool("Generate Draft")
def generate_draft(topic: str, trends: str) -> str:
    """
    Generates a blog post draft about a given a topic, using trend analysis and RAG-enhanced background knowledge.
    Incorporates key insights from the latest trends and relevant retrieved context from the vector database.
    """
    try:
        llm = get_langchain_llm(temp=0.7)

        # Retrieve similar documents from ChromaDB for RAG
        context_docs = query_similar_documents(topic, k=3)
        rag_context = "\n\n".join([doc.page_content for doc in context_docs])

        # Construct the prompt
        prompt = f"""
        You are a seasoned blogger. Create a well-structured and engaging blog post draft about '{topic}',
        incorporating the following key trends and RAG-retrieved knowledge.

        Trends:
        {trends}

        Relevant Background Info:
        {rag_context}

        Output should be around 100 words and structured with clear headings.
        """

        # Generate the response
        response = llm.invoke(prompt)
        return response.content

    except Exception as e:
        return f"An error occurred while generating the draft: {e}"


@tool("Edit Draft")
def edit_draft(draft: str, feedback: str) -> str:
    """
    Edits a blog post draft based on specific feedback to improve quality and readability.
    """
    try:
        llm = get_langchain_llm(temp=0.2)
        prompt = f"""
        You are a professional blog editor. Your task is to refine and improve the following blog post draft.
        Address the provided feedback to enhance clarity, flow, tone, and overall quality.
        The goal is to produce a polished, final version of the blog post.

        Original Draft:
        {draft}

        Editor's Feedback:
        {feedback}
        """
        response = llm.invoke(prompt)
        return response.content

    except Exception as e:
        return f"An error occurred while editing the draft: {e}"


@tool("Summarize Post")
def summarize_post(post: dict) -> str:
    """
    Creates a concise and compelling summary for a blog post.
    """
    try:
        llm = get_langchain_llm(temp=0.1)
        prompt = f"""
        You are a social media manager. Your task is to write a concise and attention-grabbing summary of the following blog post.
        The summary should be around 1-2 paragraphs and suitable for a social media post to entice readers to click and read more.

        Blog Post:
        {post}
        """
        response = llm.invoke(prompt)
        return response.content

    except Exception as e:
        return f"An error occurred while summarizing the post: {e}"


# Agent definition using CrewAI
trend_hunter_agent = Agent(
    role="Trend Hunter",
    goal="Discover and analyze the latest trends",
    backstory="An AI expert in real-time trend spotting and blogging",
    verbose=True,
    allow_delegation=False,
    llm="gemini/gemini-1.5-flash",
    tools=[get_current_trends, generate_draft, edit_draft, summarize_post],
)
