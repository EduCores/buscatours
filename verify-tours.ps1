$file = 'C:\Users\Admin\Local Sites\buscatours\modern-app\src\components\admin\ToursManagement.tsx'
$lines = Get-Content $file -Encoding UTF8
Write-Host "Total lines: $($lines.Count)"

# Check last 10 lines
Write-Host "`n--- Last 10 lines ---"
for ($i = [Math]::Max(0, $lines.Count - 10); $i -lt $lines.Count; $i++) {
    Write-Host "$($i+1): $($lines[$i])"
}

# Find TAB comments and export default
Write-Host "`n--- Key markers ---"
for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    if ($line -match 'TAB 1|TAB 2|TAB 3|export default') {
        Write-Host "$($i+1): $($line.Trim())"
    }
}
