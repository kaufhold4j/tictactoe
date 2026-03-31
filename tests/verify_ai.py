import os
from playwright.sync_api import sync_playwright

def run_cuj(page, screenshot_dir, video_dir):
    page.goto("http://localhost:5173")
    page.wait_for_timeout(1000)

    # Enable CPU mode
    page.locator(".cpu-toggle").click()
    page.wait_for_timeout(500)

    squares = page.locator(".square")

    # X (User) vs O (CPU)
    # X at 0
    squares.nth(0).click()
    page.wait_for_timeout(1000) # Wait for O

    # X at 1
    squares.nth(1).click()
    page.wait_for_timeout(1000) # Wait for O (O should block at 2)

    # Take screenshot of the board showing O blocked X
    screenshot_path = os.path.join(screenshot_dir, "ai_move.png")
    page.screenshot(path=screenshot_path)

if __name__ == "__main__":
    # Use environment variables or defaults
    screenshot_dir = os.environ.get("SCREENSHOT_DIR", "/home/jules/verification/screenshots")
    video_dir = os.environ.get("VIDEO_DIR", "/home/jules/verification/videos")

    os.makedirs(screenshot_dir, exist_ok=True)
    os.makedirs(video_dir, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir=video_dir
        )
        page = context.new_page()
        try:
            run_cuj(page, screenshot_dir, video_dir)
        finally:
            context.close()
            browser.close()
