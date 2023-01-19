import subprocess

requirements = [
    "json",
    "bottle",
    "eel",
    "github",
    "os",
    "time"
]

for i in requirements:
    subprocess.call(['pip', 'install', i])