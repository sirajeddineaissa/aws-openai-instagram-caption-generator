from fastapi import FastAPI, HTTPException
from generator import generate_instagram_caption, generate_related_words
from mangum import Mangum

app = FastAPI()

# Handler function which will be invoked by AWS Lambda
handler = Mangum(app)


@app.get("/generate_caption")
async def generate_caption_api(theme: str):
    validate_input(theme)
    caption = generate_instagram_caption(theme)
    return {"message": caption}


@app.get("/generate_related_words")
async def generate_words_api(theme: str):
    word_list = generate_related_words(theme)
    return {"message": word_list}


def validate_input(theme: str):
    if len(theme) >= 20:
        raise HTTPException(status_code=400, detail="Make your input shorter!")

