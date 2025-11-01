# launch_qemu.ps1

# Change directory to the folder containing QEMU
Set-Location -Path $PSScriptRoot

# QEMU command (replace overlay_a1.qcow2 with dynamic value if needed)
$qemuArgs = "-m 1G -smp 2 -nographic -device virtio-net-pci,netdev=net0 -netdev user,id=net0,hostfwd=tcp::2222-:22 -drive if=virtio,format=qcow2,file=..\drives\overlay\overlay_a1.qcow2 -monitor telnet::45454,server,nowait -serial mon:stdio"

# Launch QEMU
Start-Process "qemu-system-x86_64.exe" -ArgumentList $qemuArgs -Wait -NoNewWindow
