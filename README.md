 CNA Web Tool

# Requirements
- Python 3.11+
- Node.js 18+ and npm

# connection notes
I have a proxy set up in vite.config.js 
that connects the dev server, so all frontend request are set up to the Flask backend.


# Backend Setup
```bash

# 1) cd into backend directory  and install these 
cd backend


# 2) create a virtual and activate env

    #if on mac
    python3 -m venv .venv

    source .venv/bin/activate


    # or if on windows machine 
    python -m venv .venv

    .venv\Scripts\activate 

# 3) then install the dependencies from the reqs file
pip install -r requirements.txt

#4) now you can the backend 
python -m flask run

```
# Frontend Setup
```bash
 
# 1) now in a new terminal run these commands 
cd frontend
npm install
npm run dev 


