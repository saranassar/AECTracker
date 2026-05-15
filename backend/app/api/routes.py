from io import BytesIO
from fastapi import APIRouter, UploadFile
from fastapi.responses import StreamingResponse
import pandas as pd
from app.models.schemas import ProcessResponse, PartResult
from app.services.file_service import parse_upload
from app.services.qualification_service import lookup_qualification

router = APIRouter(prefix='/api/v1')


def build_results(df: pd.DataFrame) -> list[PartResult]:
    results: list[PartResult] = []
    for idx, row in df.iterrows():
        pn = str(row.get('part_number', '')).strip()
        mf = str(row.get('manufacturer', '')).strip()
        if not pn or pn.lower() == 'nan':
            results.append(PartResult(row=idx + 2, partNumber='', manufacturer=mf, aecStatus='Invalid', aecStandard='N/A', grade='N/A', source='', notes='Missing PN', confidence=0, error='Missing part number'))
            continue
        match = lookup_qualification(pn, mf)
        if match:
            status, standard, grade, source, notes, confidence = match
        else:
            status, standard, grade, source, notes, confidence = ('Unknown', 'Unknown', 'Unknown', '', 'No trusted source found', 0.2)
        results.append(PartResult(row=idx + 2, partNumber=pn, manufacturer=mf, aecStatus=status, aecStandard=standard, grade=grade, source=source, notes=notes, confidence=confidence))
    return results

@router.post('/process', response_model=ProcessResponse)
async def process_parts(file: UploadFile):
    results = build_results(parse_upload(file))
    summary = {
        'total': len(results),
        'qualified': sum(r.aecStatus == 'Qualified' for r in results),
        'unknown': sum(r.aecStatus == 'Unknown' for r in results),
        'invalid': sum(r.aecStatus == 'Invalid' for r in results),
    }
    return ProcessResponse(summary=summary, results=results)

@router.post('/process/export.xlsx')
async def process_parts_xlsx(file: UploadFile):
    results = [r.model_dump() for r in build_results(parse_upload(file))]
    out = BytesIO()
    pd.DataFrame(results).to_excel(out, index=False)
    out.seek(0)
    return StreamingResponse(out, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', headers={'Content-Disposition': 'attachment; filename="aec-results.xlsx"'})
