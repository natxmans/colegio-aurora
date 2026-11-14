# =========================================================
# Lee el PowerPoint final y apunta, para cada diapositiva con un modelo 3D,
# el edificio y la posicion de su zona 3D (en % de la diapositiva).
# Resultado: js/datos/diapositivas3d.json (lo usa la presentacion del sitio
# para poner el visor 3D EN la diapositiva, en el mismo sitio que en el PowerPoint).
# Uso: powershell -File zonas_3d.ps1
# =========================================================
$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$ppt = Join-Path $raiz 'presentacion\nuestro_colegio_ideal.pptx'
$salida = Join-Path $raiz 'js\datos\diapositivas3d.json'
$app = New-Object -ComObject PowerPoint.Application
$pres = $app.Presentations.Open($ppt, -1, 0, 0)
try {
  $W = $pres.PageSetup.SlideWidth; $H = $pres.PageSetup.SlideHeight
  $lista = @()
  foreach ($sl in $pres.Slides) {
    $z = $null; $id = $null
    foreach ($s in $sl.Shapes) {
      if ($s.Name -eq 'Zona 3D') { $z = $s }
      if ($s.Type -eq 30 -and $s.Name -like 'Modelo 3D - *') { $id = $s.Name.Substring(12) }
    }
    if ($z -and $id) {
      $lista += [ordered]@{ n = $sl.SlideIndex; m = $id;
        x = [math]::Round(100 * $z.Left / $W, 3); y = [math]::Round(100 * $z.Top / $H, 3);
        w = [math]::Round(100 * $z.Width / $W, 3); h = [math]::Round(100 * $z.Height / $H, 3) }
    }
  }
  $json = ConvertTo-Json @($lista) -Compress
  [System.IO.File]::WriteAllText($salida, $json, (New-Object System.Text.UTF8Encoding($false)))
  Write-Output ("{0} diapositivas con 3D -> {1}" -f $lista.Count, $salida)
} finally { $pres.Close(); $app.Quit() }
