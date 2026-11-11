@echo off
title Colegio Aurora - serveur local
cd /d "%~dp0"
echo.
echo   COLEGIO AURORA - Nuestro colegio ideal
echo   Le site s'ouvre dans le navigateur : http://localhost:8820
echo   (laisse cette fenetre ouverte pendant la presentation)
echo.
start "" "http://localhost:8820"
python servidor.py 8820
if errorlevel 1 (
  echo.
  echo   Python n'est pas installe sur ce PC.
  echo   Solution : utilise la version en ligne du site.
  pause
)
