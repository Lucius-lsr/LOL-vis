import os, sys
from pathlib import Path

def renamefiles():
    folder = Path('public/imgs')
    for p in folder.rglob('./*.png'):
        p.rename(Path(p.parent, p.name.split('_')[-1]))

if __name__ == '__main__':
    renamefiles()
