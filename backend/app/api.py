from fastapi import FastAPI, HTTPException
from generator import generate_instagram_caption, generate_related_words
from mangum import Mangum
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Handler function which will be invoked by AWS Lambda
handler = Mangum(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/generate_caption")
async def generate_caption_api(theme: str):
    validate_input(theme)
    caption = generate_instagram_caption(theme)
    return {"caption": caption}


@app.get("/generate_related_words")
async def generate_words_api(theme: str):
    validate_input(theme)
    word_list = generate_related_words(theme)
    return {"keywords": word_list}


@app.get("/generate_caption_and_words")
async def generate_caption_words_api(theme: str):
    validate_input(theme)
    caption = generate_instagram_caption(theme)
    word_list = generate_related_words(theme)
    return {"caption": caption, "keywords": word_list}


def validate_input(theme: str):
    if len(theme) >= 20:
        raise HTTPException(status_code=400, detail="Make your input shorter!")
