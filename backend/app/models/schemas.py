from pydantic import BaseModel

class PartResult(BaseModel):
    row: int
    partNumber: str
    manufacturer: str
    aecStatus: str
    aecStandard: str
    grade: str
    source: str
    notes: str
    confidence: float
    error: str | None = None

class ProcessResponse(BaseModel):
    summary: dict
    results: list[PartResult]
