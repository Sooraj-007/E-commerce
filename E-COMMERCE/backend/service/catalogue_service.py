# catalogue_service.py

import mysql.connector 
from dto.catalogue_dto import Catalogue
from util.db_connection_util import get_connection
from exceptions.exception import (
    CatalogueNotFoundException,
    CatalogueException
)

class CatalogueService:

    def create_catalogue(self, catalogue: Catalogue):        
        connection = None
        try:
            connection = get_connection()
            cursor = connection.cursor()

            query = """
                INSERT INTO Catalogue (catalogue_name, catalogue_description, start_date, end_date)
                VALUES (%s, %s, %s, %s)
            """
            data = (
                catalogue.catalogue_name,
                catalogue.catalogue_description,
                catalogue.start_date,
                catalogue.end_date
            )
            cursor.execute(query, data)
            connection.commit()
            print("Catalogue created successfully.")

        except Exception as e:
            raise CatalogueException(f"Error creating catalogue: {e}")

        finally:
            if connection and connection.is_connected():
                connection.close()

    def get_all_catalogues(self):
        connection = None
        try:
            connection = get_connection()
            cursor = connection.cursor()

            query = """
                SELECT catalogue_id, catalogue_name, catalogue_description, start_date, end_date 
                FROM Catalogue
            """
            cursor.execute(query)
            rows = cursor.fetchall()

            catalogues = []
            for row in rows:
                catalogues.append({
                    "catalogue_id": row[0],
                    "catalogue_name": row[1],
                    "catalogue_description": row[2],
                    "start_date": row[3].strftime("%Y-%m-%d") if row[3] else None,
                    "end_date": row[4].strftime("%Y-%m-%d") if row[4] else None
                })

            return catalogues

        except Exception as e:
            raise CatalogueException(f"Error retrieving catalogues: {e}")

        finally:
            if connection and connection.is_connected():
                connection.close()

    def get_catalogue_by_id(self, catalogue_id: int):
        connection = None
        try:
            connection = get_connection()
            cursor = connection.cursor()

            query = """
                SELECT catalogue_id, catalogue_name, catalogue_description, start_date, end_date 
                FROM Catalogue 
                WHERE catalogue_id = %s
            """
            cursor.execute(query, (catalogue_id,))
            row = cursor.fetchone()

            if row is None:
                raise CatalogueNotFoundException(f"Catalogue ID {catalogue_id} not found.")

            return {
                "catalogue_id": row[0],
                "catalogue_name": row[1],
                "catalogue_description": row[2],
                "start_date": row[3].strftime("%Y-%m-%d") if row[3] else None,
                "end_date": row[4].strftime("%Y-%m-%d") if row[4] else None
            }

        except Exception as e:
            raise CatalogueException(f"Error retrieving catalogue by ID: {e}")

        finally:
            if connection and connection.is_connected():
                connection.close()

    def update_catalogue_by_id(self, catalogue_id: int, catalogue: Catalogue):
        connection = None
        try:
            connection = get_connection()
            cursor = connection.cursor()

            query = """
                UPDATE Catalogue
                SET catalogue_name = %s, catalogue_description = %s, start_date = %s, end_date = %s
                WHERE catalogue_id = %s
            """
            data = (
                catalogue.catalogue_name,
                catalogue.catalogue_description,
                catalogue.start_date,
                catalogue.end_date,
                catalogue_id
            )
            cursor.execute(query, data)
            if cursor.rowcount == 0:
                raise CatalogueNotFoundException(f"Catalogue ID {catalogue_id} not found.")
            connection.commit()
            print(f"Catalogue ID {catalogue_id} updated successfully.")

        except Exception as e:
            raise CatalogueException(f"Error updating catalogue: {e}")

        finally:
            if connection and connection.is_connected():
                connection.close()

    def delete_catalogue_by_id(self, catalogue_id: int):
        connection = None
        try:
            connection = get_connection()
            cursor = connection.cursor()

            query = "DELETE FROM Catalogue WHERE catalogue_id = %s"
            cursor.execute(query, (catalogue_id,))
            if cursor.rowcount == 0:
                raise CatalogueNotFoundException(f"Catalogue ID {catalogue_id} not found.")
            connection.commit()
            print(f"Catalogue ID {catalogue_id} deleted successfully.")

        except Exception as e:
            raise CatalogueException(f"Error deleting catalogue: {e}")

        finally:
            if connection and connection.is_connected():
                connection.close()

    # ---------------- NEW: Filter + Pagination ---------------- #

    def get_filtered_paginated_catalogues(self, filter_name=None, page=1, limit=10):
        connection = None
        try:
            connection = get_connection()
            cursor = connection.cursor()

            offset = (page - 1) * limit

            base_query = """
                SELECT catalogue_id, catalogue_name, catalogue_description, start_date, end_date
                FROM Catalogue
            """

            count_query = "SELECT COUNT(*) FROM Catalogue"

            params = []
            if filter_name:
                base_query += " WHERE catalogue_name LIKE %s"
                count_query += " WHERE catalogue_name LIKE %s"
                params.append(f"%{filter_name}%")

            base_query += " LIMIT %s OFFSET %s"
            params.extend([limit, offset])

            cursor.execute(base_query, tuple(params))
            rows = cursor.fetchall()

            cursor.execute(count_query, tuple(params[:1]) if filter_name else ())
            total = cursor.fetchone()[0]

            catalogues = []
            for row in rows:
                catalogues.append({
                    "catalogue_id": row[0],
                    "catalogue_name": row[1],
                    "catalogue_description": row[2],
                    "start_date": row[3].strftime("%Y-%m-%d") if row[3] else None,
                    "end_date": row[4].strftime("%Y-%m-%d") if row[4] else None
                })

            return {
                "total": total,
                "page": page,
                "limit": limit,
                "data": catalogues
            }

        except Exception as e:
            raise CatalogueException(f"Error filtering/paginating catalogues: {e}")

        finally:
            if connection and connection.is_connected():
                connection.close()