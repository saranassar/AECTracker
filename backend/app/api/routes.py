from fastapi import APIRouter, UploadFile
from app.models.schemas import ProcessResponse, PartResult
from app.services.file_service import parse_upload
from app.services.qualification_service import lookup_qualification

router = APIRouter(prefix='/api/v1')

@router.post('/process', response_model=ProcessResponse)
async def process_parts(file: UploadFile):
    df = parse_upload(file)
    results = []
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

    summary = {
        'total': len(results),
        'qualified': sum(r.aecStatus == 'Qualified' for r in results),
        'unknown': sum(r.aecStatus == 'Unknown' for r in results),
        'invalid': sum(r.aecStatus == 'Invalid' for r in results),
    }
    return ProcessResponse(summary=summary, results=results)
