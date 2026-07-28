#!/usr/bin/env python3
"""
Reconstruct ToursManagement.tsx by analyzing the corrupted single-line content.
Uses character-by-character analysis to find ALL line break positions.
"""
import re

filepath = r'C:\Users\Admin\Local Sites\buscatours\modern-app\src\components\admin\ToursManagement.tsx'

with open(filepath, 'r', encoding='utf-8-sig') as f:
    raw = f.read()

# Strip any existing newlines
raw = raw.replace('\n', '').replace('\r', '')
print(f'Raw: {len(raw)} chars')

# Walk through the content character by character
# Track context to determine line breaks
lines = []
current_line = []
i = 0

# Simple but effective: split after these sequences when followed by a keyword
# Pattern: end-of-statement char + whitespace* + start-of-statement keyword

keywords_start_line = [
    'import ', 'export ', 'interface ', 'const ', 'let ', 'var ',
    'function ', 'return ', 'if ', 'else ', 'for ', 'while ',
    'switch ', 'case ', 'break', 'throw ', 'try ', 'catch ',
    '// ', '/* ', '/** ', '{/*', '{activeTab', '{itinerary',
    '{['
]

jsx_tags = [
    '<div', '</div', '<form', '</form', '<button', '</button',
    '<input', '<select', '</select', '<textarea', '</textarea',
    '<label', '</label', '<h3', '</h3', '<p ', '</p',
    '<span', '</span', '<option', '</option',
    '<Compass', '<Map ', '<MapPin', '<Navigation', '<Image ',
    '<Video', '<X ', '<Star ', '<Plus', '<Trash',
    '<CheckCircle', '<ImageUploader', '<CalendarDaysIcon',
    '<Loader2', '<Shield', '<Heart', '<AlertTriangle',
    '<Save', '<Copy', '<GripVertical',
]

result = []
pos = 0

while pos < len(raw):
    # Check if we should insert a line break here
    should_break = False
    
    # Don't break at position 0
    if pos > 0:
        remaining = raw[pos:pos+60]
        
        # Check for keyword starts
        for kw in keywords_start_line:
            if remaining.startswith(kw):
                # Check if previous char is a line-ending type
                prev = raw[pos-1] if pos > 0 else ''
                prev2 = raw[pos-2:pos] if pos > 1 else ''
                if prev in (';', ')', '}', '>', "'", '"', ',', ' ') or prev2 in (');', '},', '})'):
                    should_break = True
                    break
        
        # Check for JSX tags
        if not should_break:
            for tag in jsx_tags:
                if remaining.startswith(tag):
                    prev = raw[pos-1] if pos > 0 else ''
                    if prev in ('>', ')', '"', "'", ' ', '}', '/'):
                        should_break = True
                        break
        
        # After }; before content
        if not should_break and pos >= 2:
            two_back = raw[pos-2:pos]
            if two_back == '};':
                # Check what comes next
                next_char = raw[pos] if pos < len(raw) else ''
                if next_char in (' ', '\t', 'c', 'l', 'v', '/', 'r', 'i', 'f', 'w', '{', 'e', 'i', 'e', '<'):
                    should_break = True
        
        # After }); before content
        if not should_break and pos >= 3:
            three_back = raw[pos-3:pos]
            if three_back == '});':
                next_char = raw[pos] if pos < len(raw) else ''
                if next_char in (' ', 'c', 'l', 'v', '/', 'r', 'i', 'f', 'w', '{'):
                    should_break = True
        
        # After )\n pattern - after closing paren+something before keyword
        if not should_break and pos >= 1:
            if raw[pos-1] == ')' and pos < len(raw):
                remaining = raw[pos:pos+30]
                for kw in keywords_start_line:
                    if remaining.lstrip().startswith(kw.strip()):
                        should_break = True
                        break
    
    if should_break:
        line_text = ''.join(current_line)
        if line_text.strip():
            result.append(line_text)
        current_line = []
    
    current_line.append(raw[pos])
    pos += 1

# Don't forget the last line
if current_line:
    line_text = ''.join(current_line)
    if line_text.strip():
        result.append(line_text)

print(f'Initial split: {len(result)} lines')

# Post-process: split any remaining very long lines (>200 chars)
final = []
for line in result:
    if len(line) > 200:
        # Try to split on semicolons before keywords
        parts = re.split(r';(?= (?:const|let|var|\/\/|return|if|for|while|interface|export|import))', line)
        if len(parts) > 1:
            final.extend(parts)
        else:
            # Try splitting on } before keywords
            parts2 = re.split(r'\}(?= (?:const|let|var|\/\/|return|interface|export|import|\{|\)))', line)
            if len(parts2) > 1:
                final.extend(parts2)
            else:
                final.append(line)
    else:
        final.append(line)

print(f'After post-processing: {len(final)} lines')

# Write
output = '\n'.join(final)
with open(filepath, 'w', encoding='utf-8-sig') as f:
    f.write(output)

print(f'Written: {len(final)} lines, {len(output)} chars')

# Verify: show first and last lines
for i, line in enumerate(final[:5]):
    print(f'{i+1}: {line[:120]}')
print('...')
for i, line in enumerate(final[-5:], len(final)-4):
    print(f'{i}: {line[:120]}')
