#!/usr/bin/env python3
"""Reconstruct ToursManagement.tsx - aggressive line break insertion."""
import re

filepath = r'C:\Users\Admin\Local Sites\buscatours\modern-app\src\components\admin\ToursManagement.tsx'

with open(filepath, 'r', encoding='utf-8-sig') as f:
    content = f.read()

content = content.replace('\n', '').replace('\r', '')
print(f'Raw content: {len(content)} chars')

breaks = set()

# Before import keywords
for m in re.finditer(r'import ', content):
    if m.start() > 0:
        breaks.add(m.start())

# Before export keywords
for m in re.finditer(r'export ', content):
    if m.start() > 0:
        breaks.add(m.start())

# Before interface keywords
for m in re.finditer(r'interface ', content):
    if m.start() > 0:
        breaks.add(m.start())

# After ; before keywords
for m in re.finditer(r';(const |let |var |//|return |if |for |while |interface |export |import )', content):
    breaks.add(m.start() + 1)

# After } before keywords/comments
for m in re.finditer(r'\}(const |let |var |//|return |interface |export |import |\{|\))', content):
    breaks.add(m.start() + 1)

# After }); before keywords
for m in re.finditer(r'\}\);(const |let |var |//|return )', content):
    breaks.add(m.start() + 1)

# After }); before whitespace+keyword  
for m in re.finditer(r'\}\);(\s+)(const |let |var |//|return )', content):
    pos = m.start() + 2
    breaks.add(pos)

# Before {/* comments
for m in re.finditer(r'.\{\/\*', content):
    breaks.add(m.start() + 1)

# Before {activeTab
for m in re.finditer(r'.\{activeTab', content):
    if content[m.start()] != '\n':
        breaks.add(m.start() + 1)

# Before <div, </div
for m in re.finditer(r'.<(\/?div)', content):
    ch = content[m.start()]
    if ch not in (' ', '\n', '\t', '<'):
        breaks.add(m.start() + 1)

# Before <form, </form
for m in re.finditer(r'.<(\/?form)', content):
    ch = content[m.start()]
    if ch not in (' ', '\n', '\t', '<'):
        breaks.add(m.start() + 1)

# Before <button, </button
for m in re.finditer(r'.<(\/?button)', content):
    ch = content[m.start()]
    if ch not in (' ', '\n', '\t', '<'):
        breaks.add(m.start() + 1)

# Before <input
for m in re.finditer(r'.<input', content):
    ch = content[m.start()]
    if ch not in (' ', '\n', '\t', '<'):
        breaks.add(m.start() + 1)

# Before <select, </select
for m in re.finditer(r'.<(\/?select)', content):
    ch = content[m.start()]
    if ch not in (' ', '\n', '\t', '<'):
        breaks.add(m.start() + 1)

# Before <textarea, </textarea
for m in re.finditer(r'.<(\/?textarea)', content):
    ch = content[m.start()]
    if ch not in (' ', '\n', '\t', '<'):
        breaks.add(m.start() + 1)

# Before <label, </label
for m in re.finditer(r'.<(\/?label)', content):
    ch = content[m.start()]
    if ch not in (' ', '\n', '\t', '<'):
        breaks.add(m.start() + 1)

# Before <h3, </h3
for m in re.finditer(r'.<(\/?h3)', content):
    ch = content[m.start()]
    if ch not in (' ', '\n', '\t', '<'):
        breaks.add(m.start() + 1)

# Before <p
for m in re.finditer(r'.<p ', content):
    ch = content[m.start()]
    if ch not in (' ', '\n', '\t', '<'):
        breaks.add(m.start() + 1)

# Before <span, </span
for m in re.finditer(r'.<(\/?span)', content):
    ch = content[m.start()]
    if ch not in (' ', '\n', '\t', '<'):
        breaks.add(m.start() + 1)

# Before React components: <Compass, <Map, <MapPin, <Navigation, <Image, <Video, <X, <Star, <Plus, <Trash, <CheckCircle, <ImageUploader
for m in re.finditer(r'.<(Compass|Map|MapPin|Navigation|Image|Video|X|Star|Plus|Trash|CheckCircle|ImageUploader|CalendarDaysIcon|Loader2|Shield|Heart|AlertTriangle|Save|Copy|GripVertical|ChevronDown|ChevronUp|Minus)\b', content):
    ch = content[m.start()]
    if ch not in (' ', '\n', '\t', '<'):
        breaks.add(m.start() + 1)

# Before </Compass etc
for m in re.finditer(r'.<\/(Compass|Map|MapPin|Navigation|Image|Video|X|Star|Plus|Trash|CheckCircle|ImageUploader)\b', content):
    ch = content[m.start()]
    if ch not in (' ', '\n', '\t', '<'):
        breaks.add(m.start() + 1)

# After <option lines - before next <option
for m in re.finditer(r'><option ', content):
    pos = m.start() + 1
    breaks.add(pos)

# Before className= on new lines (after > or ")
# This is tricky, skip for now

# Sort and deduplicate (minimum 2 chars apart)
breaks = sorted(breaks)
filtered = []
for b in breaks:
    if not filtered or b - filtered[-1] >= 2:
        filtered.append(b)
breaks = filtered

print(f'Found {len(breaks)} break positions')

# Build result
result = []
prev = 0
for b in breaks:
    if b > prev and b <= len(content):
        result.append(content[prev:b])
        result.append('\n')
        prev = b
if prev < len(content):
    result.append(content[prev:])

new_content = ''.join(result)
new_lines = new_content.split('\n')
print(f'After splitting: {len(new_lines)} lines')

# Post-process: split very long lines
final_lines = []
for line in new_lines:
    if len(line) > 300:
        # Try splitting on ); patterns
        parts = re.split(r'\);(\s+)', line)
        if len(parts) > 1:
            rebuilt = []
            for i, part in enumerate(parts):
                if i > 0 and i % 2 == 1:
                    # This is whitespace
                    rebuilt.append(');')
                    rebuilt.append(part)
                else:
                    rebuilt.append(part)
            # Actually just split more aggressively on semicolons
            sub = re.split(r';(?=\s+(?:const|let|var|\/\/|return|if|for|while|interface|export|import|\}))', line)
            final_lines.extend(sub)
        else:
            final_lines.append(line)
    else:
        final_lines.append(line)

print(f'After post-processing: {len(final_lines)} lines')

output = '\n'.join(final_lines)
with open(filepath, 'w', encoding='utf-8-sig') as f:
    f.write(output)

print(f'Written {len(final_lines)} lines')

# Show samples
for i, line in enumerate(final_lines[:8]):
    print(f'{i+1}: {line[:120]}')
print('...')
for i, line in enumerate(final_lines[-5:], len(final_lines) - 4):
    print(f'{i}: {line[:120]}')
