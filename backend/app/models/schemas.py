from pydantic import BaseModel, Field

class PartResult(BaseModel):
    row: int
    partNumber: str
    manufacturer: str
    aecStatus: str
    aecStandard: str
    grade: str
    source: str
    notes: str
    confidence: float = Field(ge=0, le=1)
    error: str | None = None

class Summary(BaseModel):
    total: int
    qualified: int
    unknown: int
    invalid: int

class ProcessResponse(BaseModel):
    summary: Summary
    results: list[PartResult]
