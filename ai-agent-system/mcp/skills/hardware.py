import subprocess
import platform

def list_hardware_ports():
    """
    Detects active COM/Serial/USB ports based on the OS.
    """
    system = platform.system()
    ports = []
    
    try:
        if system == "Windows":
            # For demonstration, typically use serial.tools.list_ports
            # Since I can't install 'pyserial' here easily, we use a shell fallback
            import serial.tools.list_ports
            ports = [p.device for p in serial.tools.list_ports.comports()]
        else:
            # Linux/Mac fallback
            result = subprocess.run("ls /dev/tty*", shell=True, capture_output=True, text=True)
            ports = result.stdout.split()
    except ImportError:
        return {"error": "pyserial not installed", "fallback": ["/dev/ttyUSB0", "COM3"]}
    except Exception as e:
        return {"error": str(e)}

    return ports
