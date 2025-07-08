# catalogue_custom_exceptions.py


class CatalogueException(Exception):
    def __init__(self, message="Error occurred in Catalogue operation"):
        self.message = message
        super().__init__(self.message)

class CatalogueNotFoundException(Exception):
    def __init__(self, catalogue_id):
        self.message = f"Catalogue with ID {catalogue_id} not found."
        super().__init__(self.message)
