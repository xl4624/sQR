# sQR (Secure QR)

sQR is a security-focused QR scanner that helps protect users from malicious QR codes by combining Google's Safe Browsing API with Twitter-like community notes powered by Google Gemini.

## Features
* **Full URL Preview**: See the complete destination URL before visiting.
* **Safe Browsing Check**: Automatically verify against Google's database of unsafe websites.
* **Community Safety Notes**: User-sumbmitted safety reports summarized by Google Gemini.

## How to run
Install:
```bash
git clone git@github.com:xl4624/sQR.git
cd sQR

npm install
pip install -r requirements.txt
# Edit .env with appropriate keys
```

Run:
```bash
python api/app.py && npm start

# Or run separately in different terminals:
python api/app.py
npm start
```

The application will be available at `http://localhost:3000/`

Here is the domain from GoDaddy: realsqr.us (we ran into SSL issues so you can't connect to the server)

## License

MIT Licensese - see [LICENSE](LICENSE)
