$path = 'c:\Users\mashok\li\LicenseOptimization.jsx'
$content = Get-Content -Raw $path
$pattern = '(?m)^(\s+)\{show\("roleCleansing"\) && <td></td>\}'
$matches = [regex]::Matches($content, $pattern)
Write-Host "Matches found: $($matches.Count)"
$replacement = '${1}{show("objectCleansing") && <td></td>}' + "`r`n" + '${1}{show("roleCleansing") && <td></td>}'
$newContent = [regex]::Replace($content, $pattern, $replacement)
[System.IO.File]::WriteAllText($path, $newContent)
Write-Host "Done"
