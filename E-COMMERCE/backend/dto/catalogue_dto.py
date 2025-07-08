# catalogue.py

class Catalogue:
    def __init__(self, catalogue_name, catalogue_description, start_date, end_date, ):
        self.catalogue_name = catalogue_name
        self.catalogue_description = catalogue_description
        self.start_date = start_date
        self.end_date = end_date
        

        
    def __str__(self):
        return f"catalogue(catalogue_name={self.catalogue_name},catalogue_description={self.catalogue_description},start_date={self.start_date},end_date={self.end_date})"
    
        



