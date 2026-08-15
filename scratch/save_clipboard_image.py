import os
import sys
import subprocess
from datetime import datetime
from PIL import Image, ImageGrab

# Set stdout encoding to utf-8 if possible
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def get_image_from_clipboard():
    try:
        data = ImageGrab.grabclipboard()
        if isinstance(data, Image.Image):
            return data, "clipboard_image"
        elif isinstance(data, list) and len(data) > 0:
            # Clipboard contains list of file paths (e.g. copied file from Explorer)
            first_path = data[0]
            if os.path.exists(first_path):
                try:
                    img = Image.open(first_path)
                    return img, "clipboard_file"
                except Exception:
                    pass
    except Exception:
        pass
    return None, None

def get_image_from_screen():
    # Fallback 1: PIL ImageGrab.grab()
    try:
        img = ImageGrab.grab()
        if img is not None:
            return img, "screen_grab"
    except Exception:
        pass
    
    # Fallback 2: PowerShell System.Drawing Screen Grab for Windows CLI environment
    try:
        ps_script = (
            "Add-Type -AssemblyName System.Windows.Forms, System.Drawing; "
            "$bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds; "
            "$bmp = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height; "
            "$graphics = [System.Drawing.Graphics]::FromImage($bmp); "
            "$graphics.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size); "
            "$tempPath = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), 'cli_screen_temp.png'); "
            "$bmp.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png); "
            "$graphics.Dispose(); $bmp.Dispose(); "
            "Write-Output $tempPath"
        )
        res = subprocess.run(["powershell", "-NoProfile", "-Command", ps_script], capture_output=True, text=True)
        temp_file = res.stdout.strip()
        if os.path.exists(temp_file):
            img = Image.open(temp_file)
            return img, "powershell_screen_grab"
    except Exception:
        pass

    return None, None

def save_clipboard_image(force_screen=False):
    img, source = None, None

    if not force_screen:
        img, source = get_image_from_clipboard()

    if img is None:
        print("[*] 클립보드에 이미지 데이터가 없어 CLI 화면 자동 스크린샷 캡처를 수행합니다...")
        img, source = get_image_from_screen()

    if img is None:
        print("[❌] 스크린샷 캡처 실패: 클립보드 및 화면 전체 캡처를 실행할 수 없습니다.")
        return None

    # Target folder: scratch directory inside working directory
    target_dir = os.path.abspath(os.path.join(os.getcwd(), 'scratch'))
    os.makedirs(target_dir, exist_ok=True)

    filename = f"capture_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
    filepath = os.path.abspath(os.path.join(target_dir, filename))

    try:
        img.save(filepath, 'PNG')
    except Exception as e:
        print(f"[❌] 이미지 파일 저장 실패 ({filepath}): {e}")
        return None

    # Copy file path to Windows Clipboard
    try:
        p = subprocess.Popen('clip', stdin=subprocess.PIPE, shell=True)
        p.communicate(input=filepath.encode('cp949'), timeout=1)
    except Exception:
        pass

    print(f"[+] 캡처 이미지가 자동으로 저장되고 경로가 클립보드에 복사되었습니다! (출처: {source})")
    print(f"[*] 저장 경로: {filepath}")
    print("[*] 이제 입력창에서 바로 [ Ctrl + V ] 를 누르면 파일 경로가 입력됩니다.")
    return filepath

if __name__ == '__main__':
    force_screen = '--screen' in sys.argv
    save_clipboard_image(force_screen=force_screen)

