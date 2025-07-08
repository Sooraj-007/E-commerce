# validators.py

from exceptions.exception import CatalogueException
from datetime import datetime

def validate_catalogue_name(name):
    if not name or not name.strip():
        raise CatalogueException("Catalogue name cannot be empty.")

def validate_description(description):
    if not description or not description.strip():
        raise CatalogueException("Catalogue description cannot be empty.")

def validate_date_format(date_str):
    try:
        datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        raise CatalogueException("Date must be in YYYY-MM-DD format.")

def validate_catalogue_id(catalogue_id):
    if not isinstance(catalogue_id, int):
        raise CatalogueException("Catalogue ID must be an integer.")

def validate_catalogue_name(name):
    if not isinstance(name, str) or not name.strip():
        raise CatalogueException("Catalogue name cannot be empty.")
    


