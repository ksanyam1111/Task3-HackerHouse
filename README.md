# Task 3 - HackerHouse

This project contains a face recognition + social media post finder + blockchain write pipeline.

> [!IMPORTANT]
> **Highly Recommended:** Please use **Python version 3.12.9** along with a virtual environment for the best compatibility and isolated setup.

## Setup Instructions

1. **Ensure you have Python 3.12.9 installed.**
   You can check your Python version by running:
   ```bash
   python --version
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv .venv
   ```

3. **Activate the virtual environment:**
   - **Windows:**
     ```bash
     .venv\Scripts\activate
     ```
   - **macOS/Linux:**
     ```bash
     source .venv/bin/activate
     ```

4. **Install the required dependencies:**
   Make sure you are in the project root directory and your virtual environment is active.
   ```bash
   pip install -r requirements.txt
   ```

5. **Environment Configuration:**
   Ensure your `.env` file is properly configured with any necessary API keys or environment variables required by the application.

## How to Run

To start the main application pipeline, run:

```bash
python main.py
```

> [!NOTE]
> **Initial Startup Time:** The first time you run the application, some face recognition models will need to be downloaded automatically. This process will take some time, so please be patient during the initial run. Subsequent runs will be much faster.
