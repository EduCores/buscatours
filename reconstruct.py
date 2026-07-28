import re

filepath = r'C:\Users\Admin\Local Sites\buscatours\modern-app\src\components\admin\ToursManagement.tsx'

with open(filepath, 'r', encoding='utf-8-sig') as f:
    content = f.read()

print(f'Corrupted file length: {len(content)} chars')

# Strategy: Insert newlines before known line-starting patterns
# We need to be careful not to break strings or JSX

# Patterns that indicate a new line should start
# These are patterns that appear at the START of a line in the original file
line_start_patterns = [
    r'import ',
    r'export ',
    r'interface ',
    r'const ',
    r'let ',
    r'var ',
    r'function ',
    r'  const ',
    r'  let ',
    r'  // ',
    r'  /* ',
    r'  return',
    r'    ',
    r'      ',
    r'        ',
    r'          ',
    r'            ',
    r'              ',
    r'                ',
]

# More specific: split after certain line-ending patterns
# In the original file, lines ended with ; or } or > or ) followed by newline
# The next line typically starts with import, export, const, whitespace, etc.

# Let's try a different approach: find all positions where we should insert a newline
# by looking for transitions from line-ending to line-starting patterns

positions = []

# Pattern 1: after ';' followed by 'import' or 'export' or 'const' or 'interface' or newline-indicating content
for m in re.finditer(r";(import |export |const |interface |function |\n)", content):
    if m.group(1) != '\n':
        positions.append(m.end() - len(m.group(1)))

# Pattern 2: after '}' followed by similar patterns
for m in re.finditer(r"\}(import |export |const |interface |function |  )", content):
    positions.append(m.end() - len(m.group(1)))

# Pattern 3: after ');\n' type patterns - after closing paren+semicolon
for m in re.finditer(r"\);(import |export |const |interface |  //|  const|  \})", content):
    if m.group(1) != '\n':
        positions.append(m.end() - len(m.group(1)))

# Pattern 4: Before 'import' at position 0+
for m in re.finditer(r"(?<=;)(import )", content):
    positions.append(m.start())

# Pattern 5: Before 'export default'
for m in re.finditer(r"(?<=\n|;)(export default)", content):
    pass  # This won't match since there are no newlines

# Pattern 6: After 'from '...';' before next import/statement
for m in re.finditer(r"from '[^']+';", content):
    end = m.end()
    if end < len(content) and content[end] not in ('\r', '\n'):
        positions.append(end)

# Pattern 7: After closing tags in JSX that end a line
# After ');' before whitespace+keyword
for m in re.finditer(r"\);(\s{2,}(?:const|let|var|return|if|for|while|\/\/|<|>|\}))", content):
    pos = m.end() - len(m.group(1))
    positions.append(pos)

# Pattern 8: After '}' at various indentation levels before similar patterns  
for m in re.finditer(r"\}(\s{2,}(?:const|let|var|return|if|for|while|\/\/|<|>|\}|\)|;))", content):
    pos = m.end() - len(m.group(1))
    positions.append(pos)

# Pattern 9: Before '//' comments (line comments)
for m in re.finditer(r"(\S)(  //)", content):
    positions.append(m.end() - len(m.group(2)))

# Pattern 10: Before JSX comments {/* ... */}
for m in re.finditer(r"(\S)(\{/\*)", content):
    positions.append(m.end() - len(m.group(2)))

# Pattern 11: After '<div' before content that indicates new line
# This is tricky for JSX

# Sort and deduplicate positions
positions = sorted(set(positions))

# Filter out positions that are too close together (less than 5 chars apart)
filtered = [positions[0]] if positions else []
for pos in positions[1:]:
    if pos - filtered[-1] >= 5:
        filtered.append(pos)
positions = filtered

print(f'Found {len(positions)} potential line break positions')

# Insert newlines at these positions
result = []
last_pos = 0
for pos in positions:
    if pos > last_pos and pos <= len(content):
        result.append(content[last_pos:pos])
        result.append('\n')
        last_pos = pos
result.append(content[last_pos:])

new_content = ''.join(result)
new_lines = new_content.split('\n')
print(f'After splitting: {len(new_lines)} lines')

# Write the result
with open(filepath, 'w', encoding='utf-8-sig') as f:
    f.write(new_content)

print(f'Written {len(new_content)} chars')
print(f'First 3 lines:')
for line in new_lines[:3]:
    print(f'  [{len(line)}] {line[:80]}...' if len(line) > 80 else f'  [{len(line)}] {line}')
print(f'Last 3 lines:')
for line in new_lines[-3:]:
    print(f'  [{len(line)}] {line[:80]}...' if len(line) > 80 else f'  [{len(line)}] {line}')
