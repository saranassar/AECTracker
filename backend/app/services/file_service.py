from io import BytesIO
import pandas as pd
from fastapi import HTTPException, UploadFile

COLUMN_ALIASES = {
    "part number": "part_number",
    "pn": "part_number",
    "partnumber": "part_number",
    "mfr": "manufacturer",
    "manufacturer": "manufacturer",
    "company": "manufacturer",
    "vendor": "manufacturer",
}
REQUIRED_OUTPUT_COLUMNS = {"part_number", "manufacturer"}


def parse_upload(file: UploadFile) -> pd.DataFrame:
    filename = (file.filename or '').lower()
    content = file.file.read()
    if filename.endswith('.csv'):
        df = pd.read_csv(BytesIO(content))
    elif filename.endswith('.xlsx'):
        df = pd.read_excel(BytesIO(content))
    else:
        raise HTTPException(status_code=400, detail="Only .csv and .xlsx are accepted")

    rename_map: dict[str, str] = {}
    for col in df.columns:
        normalized = str(col).strip().lower().replace('_', ' ')
        alias = COLUMN_ALIASES.get(normalized)
        if alias:
            rename_map[col] = alias

    parsed = df.rename(columns=rename_map)
    if not REQUIRED_OUTPUT_COLUMNS.issubset(set(parsed.columns)):
        raise HTTPException(
            status_code=422,
            detail="Missing required columns. Need Part Number/PN and Manufacturer/MFR",
        )
    return parsed
