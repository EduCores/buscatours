#!/usr/bin/env python3
"""
Reconstruct ToursManagement.tsx from corrupted single-line version.
Uses aggressive pattern matching to find all line break positions.
"""

filepath = r'C:\Users\Admin\Local Sites\buscatours\modern-app\src\components\admin\ToursManagement.tsx'

with open(filepath, 'r', encoding='utf-8-sig') as f:
    content = f.read()

# Strip to raw content (no newlines)
content = content.replace('\n', '').replace('\r', '')
print(f'Raw content: {len(content)} chars')

# We'll build a list of positions where newlines should be inserted
breaks = set()

import re

# 1. Before every 'import ' keyword (except at position 0)
for m in re.finditer(r'(?<!\w)import ', content):
    if m.start() > 0:
        breaks.add(m.start())

# 2. Before every 'export ' keyword
for m in re.finditer(r'(?<!\w)export ', content):
    if m.start() > 0:
        breaks.add(m.start())

# 3. Before every 'interface ' keyword
for m in re.finditer(r'(?<!\w)interface ', content):
    if m.start() > 0:
        breaks.add(m.start())

# 4. After every ';' followed by a keyword, comment, or whitespace+keyword
for m in re.finditer(r';(\s*(?:const |let |var |//|return |if |else|for |while |interface |export |import |{/\*|\{activeTab))', content):
    # Find where the next meaningful content starts
    pos = m.start() + 1
    # Skip whitespace
    while pos < len(content) and content[pos] in (' ', '\t'):
        pos += 1
    breaks.add(pos)

# 5. After every '}' followed by keyword/comment/whitespace+keyword
for m in re.finditer(r'\}(\s*(?:const |let |var |//|return |interface |export |import |\{|\)|;))', content):
    pos = m.start() + 1
    while pos < len(content) and content[pos] in (' ', '\t'):
        pos += 1
    breaks.add(pos)

# 6. After ');' followed by code
for m in re.finditer(r'\);(\s*(?:const |let |var |//|return |if |for |while ))', content):
    pos = m.start() + 1
    while pos < len(content) and content[pos] in (' ', '\t'):
        pos += 1
    breaks.add(pos)

# 7. Before '{/*' JSX comments
for m in re.finditer(r'\S\{\/\*', content):
    breaks.add(m.start() + 1)

# 8. After '>' before JSX content (closing tag followed by text/tag)
# This is tricky - only do it for specific patterns

# 9. Before JSX closing tags on new lines: </div>, </form>, etc.
for m in re.finditer(r'\S(</(?:div|form|button|select|textarea|label|h3|p|span|table))', content):
    # Only if preceded by content that looks like end-of-line
    pos = m.start() + 1
    breaks.add(pos)

# 10. Before JSX opening tags that start new elements: <div, <form, <button, etc.
for m in re.finditer(r'[>\)'"]\s*(<(?:div|form|button|input|select|textarea|label|h3|p|span|ImageUploader|LanguageTabs))', content):
    # Find the position of the <
    tag_start = m.start(2) if m.lastindex >= 2 else m.end() - len(m.group(0))
    # Find the < position
    idx = content.find('<', m.start())
    if idx >= 0:
        breaks.add(idx)

# 11. Before '{activeTab' conditions
for m in re.finditer(r';\{activeTab', content):
    breaks.add(m.start() + 1)

# 12. Before '{itinerary' 
for m in re.finditer(r'\n?\{itinerary', content):
    pass  # no newlines in content

for m in re.finditer(r';\{itinerary', content):
    breaks.add(m.start() + 1)

# 13. Before '{[' arrays
for m in re.finditer(r';\{\[', content):
    breaks.add(m.start() + 1)

# 14. Before '{t(' translation calls at start of JSX content
for m in re.finditer(r'>\{t\(', content):
    pass  # Don't split here - these are inline

# 15. After '}' before closing '}' or ')' - these are block endings
for m in re.finditer(r'\}\)(\))', content):
    breaks.add(m.start() + 2)

# 16. Before '<Compass', '<Map', etc. (React components in JSX)
for m in re.finditer(r'[>"\s]<(Compass|Map|MapPin|Navigation|Image|Video|CalendarDaysIcon|PlusIcon|TrashIcon|X|Star|Shield|Heart|CheckCircle|AlertTriangle|Loader2|Save|Copy|GripVertical|ChevronDown|ChevronUp|Minus|Plus)\b', content):
    idx = content.find('<', m.start())
    if idx >= 0:
        breaks.add(idx)

# Sort and filter breaks
breaks = sorted(breaks)

# Remove duplicates that are too close (within 3 chars)
filtered = []
for b in breaks:
    if not filtered or b - filtered[-1] >= 3:
        filtered.append(b)
breaks = filtered

print(f'Found {len(breaks)} break positions')

# Build result
result = []
prev = 0
for b in breaks:
    if b > prev:
        result.append(content[prev:b])
        result.append('\n')
        prev = b
result.append(content[prev:])

new_content = ''.join(result)
new_lines = new_content.split('\n')
print(f'Result: {len(new_lines)} lines')

# Post-process: fix lines that are still too long (>200 chars)
final_lines = []
for line in new_lines:
    if len(line) > 200:
        # Try to split on additional patterns
        sub_parts = re.split(r"(?<=[;>)\"'])\s{2,}(?=(?:const|let|var|//|return|if|for|while|interface|export|import|\{|\}))", line)
        final_lines.extend(sub_parts)
    else:
        final_lines.append(line)

print(f'After post-processing: {len(final_lines)} lines')

# Write
output = '\n'.join(final_lines)
with open(filepath, 'w', encoding='utf-8-sig') as f:
    f.write(output)

print(f'Written {len(output)} chars')

# Show samples
for i, line in enumerate(final_lines[:5]):
    print(f'{i+1}: {line[:120]}')
print('...')
for i, line in enumerate(final_lines[-5:], len(final_lines) - 4):
    print(f'{i}: {line[:120]}')
