import re

def normalize_part_number(value: str) -> str:
    token = re.sub(r'[^A-Z0-9]', '', value.upper())
    return re.sub(r'(TR|TAPE|REEL|G4|A)$', '', token)
