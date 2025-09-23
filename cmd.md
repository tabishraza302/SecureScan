1. test the db api resp

```sql
docker exec securescan_postgres psql -U securescan_user -d securescan_db -c "SELECT * FROM api_responses;"
```

