# user_service.py

import mysql.connector
from util.db_connection_util import get_connection

class UserService:
    def validate_user(self, username, password):
        connection = None
        try:
            connection = get_connection()
            cursor = connection.cursor()
            
            cursor.execute("SELECT * FROM login WHERE username=%s AND password=%s", (username, password))
            result = cursor.fetchone()
            return result is not None
        except Exception as e:
            raise Exception(f"Login failed: {str(e)}")
        finally:
            if connection and connection.is_connected():
                connection.close()
