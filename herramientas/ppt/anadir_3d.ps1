# =========================================================
# ANADE LOS EDIFICIOS EN 3D AL POWERPOINT
# Parte de la presentacion de 12 diapositivas (base-12-diapositivas.pptx) y,
# siguiendo plan-3d.json:
#   - cambia la foto de cada diapositiva de edificio por el MODELO 3D real
#     (los mismos modelos que la maqueta del sitio: modelos/<id>.glb)
#   - anade una diapositiva por edificio que no tenia la suya
#   - pone un boton "Girar en 3D" que abre el visor 3D del sitio
# Despues guarda presentacion/nuestro_colegio_ideal.pptx y exporta las
# imagenes de las diapositivas para el sitio (img/diapositivas).
# Necesita PowerPoint (Microsoft 365). Uso: powershell -File anadir_3d.ps1
# (Los textos con acentos estan en plan-3d.json y modelos/modelos.json.)
# =========================================================
$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$plan = Get-Content (Join-Path $PSScriptRoot 'plan-3d.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$modelos = Get-Content (Join-Path $raiz 'modelos\modelos.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$info = Get-Content (Join-Path $raiz 'modelos\info.json') -Raw -Encoding UTF8 | ConvertFrom-Json   # tamano de cada modelo (m)
$base = Join-Path $PSScriptRoot 'base-12-diapositivas.pptx'
$trabajo = Join-Path $env:TEMP ('colegio-3d-' + [guid]::NewGuid().ToString('N').Substring(0, 8) + '.pptx')
$salida = Join-Path $raiz 'presentacion\nuestro_colegio_ideal.pptx'
$imgDir = Join-Path $raiz 'img\diapositivas'
$T = $plan.textos

function Color([int]$r, [int]$g, [int]$b) { return $r + 256 * $g + 65536 * $b }
$MARINO = Color 20 40 90; $GRIS = Color 91 100 120; $BORDE = Color 208 216 222; $BLANCO = Color 255 255 255; $BEIGE = Color 236 226 207

# Angulos de PowerPoint (X, Y, Z) para ver el modelo desde [azimut, altura] como en el visor 3D.
# PowerPoint gira el modelo con R = Rz . Ry . Rx; queremos R = Rx(altura) . Ry(-azimut).
function Angulos([double]$az, [double]$alt) {
  $a = $alt * [math]::PI / 180; $b = -$az * [math]::PI / 180
  $ca = [math]::Cos($a); $sa = [math]::Sin($a); $cb = [math]::Cos($b); $sb = [math]::Sin($b)
  $beta = [math]::Asin($ca * $sb); $alpha = [math]::Atan2($sa, $ca * $cb); $gamma = [math]::Atan2($sa * $sb, $cb)
  return @(($alpha * 180 / [math]::PI), ($beta * 180 / [math]::PI), ($gamma * 180 / [math]::PI))
}
function Modelo($id) { foreach ($m in $modelos) { if ($m.id -eq $id) { return $m } }; throw "Modelo desconocido: $id" }

function ZonaDe3D($sl, [double]$L, [double]$Tp, [double]$W, [double]$H, $m) {
  # quitar las fotos de la diapositiva
  for ($i = $sl.Shapes.Count; $i -ge 1; $i--) { $s = $sl.Shapes.Item($i); if ($s.Type -eq 13) { $s.Delete() } }
  # fondo de la zona 3D: blanco arriba, beige abajo, borde fino como las tarjetas
  $p = $sl.Shapes.AddShape(5, $L, $Tp, $W, $H)
  $p.Name = 'Zona 3D'
  $p.Adjustments.Item(1) = 0.045
  $p.Fill.TwoColorGradient(1, 1); $p.Fill.ForeColor.RGB = $BLANCO; $p.Fill.BackColor.RGB = $BEIGE
  $p.Line.ForeColor.RGB = $BORDE; $p.Line.Weight = 0.75
  $p.Shadow.Visible = 0
  # leyenda
  $ley = $sl.Shapes.AddTextbox(1, $L + 12, $Tp + $H - 36, $W - 168, 30)
  $ley.Name = 'Leyenda 3D'
  $ley.TextFrame.WordWrap = -1; $ley.TextFrame.AutoSize = 0
  $ley.TextFrame.MarginLeft = 4; $ley.TextFrame.MarginRight = 0; $ley.TextFrame.MarginTop = 0; $ley.TextFrame.MarginBottom = 0; $ley.TextFrame.VerticalAnchor = 3
  $r = $ley.TextFrame.TextRange; $r.Text = $T.leyenda
  $r.Font.Name = 'Arial'; $r.Font.Size = 9.5; $r.Font.Color.RGB = $GRIS
  # boton que abre el visor 3D del sitio (funciona tambien durante la presentacion)
  $b = $sl.Shapes.AddShape(5, $L + $W - 150, $Tp + $H - 36, 136, 26)
  $b.Name = 'Boton Girar en 3D'
  $b.Adjustments.Item(1) = 0.5
  $b.Fill.Solid(); $b.Fill.ForeColor.RGB = $MARINO; $b.Fill.Transparency = 0; $b.Line.Visible = 0; $b.Shadow.Visible = 0
  $b.TextFrame.MarginLeft = 4; $b.TextFrame.MarginRight = 4; $b.TextFrame.MarginTop = 0; $b.TextFrame.MarginBottom = 0
  $rb = $b.TextFrame.TextRange; $rb.Text = $T.boton
  $rb.Font.Name = 'Arial'; $rb.Font.Size = 11; $rb.Font.Bold = -1; $rb.Font.Color.RGB = $BLANCO
  $rb.ParagraphFormat.Alignment = 2
  $b.ActionSettings.Item(1).Hyperlink.Address = $plan.url + $m.id
  $b.ActionSettings.Item(1).Hyperlink.ScreenTip = $T.pista
  # el modelo 3D
  $iL = $L + 10; $iT = $Tp + 10; $iW = $W - 20; $iH = $H - 10 - 44
  $glb = Join-Path $raiz ('modelos\' + $m.id + '.glb')
  $sh = $sl.Shapes.Add3DModel($glb, 0, -1, $iL, $iT, $iW, $iH)
  # Tamano: PowerPoint ajusta el marco al modelo cada vez que se gira (el edificio nunca se corta).
  # Para que el marco tampoco salga NUNCA de la zona, el modelo se escala para que su
  # diagonal quepa en la zona: asi cabe girado en cualquier direccion.
  # Visto desde arriba (poca profundidad, casi sin perspectiva) el marco mide el ancho x el largo reales del modelo.
  $tam = @($info.($m.id).tam | ForEach-Object { [double]$_ })
  $sh.Model3D.RotationX = 90; $sh.Model3D.RotationY = 0; $sh.Model3D.RotationZ = 0
  $escala = [math]::Min([double]$sh.Width / $tam[0], [double]$sh.Height / $tam[2])   # puntos por metro ahora
  $diag = [math]::Sqrt($tam[0] * $tam[0] + $tam[1] * $tam[1] + $tam[2] * $tam[2])
  $objetivo = 0.95 * [math]::Min($iW, $iH) / $diag                             # puntos por metro deseados
  $ang = Angulos $m.giro[0] $m.giro[1]
  $sh.Model3D.RotationX = $ang[0]; $sh.Model3D.RotationY = $ang[1]; $sh.Model3D.RotationZ = $ang[2]
  $sh.LockAspectRatio = -1
  $sh.Width = [single]([double]$sh.Width * $objetivo / $escala)
  $cx = $iL + $iW / 2; $cy = $iT + $iH / 2
  $sh.Left = [single]($cx - $sh.Width / 2); $sh.Top = [single]($cy - $sh.Height / 2)
  $sh.Name = 'Modelo 3D - ' + $m.id
  $sh.AlternativeText = 'Modelo 3D: ' + $m.nombre + ' (Colegio Pablo Picasso)'
  return $sh
}

Copy-Item $base $trabajo -Force
$app = New-Object -ComObject PowerPoint.Application
$pres = $app.Presentations.Open($trabajo, 0, 0, 0)
try {
  # 1) identificar las 12 diapositivas de la base
  $ids = @{}
  for ($i = 1; $i -le $pres.Slides.Count; $i++) { $ids[$i] = $pres.Slides.Item($i).SlideID }
  # 2) crear las diapositivas nuevas (copias de la diapositiva de su seccion, colocadas detras)
  $ultimo = @{}
  foreach ($e in $plan.diapositivas) {
    if ($e.tras) {
      $padre = $pres.Slides.FindBySlideID($ids[[int]$e.tras])
      $antes = if ($ultimo.ContainsKey([int]$e.tras)) { $pres.Slides.FindBySlideID($ultimo[[int]$e.tras]) } else { $padre }
      $dup = $padre.Duplicate().Item(1)   # la copia aparece justo detras de la seccion
      $d = $dup.SlideIndex; $a = $antes.SlideIndex
      if ($d -lt $a) { $dup.MoveTo($a) } elseif ($d -gt $a + 1) { $dup.MoveTo($a + 1) }   # detras de la ultima copia
      $ultimo[[int]$e.tras] = $dup.SlideID
      $e | Add-Member -NotePropertyName id -NotePropertyValue $dup.SlideID -Force
    } else {
      $e | Add-Member -NotePropertyName id -NotePropertyValue $ids[[int]$e.base] -Force
    }
  }
  # 3) poner los modelos 3D
  foreach ($e in $plan.diapositivas) {
    $sl = $pres.Slides.FindBySlideID($e.id)
    $m = Modelo $e.modelo
    if ($e.tras) {
      # diapositiva nueva: titulo + una tarjeta con la descripcion + una zona 3D grande
      $sl.Shapes.Item('TextBox 1').TextFrame.TextRange.Paragraphs(2).Text = $e.titulo
      for ($i = $sl.Shapes.Count; $i -ge 1; $i--) {
        $s = $sl.Shapes.Item($i)
        if ($s.Type -eq 1 -and $s.Name -ne 'Rounded Rectangle 3') { $s.Delete() }
      }
      $c = $sl.Shapes.Item('Rounded Rectangle 3')
      $c.Left = 43.2; $c.Top = 115.2; $c.Width = 273.6; $c.Height = 381.6
      $c.TextFrame.VerticalAnchor = 3
      $tr = $c.TextFrame.TextRange
      $p1 = $tr.Paragraphs(1); $p1.Characters(1, $p1.Length - 1).Text = $m.nombre
      $tr.Paragraphs(2).Text = [string][char]0x2022 + '  ' + $m.desc
      $tr.InsertAfter("`r" + [string][char]0x2022 + '  ' + $T.consejo) | Out-Null
      $tr.Paragraphs(1).Font.Size = 18; $tr.Paragraphs(1).ParagraphFormat.SpaceAfter = 6
      $tr.Paragraphs(2).Font.Size = 14.5; $tr.Paragraphs(2).ParagraphFormat.SpaceAfter = 10
      $tr.Paragraphs(3).Font.Size = 11.5; $tr.Paragraphs(3).Font.Italic = -1; $tr.Paragraphs(3).Font.Color.RGB = $GRIS
      ZonaDe3D $sl 331.2 115.2 583.2 381.6 $m | Out-Null
    } else {
      ZonaDe3D $sl 489.6 115.2 424.8 381.6 $m | Out-Null
    }
    Write-Output ("diapositiva {0,2}: {1}" -f $sl.SlideIndex, $m.nombre)
  }
  $pres.Save()
  # 4) imagenes para el sitio
  Get-ChildItem $imgDir -Filter 'diapositiva-*.jpg' | Remove-Item
  for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    $pres.Slides.Item($i).Export((Join-Path $imgDir ('diapositiva-{0:D2}.jpg' -f $i)), 'JPG', 1600, 900)
  }
  Write-Output ("{0} diapositivas" -f $pres.Slides.Count)
} finally {
  $pres.Close(); $app.Quit()
}
# 5) PowerPoint guarda los modelos sin comprimir: se vuelve a comprimir el archivo
#    (mismo contenido, mismo orden; PowerPoint lo abre igual) -> unos 25 MB menos
Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem
$comprimido = $trabajo + '.zip'
$zin = [System.IO.Compression.ZipFile]::OpenRead($trabajo)
$fs = [System.IO.File]::Open($comprimido, 'Create')
$zout = New-Object System.IO.Compression.ZipArchive($fs, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  foreach ($en in $zin.Entries) {
    $nuevo = $zout.CreateEntry($en.FullName, [System.IO.Compression.CompressionLevel]::Optimal)
    $o = $nuevo.Open(); $i = $en.Open(); $i.CopyTo($o); $i.Dispose(); $o.Dispose()
  }
} finally { $zout.Dispose(); $fs.Dispose(); $zin.Dispose() }
Copy-Item $comprimido $salida -Force
Remove-Item $trabajo, $comprimido
Write-Output ('guardado: ' + $salida + ' (' + [math]::Round((Get-Item $salida).Length / 1MB, 1) + ' MB)')

# 6) posiciones de las zonas 3D para la presentacion del sitio
& (Join-Path $PSScriptRoot 'zonas_3d.ps1')
