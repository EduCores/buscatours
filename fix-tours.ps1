$file = 'C:\Users\Admin\Local Sites\buscatours\modern-app\src\components\admin\ToursManagement.tsx'
$lines = Get-Content $file -Encoding UTF8
$total = $lines.Count
Write-Host "Total lines: $total"

# Part 1: lines 1-692 (0-indexed: 0-691)
$part1 = $lines[0..691]

# Part 2: DETALLE closing tags
$part2 = @(
    '                </div>',
    '              </div>',
    '            )}',
    ''
)

# Part 3: lines 846-1107 (0-indexed: 845-1106)
$part3 = $lines[845..($total-1)]

# Part 4: Final closing tags
$part4 = @(
    '',
    '          </div>',
    '        </form>',
    '      </div>',
    '    );',
    '  }',
    ''
)

# Combine all parts
$newContent = $part1 + $part2 + $part3 + $part4
$newContent | Set-Content $file -Encoding UTF8 -NoNewline
Write-Host "New line count: $($newContent.Count)"
