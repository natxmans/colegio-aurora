# =========================================================
# CONSTRUYE EL POWERPOINT CON LOS EDIFICIOS EN 3D (version 2)
# Parte de la presentacion original de 12 diapositivas (base-12-diapositivas.pptx)
# y sigue plan-3d.json, diapositiva por diapositiva y EN ESE ORDEN:
#   portada : el campus en 3D en lugar de la foto
#   3d      : titulo + tarjeta de texto corta + zona 3D GRANDE con el modelo real
#             (modelos/<id>.glb = los mismos modelos que el sitio) + botones
#             "Girar en 3D" (visor del sitio) y "Ver en el campus 3D" (campus vivo)
#   imagen  : diapositiva original con una imagen del campus real en vez de la foto
#   igual   : diapositiva original (solo cambia el numero del titulo)
# Los modelos se escalan para ocupar la zona SIN salir nunca de ella: se prueban
# 40 orientaciones y se usa la mas grande (PowerPoint ajusta el marco al girar).
# Despues: presentacion/nuestro_colegio_ideal.pptx, imagenes de las diapositivas
# para el sitio (img/diapositivas) y js/datos/diapositivas3d.json.
# Necesita PowerPoint (Microsoft 365). Uso: powershell -File anadir_3d.ps1
# (Los textos con acentos estan en plan-3d.json y modelos/modelos.json.)
# =========================================================
$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$plan = Get-Content (Join-Path $PSScriptRoot 'plan-3d.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$modelos = Get-Content (Join-Path $raiz 'modelos\modelos.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$base = Join-Path $PSScriptRoot 'base-12-diapositivas.pptx'
$imagenes = Join-Path $PSScriptRoot 'imagenes'
$trabajo = Join-Path $env:TEMP ('colegio-3d-' + [guid]::NewGuid().ToString('N').Substring(0, 8) + '.pptx')
$salida = Join-Path $raiz 'presentacion\nuestro_colegio_ideal.pptx'
$imgDir = Join-Path $raiz 'img\diapositivas'
$T = $plan.textos
$BULLET = [string][char]0x2022 + '  '

function Color([int]$r, [int]$g, [int]$b) { return $r + 256 * $g + 65536 * $b }
$MARINO = Color 20 40 90; $GRIS = Color 91 100 120; $BORDE = Color 208 216 222; $BLANCO = Color 255 255 255
$BEIGE = Color 236 226 207; $ARENA = Color 201 169 120; $TEXTO = Color 44 62 80

# Angulos de PowerPoint (X, Y, Z) para ver el modelo desde [azimut, altura] como en el visor 3D.
# PowerPoint gira el modelo con R = Rz . Ry . Rx; queremos R = Rx(altura) . Ry(-azimut).
function Angulos([double]$az, [double]$alt) {
  $a = $alt * [math]::PI / 180; $b = -$az * [math]::PI / 180
  $ca = [math]::Cos($a); $sa = [math]::Sin($a); $cb = [math]::Cos($b); $sb = [math]::Sin($b)
  $beta = [math]::Asin($ca * $sb); $alpha = [math]::Atan2($sa, $ca * $cb); $gamma = [math]::Atan2($sa * $sb, $cb)
  return @(($alpha * 180 / [math]::PI), ($beta * 180 / [math]::PI), ($gamma * 180 / [math]::PI))
}
function Modelo($id) { foreach ($m in $modelos) { if ($m.id -eq $id) { return $m } }; throw "Modelo desconocido: $id" }
function PonerTitulo($sl, $texto) { $sl.Shapes.Item('TextBox 1').TextFrame.TextRange.Paragraphs(2).Text = $texto }

function Boton($sl, [double]$L, [double]$Tp, [double]$W, [double]$H, $texto, $url, $pista, [bool]$principal) {
  $b = $sl.Shapes.AddShape(5, $L, $Tp, $W, $H)
  $b.Adjustments.Item(1) = 0.5
  $b.Fill.Solid(); $b.Fill.Transparency = 0; $b.Shadow.Visible = 0
  if ($principal) { $b.Fill.ForeColor.RGB = $MARINO; $b.Line.Visible = 0 } else { $b.Fill.ForeColor.RGB = $BLANCO; $b.Line.ForeColor.RGB = $MARINO; $b.Line.Weight = 1 }
  $b.TextFrame.MarginLeft = 4; $b.TextFrame.MarginRight = 4; $b.TextFrame.MarginTop = 0; $b.TextFrame.MarginBottom = 0; $b.TextFrame.WordWrap = 0
  $r = $b.TextFrame.TextRange; $r.Text = $texto
  $r.Font.Name = 'Arial'; $r.Font.Size = 10.5; $r.Font.Bold = -1; $r.Font.Color.RGB = $(if ($principal) { $BLANCO } else { $MARINO })
  $r.ParagraphFormat.Alignment = 2
  $b.ActionSettings.Item(1).Hyperlink.Address = $url
  $b.ActionSettings.Item(1).Hyperlink.ScreenTip = $pista
  return $b
}

function ZonaDe3D($sl, [double]$L, [double]$Tp, [double]$W, [double]$H, $m) {
  # quitar las fotos de la diapositiva
  for ($i = $sl.Shapes.Count; $i -ge 1; $i--) { $s = $sl.Shapes.Item($i); if ($s.Type -eq 13 -and $s.Width -gt 200) { $s.Delete() } }
  # fondo de la zona 3D: blanco arriba, beige abajo, borde fino como las tarjetas. TODA la zona es para el modelo.
  $p = $sl.Shapes.AddShape(5, $L, $Tp, $W, $H)
  $p.Name = 'Zona 3D'
  $p.Adjustments.Item(1) = 0.04
  $p.Fill.TwoColorGradient(1, 1); $p.Fill.ForeColor.RGB = $BLANCO; $p.Fill.BackColor.RGB = $BEIGE
  $p.Line.ForeColor.RGB = $BORDE; $p.Line.Weight = 0.75; $p.Shadow.Visible = 0
  $iL = $L + 8; $iT = $Tp + 8; $iW = $W - 16; $iH = $H - 16
  $glb = Join-Path $raiz ('modelos\' + $m.id + '.glb')
  $sh = $sl.Shapes.Add3DModel($glb, 0, -1, $iL, $iT, $iW, $iH)
  $sh.LockAspectRatio = -1
  # Tamano maximo que cabe en la zona en TODAS las vistas que se obtienen girando con el raton:
  # dar la vuelta al edificio (azimut 0-360) e inclinar la vista (altura -20 a 90, hasta el tejado).
  # PowerPoint ajusta el marco al modelo cada vez que se gira: asi el edificio no se corta y el
  # marco no sale de la zona. (Prueba real con el raton: una vista del tejado en diagonal hacia
  # salir el marco con la version anterior, que solo probaba giros alrededor de X y de Y.)
  $maxW = 0; $maxH = 0
  foreach ($alt in -20, 0, 20, 40, 60, 75, 90) { foreach ($az in 0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340) {
    $g = Angulos $az $alt
    $sh.Model3D.RotationX = [single]$g[0]; $sh.Model3D.RotationY = [single]$g[1]; $sh.Model3D.RotationZ = [single]$g[2]
    if ($sh.Width -gt $maxW) { $maxW = $sh.Width }; if ($sh.Height -gt $maxH) { $maxH = $sh.Height }
  } }
  $f = 0.985 * [math]::Min($iW / $maxW, $iH / $maxH)
  $ang = Angulos $m.giro[0] $m.giro[1]
  # (siempre en [single]: PowerShell no convierte bien otros tipos para estas propiedades)
  $sh.Model3D.RotationX = [single]$ang[0]; $sh.Model3D.RotationY = [single]$ang[1]; $sh.Model3D.RotationZ = [single]$ang[2]
  $sh.Width = [single]([double]$sh.Width * $f)
  $cx = $iL + $iW / 2; $cy = $iT + $iH / 2
  $sh.Left = [single]($cx - $sh.Width / 2); $sh.Top = [single]($cy - $sh.Height / 2)
  $sh.Name = 'Modelo 3D - ' + $m.id
  $sh.AlternativeText = 'Modelo 3D: ' + $m.nombre + ' (Colegio Pablo Picasso). Se puede girar.'
  return $sh
}

# Instrucciones + botones (fuera de la zona 3D, en la columna de la izquierda)
function Mandos($sl, [double]$x, [double]$y, [double]$w, $m, $leyenda, [bool]$apilar) {
  $ley = $sl.Shapes.AddTextbox(1, $x, $y, $w, 26)
  $ley.Name = 'Leyenda 3D'
  $ley.TextFrame.WordWrap = -1; $ley.TextFrame.AutoSize = 0; $ley.TextFrame.VerticalAnchor = 3
  $ley.TextFrame.MarginLeft = 2; $ley.TextFrame.MarginRight = 0; $ley.TextFrame.MarginTop = 0; $ley.TextFrame.MarginBottom = 0
  $r = $ley.TextFrame.TextRange; $r.Text = $leyenda
  $r.Font.Name = 'Arial'; $r.Font.Size = 10; $r.Font.Italic = -1; $r.Font.Color.RGB = $GRIS
  if ($apilar) { $an = $w; $x2 = $x; $y1 = $y + 30; $y2 = $y + 58 } else { $an = ($w - 8) / 2; $x2 = $x + $an + 8; $y1 = $y + 32; $y2 = $y + 32 }
  $b1 = Boton $sl $x $y1 $an 24 $T.botonGirar ($plan.url + 'visor3d.html?m=' + $m.id) $T.pistaGirar $true
  $b1.Name = 'Boton Girar en 3D'
  $b2 = Boton $sl $x2 $y2 $an 24 $T.botonCampus ($plan.url + $m.campus + '#campus') $T.pistaCampus $false
  $b2.Name = 'Boton Ver en el campus'
}

function TarjetaTexto($c, $lineas, [double]$tamTitulo, [double]$tamTexto) {
  $tr = $c.TextFrame.TextRange
  $p1 = $tr.Paragraphs(1); $p1.Characters(1, $p1.Length - 1).Text = $lineas[0]
  $tr.Paragraphs(2).Text = $BULLET + $lineas[1]
  for ($k = 2; $k -lt $lineas.Count; $k++) { $tr.InsertAfter("`r" + $BULLET + $lineas[$k]) | Out-Null }
  $tr.Paragraphs(1).Font.Size = $tamTitulo; $tr.Paragraphs(1).ParagraphFormat.SpaceAfter = 8
  for ($k = 2; $k -le $tr.Paragraphs().Count; $k++) { $p = $tr.Paragraphs($k); $p.Font.Size = $tamTexto; $p.ParagraphFormat.SpaceAfter = 7 }
}

Copy-Item $base $trabajo -Force
$app = New-Object -ComObject PowerPoint.Application
$pres = $app.Presentations.Open($trabajo, 0, 0, 0)
try {
  $ids = @{}
  for ($i = 1; $i -le $pres.Slides.Count; $i++) { $ids[$i] = $pres.Slides.Item($i).SlideID }
  $originales = @($ids.Values)
  function Copia($n) { $s = $pres.Slides.FindBySlideID($ids[$n]); $d = $s.Duplicate().Item(1); $d.MoveTo($pres.Slides.Count); return $d }

  foreach ($e in $plan.diapositivas) {
    switch ($e.tipo) {
      'portada' {
        $sl = Copia 1
        ZonaDe3D $sl 446.4 36 477.6 468 (Modelo $e.modelo) | Out-Null
        Mandos $sl 57.6 404 372 (Modelo $e.modelo) $T.leyendaPortada $false
      }
      'igual' { $sl = Copia $e.base; PonerTitulo $sl $e.titulo }
      'imagen' {
        $sl = Copia $e.base; PonerTitulo $sl $e.titulo
        $f = $null; foreach ($s in $sl.Shapes) { if ($s.Type -eq 13 -and $s.Width -gt 200) { $f = $s } }
        $L = $f.Left; $Tp = $f.Top; $W = $f.Width; $H = $f.Height; $f.Delete()
        $img = $sl.Shapes.AddPicture((Join-Path $imagenes $e.imagen), 0, -1, $L, $Tp, $W, $H)
        $img.Name = 'Imagen del campus 3D'
        $img.AlternativeText = 'Imagen del campus 3D del sitio (Colegio Pablo Picasso)'
        $img.Line.Visible = 0
        if ($e.tarjetaExtra) {
          # una tarjeta mas (copia del estilo de las otras) y las tarjetas se reparten la altura
          $cards = @(); foreach ($s in $sl.Shapes) { if ($s.Type -eq 1 -and $s.HasTextFrame -and $s.Left -lt 100) { $cards += $s } }
          $nueva = $cards[$cards.Count - 1].Duplicate().Item(1)
          $tr = $nueva.TextFrame.TextRange
          $p1 = $tr.Paragraphs(1); $p1.Characters(1, $p1.Length - 1).Text = $e.tarjetaExtra[0]
          $tr.Paragraphs(2).Text = $BULLET + $e.tarjetaExtra[1]
          $cards += $nueva
          $y0 = 115.2; $hueco = 10.8; $alto = (381.6 - $hueco * ($cards.Count - 1)) / $cards.Count
          for ($k = 0; $k -lt $cards.Count; $k++) { $cards[$k].Left = 43.2; $cards[$k].Width = 424.8; $cards[$k].Top = $y0 + $k * ($alto + $hueco); $cards[$k].Height = $alto }
        }
      }
      '3d' {
        $sl = Copia 4; PonerTitulo $sl $e.titulo
        for ($i = $sl.Shapes.Count; $i -ge 1; $i--) { $s = $sl.Shapes.Item($i); if ($s.Type -eq 1 -and $s.Name -ne 'Rounded Rectangle 3') { $s.Delete() } }
        $c = $sl.Shapes.Item('Rounded Rectangle 3')
        $c.Left = 43.2; $c.Top = 115.2; $c.Width = 230.4; $c.Height = 306
        $c.TextFrame.VerticalAnchor = 3; $c.TextFrame.MarginLeft = 14; $c.TextFrame.MarginRight = 12
        TarjetaTexto $c $e.tarjeta 17 13.5
        Mandos $sl 43.2 430 230.4 (Modelo $e.modelo) $T.leyenda $true
        ZonaDe3D $sl 288 108 628.8 408 (Modelo $e.modelo) | Out-Null
      }
    }
    $m3 = $null; foreach ($s in $sl.Shapes) { if ($s.Type -eq 30) { $m3 = $s.Name } }
    Write-Output ("diapositiva {0,2}: {1} {2}" -f $sl.SlideIndex, $e.tipo, $m3)
  }
  # quitar las 12 diapositivas originales (ya copiadas y modificadas)
  foreach ($id in $originales) { $pres.Slides.FindBySlideID($id).Delete() }
  $pres.Save()
  Get-ChildItem $imgDir -Filter 'diapositiva-*.jpg' | Remove-Item
  for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    $pres.Slides.Item($i).Export((Join-Path $imgDir ('diapositiva-{0:D2}.jpg' -f $i)), 'JPG', 1600, 900)
  }
  Write-Output ("{0} diapositivas" -f $pres.Slides.Count)
} finally {
  $pres.Close(); $app.Quit()
}
# PowerPoint guarda los modelos sin comprimir: se vuelve a comprimir el archivo (mismo contenido)
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
& (Join-Path $PSScriptRoot 'zonas_3d.ps1')
