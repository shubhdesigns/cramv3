# PowerShell script to create a workaround for the missing Shiki dependency
# This creates the missing module path and an empty typescript.mjs file

# Create the directory structure
$targetDir = "node_modules\@shikijs\langs\dist"
If (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force
}

# Create an empty typescript.mjs file
$content = "// Empty module to fix Shiki loading error
export default {};
"

Set-Content -Path "$targetDir\typescript.mjs" -Value $content

Write-Host "Created empty typescript.mjs module to fix Shiki error" 