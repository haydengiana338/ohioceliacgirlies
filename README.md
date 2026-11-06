# Gluten Free Girlies website

A responsive website with a split-screen About Us section, state and city filters, and clickable restaurant reviews. The hero intentionally does not display 2026.

## Preview locally

Run `python3 -m http.server 8000` inside this folder, then visit http://localhost:8000. Opening index.html directly may prevent the JSON file from loading in some browsers.

## Publish free with GitHub Pages

1. Sign in to GitHub and create a **new public repository**, for example `gluten-free-girlies`.
2. Upload **all files and folders** in this package to the repository root. Keep the `assets` and `data` folder names unchanged.
3. Go to Settings > Pages > Build and deployment. Choose **Deploy from a branch**, branch `main`, folder `/(root)`, then Save.
4. GitHub will show the public website address after deployment. It may take a few minutes.
5. To update the photo or logo, replace `assets/about.jpg` or `assets/logo.png` with your own images of the same filename and commit.

## Add restaurant posts manually

Edit `data/restaurants.json` in GitHub. The file begins as an empty array because no restaurant facts were supplied. Add entries like the example below, replacing ALL example values with verified details from your actual posts:

```json
[
  {
    "id": "my-first-post",
    "name": "Restaurant name",
    "state": "Ohio",
    "city": "Cleveland",
    "address": "Verified street address",
    "ordered": "What we ordered",
    "caption": "Our real Instagram caption",
    "image": "assets/restaurant-photo.jpg",
    "instagramUrl": "https://www.instagram.com/p/REAL_POST_ID/"
  }
]
```

Upload the corresponding restaurant image into `assets/` (or use an authorized public image URL). The site automatically displays the card and lets visitors search and filter. Add states to the `states` array in `script.js` if you want to show them before any posts exist.

## Instagram automatic updates

The site is ready to display data from `data/restaurants.json`. An Instagram integration is **not connected yet**. GitHub Pages cannot securely store Instagram API credentials in browser JavaScript. A secure scheduled job, serverless function, or approved automation service must read the Instagram API and write approved entries to the JSON file.

Requirements and limits:

* Connect an eligible Instagram professional account through Meta's supported API with the required permissions and access tokens. API availability and permission requirements change.
* Instagram posts do not reliably provide a restaurant name, verified street address, or ordered items as structured fields. These must be supplied in a consistent caption format, manually reviewed, or verified using an authorized places lookup service. Never invent these fields.
* For photos, respect Instagram media access rules and image URL expiration. Avoid copying or scraping without authorization.
* A safe initial workflow is: new post -> draft record -> verify name, address and order -> publish to JSON.

The next setup step is to confirm the account type and choose a secure automation provider, then configure it with your authorization. No Instagram credentials are needed to use the website as it stands.
