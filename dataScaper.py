from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import json
import time

url = "https://www.rok.guide/buildings/lyceum-of-wisdom/"

options = Options()
options.add_argument("--headless")  # run Chrome in headless mode
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")

driver = webdriver.Chrome(options=options)
driver.get(url)

# Wait for JS to render content
time.sleep(5)  # increase if data still not showing

# Get page source after rendering
soup = BeautifulSoup(driver.page_source, 'html.parser')
driver.quit()

# Now you can extract the table content
table = soup.find('table', {'id': 'footable_4551'})
qa_list = []

if table:
    rows = table.find_all('tr')[1:]
    for row in rows:
        question_td = row.find('td', class_='ninja_column_0 ninja_clmn_nm_questions footable-first-visible')
        answer_td = row.find('td', class_='ninja_column_1 ninja_clmn_nm_answers footable-last-visible')
        if question_td and answer_td:
            question = question_td.get_text(strip=True)
            answer = answer_td.get_text(strip=True)
            qa_list.append({
                'question': question,
                'answer': answer
            })

# Save to JSON
with open("rok_questions.json", "w", encoding="utf-8") as f:
    json.dump(qa_list, f, indent=2, ensure_ascii=False)

print(f"Scraped {len(qa_list)} Q&A items.")
