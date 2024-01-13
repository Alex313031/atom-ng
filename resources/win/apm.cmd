@echo off

set NODE_SKIP_PLATFORM_CHECK=1

"%~dp0\..\app\apm\bin\apm.cmd" %*
