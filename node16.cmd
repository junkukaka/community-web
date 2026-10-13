@echo off
setlocal
set "NODE16_HOME=%~dp0.tools\node16\node-v16.20.2-win-x64"
if not exist "%NODE16_HOME%\node.exe" (
  echo Project Node 16.20.2 is missing: "%NODE16_HOME%" 1>&2
  exit /b 1
)
set "PATH=%NODE16_HOME%;%PATH%"
pushd "%~dp0"
if not "%~1"=="" goto run
cmd /D /K
goto done
:run
call %*
:done
set "NODE16_EXIT_CODE=%errorlevel%"
popd
exit /b %NODE16_EXIT_CODE%
