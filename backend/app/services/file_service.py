from io import BytesIO
import pandas as pd
from fastapi import HTTPException, UploadFile

REQUIRED_COLUMNS = {"part number", "manufacturer"}

def parse_upload(file: UploadFile) -> pd.DataFrame:
    filename = (file.filename or '').lower()
    content = file.file.read()
    if filename.endswith('.csv'):
        df = pd.read_csv(BytesIO(content))
    elif filename.endswith('.xlsx'):
        df = pd.read_excel(BytesIO(content))
    else:
        raise HTTPException(status_code=400, detail="Only .csv and .xlsx are accepted")

    normalized_columns = {c.lower().strip(): c for c in df.columns}
    if not REQUIRED_COLUMNS.issubset(normalized_columns.keys()):
        raise HTTPException(status_code=422, detail="Missing required columns: Part Number, Manufacturer")
    return df.rename(columns={normalized_columns['part number']: 'part_number', normalized_columns['manufacturer']: 'manufacturer'})
