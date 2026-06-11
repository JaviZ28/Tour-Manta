from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

reservas = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Reserva(BaseModel):
    name: str
    email: str
    phone: str
    people: int
    date: str
    type: str
    message: str

@app.get("/")
def root():
    return {"mensaje": "API Tour San Mateo"}

@app.get("/reservas")
def obtener_reservas():
    return reservas

@app.post("/reservas")
def crear_reserva(reserva: Reserva):
    reservas.append(reserva)
    return {
        "ok": True,
        "datos": reserva
    }