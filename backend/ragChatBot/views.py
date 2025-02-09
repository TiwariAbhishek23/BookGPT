from django.shortcuts import render
from django.http import JsonResponse
from langchain_community.chat_models.openai import ChatOpenAI
from langchain.agents import initialize_agent
from langchain.chains.conversation.memory import ConversationBufferWindowMemory
from langchain.agents import Tool
from sqlalchemy.engine import make_url
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.postgres import PGVectorStore
from llama_index.core.llama_pack import download_llama_pack
from llama_index.core.postprocessor import MetadataReplacementPostProcessor
import psycopg2
import os
from dotenv import load_dotenv
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet
from rest_framework import status
from .serializers import PDFUploadSerializer, UploadSerializer
from pdfminer.high_level import extract_text
# from openai import OpenAIApi

# client = OpenAIApi(api_key=os.environ.get('OPENAI_API_KEY'))

load_dotenv()


# get api key from .env file
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

connection_string = os.environ.get('PGVECTOR_CONNECTION_STRING')
db_name = os.environ.get('DB_NAME')
conn = psycopg2.connect(connection_string)
conn.autocommit = True
url = make_url(connection_string)

vector_store = PGVectorStore.from_params(
    database=db_name,
    host=url.host,
    password=url.password,
    port=url.port,
    user=url.username,
    table_name="DeloitteFutureOfAI",
    embed_dim=1536,  # openai embedding dimension
)
#create index
index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
query_engine = index.as_query_engine()

#for sentence window retriever
# index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
# query_engine = index.as_query_engine(
#     similarity_top_k=3,
#     # the target key defaults to `window` to match the node_parser's default
#     node_postprocessors=[
#         MetadataReplacementPostProcessor(target_metadata_key="test")
#     ],
# )

#create langchain tool
tools = [
    Tool(
        name="Deloitte Future Of AI Report",
        func=lambda q: str(index.as_query_engine().query(q)),
        description="Useful only when there are questions about Deloitte Future Of AI report. This is not useful for general knowledge",
        return_direct=True,
    ),
]

memory = ConversationBufferWindowMemory(memory_key="chat_history", k=6)

llm = ChatOpenAI(temperature=0, api_key=OPENAI_API_KEY, model='gpt-4o-mini')
agent_executor = initialize_agent(
    tools=tools, 
    llm=llm, 
    # agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    agent="conversational-react-description", memory=memory,
    verbose=True,
    handle_parsing_errors=False
)

#Create RAG Pipeline
def ask_openai_rag(message):
    answer = agent_executor.run(input=message)
    return answer


def ragChatBot(request):
    if request.method == 'POST':
        message = request.POST.get('message')
        response = ask_openai_rag(message)
        return JsonResponse({'message': message, 'response': response})
    return render(request,'chatbot.html')

class UploadViewSet(ViewSet):
    serializer_class = UploadSerializer

    def list(self, request):
        return Response("GET API")

    def create(self, request):
        file_uploaded = request.FILES.get('file_uploaded')
        content_type = file_uploaded.content_type
        response = "POST API and you have uploaded a {} file".format(content_type)
        return Response(response)