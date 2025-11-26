# Data Ingestion

## How to Use

1. **Add PDFs**: Place PDF files in `data/pdfs/` folder
2. **Add URLs**: Add website URLs (one per line) in `data/urls.txt`
3. **Run ingestion**: `npm run ingest`

## Example

```bash
# Add your PDFs
cp my-document.pdf data/pdfs/

# Add URLs to urls.txt
echo "https://example.com" >> data/urls.txt

# Run ingestion
npm run ingest
```
