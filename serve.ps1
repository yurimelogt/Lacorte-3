$port = 8080
$path = $PSScriptRoot

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "=========================================================="
    Write-Host "Servidor Web Ativo em: http://localhost:$port/"
    Write-Host "Pasta Raiz: $path"
    Write-Host "Pressione Ctrl+C para encerrar."
    Write-Host "=========================================================="

    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            $rawUrl = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath)
            if ($rawUrl -eq "/") { $rawUrl = "/index.html" }
            
            $localPath = [System.IO.Path]::Combine($path, $rawUrl.TrimStart('/'))

            if ([System.IO.File]::Exists($localPath)) {
                $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
                $mime = "application/octet-stream"
                switch ($ext) {
                    ".html" { $mime = "text/html; charset=utf-8" }
                    ".css"  { $mime = "text/css; charset=utf-8" }
                    ".js"   { $mime = "application/javascript; charset=utf-8" }
                    ".json" { $mime = "application/json; charset=utf-8" }
                    ".webp" { $mime = "image/webp" }
                    ".jpeg" { $mime = "image/jpeg" }
                    ".jpg"  { $mime = "image/jpeg" }
                    ".png"  { $mime = "image/png" }
                    ".svg"  { $mime = "image/svg+xml" }
                    ".mp4"  { $mime = "video/mp4" }
                    ".pdf"  { $mime = "application/pdf" }
                }

                $response.ContentType = $mime
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")
                $response.AddHeader("Pragma", "no-cache")
                $response.AddHeader("Expires", "0")
                $buffer = [System.IO.File]::ReadAllBytes($localPath)
                $response.ContentLength64 = $buffer.Length
                try {
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } catch {
                    # Conexão encerrada pelo cliente (reload / cancel) ignorada com segurança
                }
            } else {
                $response.StatusCode = 404
                $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("404 - Arquivo nao encontrado")
                try {
                    $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length)
                } catch {}
            }
            try { $response.Close() } catch {}
        } catch {
            # Captura qualquer exceção do loop sem derrubar o listener
        }
    }
} finally {
    try { $listener.Stop() } catch {}
}
