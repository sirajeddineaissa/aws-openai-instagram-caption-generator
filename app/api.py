from fastapi import FastAPI
from .generator import generate_instagram_caption, generate_related_words

app = FastAPI()


@app.get("/generate_caption")
async def generate_caption_api(theme: str):
    caption = generate_instagram_caption(theme)
    return {"message": caption}


@app.get("/generate_related_words")
async def generate_words_api(theme: str):
    word_list = generate_related_words(theme)
    return {"message": word_list}
