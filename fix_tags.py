import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Remove all occurrences of the blanket tags
    content = content.replace(' @Smoke', '')
    content = content.replace(' @Regression', '')
    content = content.replace(' @API', '')

    filename = os.path.basename(filepath)
    
    # We want to add the specific tags to ONLY the FIRST test(...) inside the file.
    # To do this safely without messing up test.describe, let's target specifically test( or test.only(
    category_tags = ""
    if filename == "user-authentication.spec.ts":
        category_tags = " @Smoke"
    elif filename == "checkout-flow.spec.ts":
        category_tags = " @Regression"
    elif filename == "product-search.spec.ts":
        category_tags = " @Smoke @Regression"
    elif filename == "api-users.spec.ts" and "storedemo tests" in filepath: 
        category_tags = " @API"
        
    if category_tags:
        # Match the first test(...) or test.only(...) (not test.describe)
        pattern = r"(test(?:\.(?:only|skip))?\s*\(\s*['\"`])([^'\"`]+?)(['\"`]\s*,)"
        def replacer(match):
            return f"{match.group(1)}{match.group(2)}{category_tags}{match.group(3)}"
            
        content = re.sub(pattern, replacer, content, count=1)

    with open(filepath, 'w') as f:
        f.write(content)
    print(f"Fixed tags in {filepath}")

def main():
    base_dir = '/Users/krupa/storedemo-playwright-tests/tests'
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.spec.ts'):
                process_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
