## Sample API requests


### Translation API

```bash
curl -ivk POST http://localhost:3443/translate -d '{"q": "あなたは今何をしていますか", "source": "ja", "target": "en"}' -H 'Content-Type: application/json'
```

### View collections list

```bash
curl -ivk http://localhost:3443/collections
```

### Add Product API

```bash
curl -ivk POST http://localhost:3443/product/<COLLECTION_NAME> -d '{"description": "this is a cool thing", "id": "thing-123", "price": 1.23, "quantity": 1 }' -H 'Content-Type: application/json'
```

### Nearest Neighbor Query
```bash
curl -ivk POST
