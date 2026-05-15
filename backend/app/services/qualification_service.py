from app.utils.normalizer import normalize_part_number

MOCK_DB = {
    ("TPS7A6650QDGNRQ1", "TEXAS INSTRUMENTS"): ("Qualified", "AEC-Q100", "Grade 1", "https://www.ti.com/lit/ds/symlink/tps7a6650-q1.pdf", "Automotive grade regulator", 0.95),
    ("IPD90N04S4L11ATMA1", "INFINEON"): ("Qualified", "AEC-Q101", "Grade 1", "https://www.infineon.com", "MOSFET automotive qualified", 0.88),
}

def lookup_qualification(part_number: str, manufacturer: str):
    key = (normalize_part_number(part_number), manufacturer.strip().upper())
    return MOCK_DB.get(key)
