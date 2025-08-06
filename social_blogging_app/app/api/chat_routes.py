# app/api/chat_route.py

from fastapi import APIRouter, Request
from pydantic import BaseModel
from utils.llm_factory import get_llm
from src.social_blogging_app.utils.embedding_store import query_similar_documents

router = APIRouter()


class ChatRequest(BaseModel):
    prompt: str


@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        llm = get_llm()

        # RAG context
        rag_docs = query_similar_documents(request.prompt, k=3)
        context = "\n\n".join(doc.page_content for doc in rag_docs)

        system_prompt = (
            "You are a knowledgeable and engaging AI content strategist, specialized in digital trends, content marketing, and social blogging. "
            "You communicate with a friendly, professional tone — offering clear insights, practical tips, and concise responses. "
            "Use simple language when needed, but don't shy away from industry terminology. Be helpful, modern, and relevant."
        )


        final_prompt = f"""{system_prompt}

Here's what you know so far (context):
{context}

Now respond to this:
{request.prompt}
"""

        response = llm.invoke(final_prompt)

        # logging of token length
        print(f"[Chat Log] Prompt tokens: {len(final_prompt.split())}")

        return {"response": response.content}

    except Exception as e:
        return {"error": str(e)}
