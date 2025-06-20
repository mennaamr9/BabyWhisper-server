import mysql.connector
# from datetime import datetime

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="mnar24678",
        database="babyWhisper"
    )

    #python -c "import mysql.connector; print('mysql.connector is working')"

