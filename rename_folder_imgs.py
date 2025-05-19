import asyncio
from googletrans import Translator
from PIL import Image, UnidentifiedImageError
from pathlib import Path
import os
import re
import mimetypes


translator = Translator()
PUBLIC_PATH = r"public"

def is_identifier_file(filename):
    return filename.lower().endswith('.identifier') or filename == '.DS_Store'

async def normalize_name(name: str):
    try:
        name = re.sub('\bCLB\b', 'câu_lạc_bộ', name, flags=re.IGNORECASE)
        name = re.sub('\bđh\b', 'đại_học', name, flags=re.IGNORECASE)
        name = re.sub('\b+\b', 'and', name)
        name = re.sub('\bSVNCKH\b', 'sinh_viên_nghiên_cứu_khoa_học', name, flags=re.IGNORECASE)
        name = re.sub('\bNCKH\b', 'nghiên_cứu_khoa_học', name, flags=re.IGNORECASE)
        translated_result = await translator.translate(name, dest='en')
        translated_name = translated_result.text
        normalized_name = ''.join(c if c.isalnum() else '_' for c in translated_name)

        while '__' in normalized_name:
            normalized_name = normalized_name.replace('__', '_')
        normalized_name = normalized_name.strip('_').lower()

        return normalized_name
    except Exception as e:
        print(f"Error occurred when normalizing name: {str(e)}")
        return name.replace(' ', '_')
    
async def rename_files_and_folders(path: str, rename_dirs=True, remove_identifiers=True):
    if not os.path.exists(path):
        print(f"Path not found: {path}")
        return
    
    
    try:
        items = list(os.listdir(path))
        for item in items:
            item_path = os.path.join(path, item)

            if os.path.isfile(item_path) and is_identifier_file(item):
                if remove_identifiers:
                    try:
                        os.remove(item_path)
                        print(f"Removed Identifier file: {item_path}")
                    except Exception as e:
                        print(f"Error removing Identifier file {item_path}: {str(e)}")
                continue

            if os.path.isfile(item_path):
                file_path = Path(item_path)
                original_name = file_path.stem
                ext = file_path.suffix

                try:
                    if not ext or ext.lower() not in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']:
                        mime_type = mimetypes.guess_type(item_path)[0]
                        if mime_type and mime_type.startswith('image/'):
                            try:
                                with Image.open(item_path) as img:
                                    if not ext:
                                        ext = f'.{img.format.lower()}' if img.format else ""
                            except UnidentifiedImageError:
                                pass
                    else:
                        ext = ext.lower()
                    normalized_name = await normalize_name(original_name)
                    new_file_name = f"{normalized_name}{ext}"
                    new_file_path = os.path.join(path, new_file_name)

                    cnt = 1
                    while os.path.exists(new_file_path) and item_path != new_file_path:
                        new_file_name = f"{normalized_name}_{cnt}{ext}"
                        new_file_path = os.path.join(path, new_file_name)
                        cnt += 1

                    if item_path != new_file_path:
                        os.rename(item_path, new_file_path)
                        print(f"Renamed file: {item} -> {new_file_name}")

                except Exception as e:
                    print(f"Error processing file {item_path}: {str(e)}")

        for item in items:
            item_path = os.path.join(path, item)
            if os.path.isdir(item_path):
                await rename_files_and_folders(item_path, rename_dirs, remove_identifiers=True)

                if rename_dirs:
                    try:
                        normalized_dir_name = await normalize_name(item)
                        new_dir_path = os.path.join(path, normalized_dir_name)

                        cnt = 1
                        while os.path.exists(new_dir_path) and item_path != new_dir_path:
                            new_dir_name = f"{normalized_dir_name}_{cnt}"
                            new_dir_path = os.path.join(path, new_dir_name)
                            cnt += 1

                        if item_path != new_dir_path:
                            os.rename(item_path, new_dir_path)
                            print(f"Renamed directory: {item} -> {normalized_dir_name}")
                    except Exception as e:
                        print(f"Error renaming directory {item_path}: {str(e)}")
    except Exception as e:
        print(f"Error reading directory {path}: {str(e)}")


async def main():
    print("Starting renaming process...")
    await rename_files_and_folders(PUBLIC_PATH)
    print("Renaming process completed!")


if __name__ == "__main__":
    asyncio.run(main())