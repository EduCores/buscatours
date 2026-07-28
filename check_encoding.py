import os

filepath = r'C:\Users\Admin\Local Sites\buscatours\modern-app\src\components\admin\ToursManagement.tsx'

with open(filepath, 'rb') as f:
    raw = f.read()

print(f'File size: {len(raw)} bytes')

lf = b'\n'
crlf = b'\r\n'
has_crlf = crlf in raw
has_lf = lf in raw
lf_count = raw.count(lf)
crlf_count = raw.count(crlf)

print(f'Has CRLF: {has_crlf}')
print(f'Has LF: {has_lf}')
print(f'LF count: {lf_count}')
print(f'CRLF count: {crlf_count}')
print(f'Starts with: {raw[:20]}')
