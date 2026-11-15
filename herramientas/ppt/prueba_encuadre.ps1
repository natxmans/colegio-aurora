# =========================================================
# PRUEBA DEL ENCUADRE de los modelos 3D del PowerPoint
# Para cada modelo: 216 vistas "con el raton" (24 direcciones x 9 inclinaciones, de -30 a 90 = tejado)
# -> el marco del modelo NO debe salir de su zona 3D (PowerPoint ajusta el marco al girar).
# Ademas: 60 giros al azar con el edificio inclinado de lado (balanceo): se cuenta cuantos salen.
# No guarda nada (abre el archivo en solo lectura). Uso: powershell -File prueba_encuadre.ps1
# =========================================================
$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$f = Join-Path $raiz 'presentacion\nuestro_colegio_ideal.pptx'
function Angulos([double]$az, [double]$alt) {
  $a = $alt * [math]::PI / 180; $b = -$az * [math]::PI / 180
  $ca = [math]::Cos($a); $sa = [math]::Sin($a); $cb = [math]::Cos($b); $sb = [math]::Sin($b)
  $beta = [math]::Asin($ca * $sb); $alpha = [math]::Atan2($sa, $ca * $cb); $gamma = [math]::Atan2($sa * $sb, $cb)
  return @(($alpha * 180 / [math]::PI), ($beta * 180 / [math]::PI), ($gamma * 180 / [math]::PI))
}
$app = New-Object -ComObject PowerPoint.Application
$pres = $app.Presentations.Open($f, -1, 0, 0)
$rnd = New-Object System.Random 7
$tot = 0; $malos = 0; $totR = 0; $malosR = 0
try {
  foreach ($sl in $pres.Slides) {
    $z = $null; $mod = $null
    foreach ($s in $sl.Shapes) { if ($s.Name -eq 'Zona 3D') { $z = $s }; if ($s.Type -eq 30) { $mod = $s } }
    if (-not $mod) { continue }
    $zL = $z.Left; $zT = $z.Top; $zR = $z.Left + $z.Width; $zB = $z.Top + $z.Height
    $ini = "{0}% x {1}%" -f [math]::Round(100 * $mod.Width / ($z.Width - 16)), [math]::Round(100 * $mod.Height / ($z.Height - 16))
    $m = 0; $peor = 0
    foreach ($alt in -30, -15, 0, 15, 30, 45, 60, 75, 90) { for ($az = 0; $az -lt 360; $az += 15) {
      $g = Angulos $az $alt
      $mod.Model3D.RotationX = [single]$g[0]; $mod.Model3D.RotationY = [single]$g[1]; $mod.Model3D.RotationZ = [single]$g[2]
      $sale = [math]::Max([math]::Max($zL - $mod.Left, $zT - $mod.Top), [math]::Max(($mod.Left + $mod.Width) - $zR, ($mod.Top + $mod.Height) - $zB))
      $tot++; if ($sale -gt 0.5) { $malos++; $m++ }; if ($sale -gt $peor) { $peor = $sale }
    } }
    $mr = 0
    for ($k = 0; $k -lt 60; $k++) {
      $mod.Model3D.RotationX = [single]$rnd.Next(0, 360); $mod.Model3D.RotationY = [single]$rnd.Next(0, 360); $mod.Model3D.RotationZ = [single]$rnd.Next(0, 360)
      $sale = [math]::Max([math]::Max($zL - $mod.Left, $zT - $mod.Top), [math]::Max(($mod.Left + $mod.Width) - $zR, ($mod.Top + $mod.Height) - $zB))
      $totR++; if ($sale -gt 0.5) { $malosR++; $mr++ }
    }
    "{0,2} {1,-13} al empezar {2,-10} | vistas con el raton fuera de la zona: {3}/216 (max {4:N1} pt) | giros al azar fuera: {5}/60" -f $sl.SlideIndex, $mod.Name.Substring(12), $ini, $m, $peor, $mr
  }
  "TOTAL vistas con el raton fuera de la zona: $malos / $tot   |   giros al azar (inclinado de lado) fuera: $malosR / $totR"
} finally { $pres.Saved = -1; $pres.Close(); $app.Quit() }
