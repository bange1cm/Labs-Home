@echo off

rem Optional first arg: overlay filename (e.g. overlay_a1.qcow2). Defaults to overlay_a1.qcow2
set overlay=%1
if "%overlay%"=="" set overlay=overlay_a1.qcow2

cd win64

qemu-system-x86_64 ^
  -m 1G ^
  -smp 2 ^
  -nographic ^
  -device virtio-net-pci,netdev=net0 ^
  -netdev user,id=net0,hostfwd=tcp::2222-:22 ^
  -drive if=virtio,format=qcow2,file=..\drives\overlay\%overlay% ^
  -monitor telnet::45454,server,nowait ^
  -serial mon:stdio
