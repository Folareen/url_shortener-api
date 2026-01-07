a challenge by roadmap.sh 
# URL Shortening Service

Challenge by [roadmap.sh](https://roadmap.sh/projects/url-shortening-service).

## Setup

1. Clone the repository:
	```bash
	git clone <repo-url>
	cd url_shortener-api
	```

2. Install dependencies:
	```bash
	npm install
	# or
	yarn install
	```

3. Start PostgreSQL using Docker Compose:
	```bash
	docker-compose up -d
	```

4. Copy `.env.example` to `.env` and update the values as needed.

5. Run database migrations:
	```bash
	npx prisma migrate dev
	```

6. Start the development server:
	```bash
	npm run start:dev
	```

## API Endpoints

### Create Short URL
POST /url
Request body:
```
{
  "url": "https://example.com"
}
```

### Redirect to Original URL
GET /:shortCode

### Get Short URL Stats
GET /url/:shortCode/stats

### Update Short URL
PATCH /url/:shortCode
Request body:
```
{
  "url": "https://new-destination.com"
}
```

### Delete Short URL
DELETE /url/:shortCode