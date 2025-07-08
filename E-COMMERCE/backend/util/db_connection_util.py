import mysql.connector
import configparser
import os

def get_connection():
    config = configparser.ConfigParser()
    config_path = os.path.join(os.path.dirname(__file__), '..', 'config', 'config.ini')

    config.read(config_path)

    if 'mysql' not in config:
        raise Exception("Database connection failed: No section: 'mysql'")

    db_config = config['mysql']

    return mysql.connector.connect(
        host=db_config['host'],
        port=int(db_config['port']),
        user=db_config['user'],
        password=db_config['password'],
        database=db_config['database']
    )
