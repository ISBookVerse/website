BOOKVERSE — Enhanced Book Discovery Website

WHAT'S INCLUDED
- Refreshed responsive design with a pastel editorial / digital library theme.
- Home page built around The Age of Abundance: Knowledge → Intelligence → Wisdom.
- Book discovery page using the actual Book nodes from the supplied Neo4j Bloom export.
- Search by book title, author, publisher, or ISBN.
- Filters by publication year and author; sort by title, year, or author.
- Book detail pages with available ISBN/year/publisher/node ID fields.
- Knowledge Graph view using real Book–Auther relationships from the supplied export (displayed subset for readability).
- Original CSV exports kept in data/ for traceability.
- Book cover images are attempted through Open Library Covers using each book's ISBN. When no cover is available or internet access is unavailable, designed typographic covers remain as a fallback.

HOW TO RUN
1. Extract the ZIP file.
2. Open the BookVerse folder in VS Code.
3. Open index.html in a browser, or use the Live Server extension in VS Code.
4. Use Explore Books to search/filter the full exported Book collection. Click a book card for details.
5. Use Knowledge Graph to inspect the exported relationships and click nodes to view information.

DATA NOTES
- This website uses the supplied Neo4j Bloom export as a local static dataset. It does not require Neo4j to be running.
- The supplied export contains 300 Book nodes, 241 Auther nodes, and 50 DemoUser nodes. Relationship counts include other graph links; the visible graph is a readable subset of actual Book–Auther relationships.
- Some fields such as publication year and publisher are missing in the source export. The website shows “ไม่ระบุ” instead of inventing values.
- The export does not provide enough user-rating relationships to make reliable personalized recommendations. The homepage's featured books are a discovery shortcut, not personalized recommendations.
- Open Library cover images are external and may not exist for every ISBN. The site remains usable if they fail to load.
