import re

filepath = r'C:\Users\Admin\Local Sites\buscatours\modern-app\src\components\admin\ToursManagement.tsx'

with open(filepath, 'r', encoding='utf-8-sig') as f:
    content = f.read()

print(f'Input length: {len(content)} chars, {content.count(chr(10))} newlines')

# Much more aggressive splitting
# We'll insert \n before these patterns when they appear after non-whitespace

split_before = [
    'import ',
    'export ',
    'interface ',
    'const ',
    'let ',
    'var ',
    'function ',
    'return ',
    'if ',
    'else ',
    'for ',
    'while ',
    'switch ',
    'case ',
    'break',
    'continue',
    'throw ',
    'try ',
    'catch ',
    'finally ',
    '// ',
    '/* ',
    '/** ',
    '<div',
    '</div',
    '<form',
    '</form',
    '<button',
    '</button',
    '<input',
    '<select',
    '</select',
    '<textarea',
    '</textarea',
    '<label',
    '</label',
    '<h3',
    '</h3',
    '<p ',
    '</p',
    '<span',
    '</span',
    '<a ',
    '</a',
    '<img',
    '<br',
    '<hr',
    '<Compass',
    '<Map',
    '<MapPin',
    '<Navigation',
    '<Image',
    '<Video',
    '<CalendarDaysIcon',
    '<PlusIcon',
    '<TrashIcon',
    '<ImageUploader',
    '<LanguageTabs',
    '<X ',
    '<Star ',
    '<Shield',
    '<Heart',
    '<CheckCircle',
    '<AlertTriangle',
    '<Loader2',
    '<Save',
    '<Copy',
    '<GripVertical',
    '<ChevronDown',
    '<ChevronUp',
    '<Minus',
    '<Plus ',
    '{/*',
    '{activeTab',
    '{itinerary',
    '{[',
    '{t(',
    'onClick',
    'onChange',
    'onSubmit',
    'className=',
    'type=',
    'value=',
    'placeholder=',
    'id=',
    'key=',
    'min=',
    'max=',
    'step=',
    'rows=',
    'required',
    'disabled',
    'checked',
    'multiple',
    'style=',
]

# First pass: insert newlines before these patterns when they follow non-space, non-newline
result = []
i = 0
while i < len(content):
    char = content[i]
    result.append(char)
    
    if char not in (' ', '\n', '\r', '\t'):
        # Check if any split pattern starts at position i+1
        remaining = content[i+1:i+50] if i+1 < len(content) else ''
        for pattern in split_before:
            if remaining.startswith(pattern):
                # Check that current char is a reasonable line-ending
                if char in (';', ')', '>', '}', "'", '"', ','):
                    result.append('\n')
                    break
    
    i += 1

new_content = ''.join(result)

# Second pass: split on more patterns
# After any ';' followed by whitespace and a keyword
new_content = re.sub(r';(  +)(const |let |var |//|return |if |for )', r';\n\1\2', new_content)

# After '}';' followed by content
new_content = re.sub(r"\};(  +)(const |let |var |//|return |interface |export )", r'};\n\1\2', new_content)

# After ');' followed by content at same indent
new_content = re.sub(r"\);(  +)(const |let |var |//|return |if |for )", r');\n\1\2', new_content)

# After '}' before '}' or before keywords at same indent
new_content = re.sub(r"\}(  +)(\}|const |let |var |//|return |export |import |interface )", r'}\n\1\2', new_content)

# Split interface members
new_content = re.sub(r";(  )(onSave|onDelete|guides|vehicles|currentRole|currentOperator|prefilledTour|onClear|tours:)", r';\n\1\2', new_content)

# Split function params
new_content = re.sub(r"(\w),(\s+)(\w)", r'\1,\n\2\3', new_content)

# Split state declarations that are on same line
new_content = re.sub(r"(useState[^;]+);(const \[)", r'\1;\n  \2', new_content)

# Split lines with // comments followed by code
new_content = re.sub(r"(// [^\n]+)(const \[)", r'\1\n  \2', new_content)

# Split JSX attributes onto separate lines for very long lines
# After closing > or /> before content

lines = new_content.split('\n')
print(f'After aggressive splitting: {len(lines)} lines')

# Third pass: split any remaining very long lines (>200 chars) on common patterns
final_lines = []
for line in lines:
    if len(line) > 200:
        # Try to split on '; ' patterns
        parts = re.split(r';(?=\s+(?:const|let|var|//|return|if|for|interface|export|import|\}))', line)
        final_lines.extend(parts)
    else:
        final_lines.append(line)

print(f'After splitting long lines: {len(final_lines)} lines')

new_content = '\n'.join(final_lines)

with open(filepath, 'w', encoding='utf-8-sig') as f:
    f.write(new_content)

print(f'Written {len(new_content)} chars, {len(final_lines)} lines')

# Show some sample lines
for i, line in enumerate(final_lines[:15]):
    print(f'{i+1}: {line[:100]}...' if len(line) > 100 else f'{i+1}: {line}')
print('...')
for i, line in enumerate(final_lines[-5:], len(final_lines)-4):
    print(f'{i}: {line[:100]}...' if len(line) > 100 else f'{i}: {line}')
