import google.generativeai as genai
from decouple import config

from apps.documents.models import Document


class GeminiProvider:
    def __init__(self):
        api_key = config("GEMINI_API_KEY")
        genai.configure(api_key=api_key)

        self.model = genai.GenerativeModel("gemini-2.0-flash")

    def answer(self, query, history=None):

        # Get latest indexed document
        document = (
            Document.objects
            .filter(processing_status="indexed")
            .order_by("-upload_date")
            .first()
        )

        if not document:
            return {
                "response": "No indexed document found. Please upload a document first.",
                "sources": [],
                "model_used": "Gemini",
            }

        if not document.extracted_text:
            return {
                "response": "The uploaded document has no extracted text.",
                "sources": [document.original_name],
                "model_used": "Gemini",
            }

        prompt = f"""
You are an industrial AI assistant.

Answer ONLY using the information below.

Document Name:
{document.original_name}

Document Content:
{document.extracted_text}

User Question:
{query}

If the answer is not available in the document, say:
"I could not find that information in the uploaded document."
"""

        response = self.model.generate_content(prompt)

        return {
            "response": response.text,
            "sources": [document.original_name],
            "model_used": "Gemini 1.5 Flash",
        }


def get_ai_provider():
    return GeminiProvider()