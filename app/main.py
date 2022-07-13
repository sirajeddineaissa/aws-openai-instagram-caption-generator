import os
import openai


openai.api_key = os.getenv("OPENAI_API_KEY")

response = openai.Completion.create(engine="davinci", prompt="testing", max_tokens=5)

print(response)
